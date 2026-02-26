"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { ActionResult } from "./schemas";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UploadType = "inventory" | "production" | "reports";

type CsvRow = Record<string, string>;

type IngestResult = ActionResult<{ inserted: number; skipped: number }>;

// ─── Key Normalizer ───────────────────────────────────────────────────────────
// PapaParse on Windows can produce keys with BOM prefix (\uFEFF), trailing \r,
// or extra whitespace. This normalizes all row keys before processing.

function normalizeRow(row: CsvRow): CsvRow {
    const normalized: CsvRow = {};
    for (const [key, value] of Object.entries(row)) {
        const cleanKey = key
            .replace(/^\uFEFF/, "")  // strip BOM
            .replace(/\r/g, "")      // strip carriage returns
            .trim()
            .toLowerCase();
        normalized[cleanKey] = (value ?? "").trim();
    }
    return normalized;
}

function normalizeRows(rows: CsvRow[]): CsvRow[] {
    return rows.map(normalizeRow);
}

// ─── Inventory Sync ───────────────────────────────────────────────────────────
// CSV: material_name, quantity, unit, location
// If item exists → update current_stock, else → insert with sensible defaults

async function ingestInventory(rows: CsvRow[]): Promise<IngestResult> {
    const supabase = await createClient();
    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
        const itemName = row.material_name?.trim();
        const quantity = parseFloat(row.quantity);
        const unit = row.unit?.trim() || "units";

        if (!itemName || isNaN(quantity)) {
            skipped++;
            continue;
        }

        // Check if item already exists
        const { data: existing } = await supabase
            .from("inventory_items")
            .select("id")
            .eq("item_name", itemName)
            .maybeSingle();

        if (existing) {
            // Update existing stock
            const { error } = await supabase
                .from("inventory_items")
                .update({
                    current_stock: quantity,
                    unit,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id);

            if (error) {
                skipped++;
                continue;
            }
        } else {
            // Insert new item with sensible defaults
            const dailyConsumption = Math.max(1, Math.round(quantity * 0.05));
            const { error } = await supabase.from("inventory_items").insert({
                item_name: itemName,
                current_stock: quantity,
                minimum_stock: Math.round(quantity * 0.2),
                safety_stock: Math.round(quantity * 0.3),
                daily_consumption: dailyConsumption,
                lead_time_days: 3,
                unit,
            });

            if (error) {
                skipped++;
                continue;
            }
        }
        inserted++;
    }

    revalidatePath("/inventory");
    revalidatePath("/overview");
    return { success: true, data: { inserted, skipped } };
}

// ─── Production Plan (BOM) ────────────────────────────────────────────────────
// CSV: material_name, planned_qty, unit_cost, batch_id
// Groups rows by batch_id → creates an Order per batch, then BOM items under it

async function ingestProduction(rows: CsvRow[]): Promise<IngestResult> {
    const supabase = await createClient();
    let inserted = 0;
    let skipped = 0;

    // Group rows by batch_id
    const batches = new Map<string, CsvRow[]>();
    for (const row of rows) {
        const batchId = row.batch_id?.trim();
        if (!batchId) {
            skipped++;
            continue;
        }
        if (!batches.has(batchId)) batches.set(batchId, []);
        batches.get(batchId)!.push(row);
    }

    for (const [batchId, batchRows] of batches) {
        // Check if order already exists for this batch
        let orderId: string;

        const { data: existingOrder } = await supabase
            .from("orders")
            .select("id")
            .eq("order_number", batchId)
            .maybeSingle();

        if (existingOrder) {
            orderId = existingOrder.id;
        } else {
            // Create a new order for this batch
            const { data: newOrder, error: orderError } = await supabase
                .from("orders")
                .insert({
                    order_number: batchId,
                    description: `CSV Import — ${batchId}`,
                    status: "active",
                })
                .select("id")
                .single();

            if (orderError || !newOrder) {
                skipped += batchRows.length;
                continue;
            }
            orderId = newOrder.id;
        }

        // Insert BOM items
        for (const row of batchRows) {
            const itemName = row.material_name?.trim();
            const plannedQty = parseFloat(row.planned_qty);
            const unitCost = parseFloat(row.unit_cost);

            if (!itemName || isNaN(plannedQty) || isNaN(unitCost)) {
                skipped++;
                continue;
            }

            const { error } = await supabase.from("bom_items").insert({
                order_id: orderId,
                item_name: itemName,
                planned_qty: plannedQty,
                planned_rate: unitCost,
                unit: "units",
            });

            if (error) {
                skipped++;
                continue;
            }
            inserted++;
        }
    }

    revalidatePath("/planning");
    revalidatePath("/overview");
    return { success: true, data: { inserted, skipped } };
}

// ─── Daily Reports (Actual Consumptions) ──────────────────────────────────────
// CSV: date, material_name, actual_qty, actual_cost
// Tries to match material_name to an existing bom_item to link the consumption

async function ingestReports(rows: CsvRow[]): Promise<IngestResult> {
    const supabase = await createClient();
    let inserted = 0;
    let skipped = 0;

    // Pre-fetch all BOM items for matching
    const { data: allBomItems } = await supabase
        .from("bom_items")
        .select("id, item_name");

    const bomLookup = new Map<string, string>();
    if (allBomItems) {
        for (const item of allBomItems) {
            bomLookup.set(item.item_name.toLowerCase(), item.id);
        }
    }

    for (const row of rows) {
        const materialName = row.material_name?.trim();
        const actualQty = parseFloat(row.actual_qty);
        const actualCost = parseFloat(row.actual_cost);
        const date = row.date?.trim();

        if (!materialName || isNaN(actualQty) || isNaN(actualCost)) {
            skipped++;
            continue;
        }

        // Find matching BOM item
        const bomItemId = bomLookup.get(materialName.toLowerCase());
        if (!bomItemId) {
            // No matching BOM item found — skip this row
            skipped++;
            continue;
        }

        // Compute rate = total_cost / qty
        const actualRate = actualQty > 0 ? actualCost / actualQty : 0;

        const { error } = await supabase.from("actual_consumptions").insert({
            bom_item_id: bomItemId,
            actual_qty: actualQty,
            actual_rate: Math.round(actualRate * 100) / 100,
            reason: "normal",
            notes: `CSV Import — ${date || "no date"}`,
            consumed_at: date ? new Date(date).toISOString() : new Date().toISOString(),
        });

        if (error) {
            skipped++;
            continue;
        }
        inserted++;
    }

    revalidatePath("/consumption");
    revalidatePath("/reports");
    revalidatePath("/overview");
    return { success: true, data: { inserted, skipped } };
}

// ─── Main Ingest Action ───────────────────────────────────────────────────────

export async function ingestCsvData(
    type: UploadType,
    rows: CsvRow[]
): Promise<IngestResult> {
    if (!rows || rows.length === 0) {
        return { success: false, error: "No data rows to ingest" };
    }

    // Normalize all row keys (strip BOM, whitespace, lowercase)
    const cleanRows = normalizeRows(rows);

    try {
        switch (type) {
            case "inventory":
                return await ingestInventory(cleanRows);
            case "production":
                return await ingestProduction(cleanRows);
            case "reports":
                return await ingestReports(cleanRows);
            default:
                return { success: false, error: `Unknown upload type: ${type}` };
        }
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown error during ingestion",
        };
    }
}
