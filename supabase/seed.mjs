/**
 * CostIQ Hackathon: Database Seeder
 * Run: node supabase/seed.mjs
 * 
 * Seeds all 6 tables with realistic textile manufacturing data.
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://qxdvohfgtzpyhdkbegym.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZHZvaGZndHpweWhka2JlZ3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzc4ODAsImV4cCI6MjA4NjkxMzg4MH0.VDIV7DMSwN8mSfZL-Bk0pb8ROlws4HJh0835LndjZc4"
);

async function seed() {
    console.log("🌱 CostIQ Database Seeder");
    console.log("═".repeat(50));

    // ── 1. Clean existing data ──────────────────────────
    console.log("\n🗑️  Cleaning existing data...");

    // Delete in dependency order
    let r;
    r = await supabase.from("actual_consumptions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (r.error) console.warn("  ⚠ actual_consumptions:", r.error.message);
    else console.log("  ✓ actual_consumptions cleared");

    r = await supabase.from("bom_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (r.error) console.warn("  ⚠ bom_items:", r.error.message);
    else console.log("  ✓ bom_items cleared");

    r = await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (r.error) console.warn("  ⚠ orders:", r.error.message);
    else console.log("  ✓ orders cleared");

    r = await supabase.from("inventory_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (r.error) console.warn("  ⚠ inventory_items:", r.error.message);
    else console.log("  ✓ inventory_items cleared");

    r = await supabase.from("material_inventory").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (r.error) console.warn("  ⚠ material_inventory:", r.error.message);
    else console.log("  ✓ material_inventory cleared");

    r = await supabase.from("production_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (r.error) console.warn("  ⚠ production_logs:", r.error.message);
    else console.log("  ✓ production_logs cleared");

    // ── 2. ORDERS ───────────────────────────────────────
    console.log("\n📦 Seeding orders...");
    const orders = [
        { id: "a1000000-0000-0000-0000-000000000001", order_number: "PO-2026-001", description: "Premium Cotton T-Shirts – 5,000 units", status: "active", created_at: "2026-01-15T09:00:00+05:30" },
        { id: "a1000000-0000-0000-0000-000000000002", order_number: "PO-2026-002", description: "Denim Jeans – 3,000 units", status: "active", created_at: "2026-01-18T10:30:00+05:30" },
        { id: "a1000000-0000-0000-0000-000000000003", order_number: "PO-2026-003", description: "Silk Sarees – 1,200 units", status: "active", created_at: "2026-01-22T08:00:00+05:30" },
        { id: "a1000000-0000-0000-0000-000000000004", order_number: "PO-2026-004", description: "Polyester Blended Shirts – 4,000 units", status: "active", created_at: "2026-02-01T11:00:00+05:30" },
        { id: "a1000000-0000-0000-0000-000000000005", order_number: "PO-2026-005", description: "Linen Kurtas – 2,500 units", status: "active", created_at: "2026-02-05T09:30:00+05:30" },
        { id: "a1000000-0000-0000-0000-000000000006", order_number: "PO-2025-048", description: "Winter Jackets – 2,000 units", status: "completed", created_at: "2025-11-10T08:00:00+05:30" },
        { id: "a1000000-0000-0000-0000-000000000007", order_number: "PO-2025-049", description: "Formal Trousers – 3,500 units", status: "completed", created_at: "2025-12-01T09:00:00+05:30" },
        { id: "a1000000-0000-0000-0000-000000000008", order_number: "PO-2026-006", description: "Embroidered Cushion Covers – 6,000 units", status: "draft", created_at: "2026-02-16T14:00:00+05:30" },
    ];
    r = await supabase.from("orders").insert(orders);
    if (r.error) { console.error("  ✗ orders:", r.error.message); return; }
    console.log(`  ✓ ${orders.length} orders inserted`);

    // ── 3. BOM ITEMS ────────────────────────────────────
    console.log("\n📋 Seeding BOM items...");
    const bomItems = [
        // PO-2026-001: Cotton T-Shirts
        { id: "b1000000-0000-0000-0000-000000000001", order_id: "a1000000-0000-0000-0000-000000000001", item_name: "Cotton Fabric 60s", planned_qty: 2500, planned_rate: 320, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000002", order_id: "a1000000-0000-0000-0000-000000000001", item_name: "Polyester Thread", planned_qty: 150, planned_rate: 85, unit: "kg" },
        { id: "b1000000-0000-0000-0000-000000000003", order_id: "a1000000-0000-0000-0000-000000000001", item_name: "Buttons (Pearl)", planned_qty: 25000, planned_rate: 2.50, unit: "pieces" },
        { id: "b1000000-0000-0000-0000-000000000004", order_id: "a1000000-0000-0000-0000-000000000001", item_name: "Packaging Material", planned_qty: 5000, planned_rate: 8, unit: "pieces" },
        { id: "b1000000-0000-0000-0000-000000000005", order_id: "a1000000-0000-0000-0000-000000000001", item_name: "Dye (Reactive Colors)", planned_qty: 80, planned_rate: 450, unit: "kg" },
        // PO-2026-002: Denim Jeans
        { id: "b1000000-0000-0000-0000-000000000006", order_id: "a1000000-0000-0000-0000-000000000002", item_name: "Denim Fabric 14oz", planned_qty: 4500, planned_rate: 480, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000007", order_id: "a1000000-0000-0000-0000-000000000002", item_name: "Rivets (Brass)", planned_qty: 18000, planned_rate: 3.20, unit: "pieces" },
        { id: "b1000000-0000-0000-0000-000000000008", order_id: "a1000000-0000-0000-0000-000000000002", item_name: "Zippers (YKK)", planned_qty: 3000, planned_rate: 15, unit: "pieces" },
        { id: "b1000000-0000-0000-0000-000000000009", order_id: "a1000000-0000-0000-0000-000000000002", item_name: "Indigo Dye", planned_qty: 120, planned_rate: 520, unit: "kg" },
        { id: "b1000000-0000-0000-0000-000000000010", order_id: "a1000000-0000-0000-0000-000000000002", item_name: "Cotton Thread", planned_qty: 200, planned_rate: 72, unit: "kg" },
        // PO-2026-003: Silk Sarees
        { id: "b1000000-0000-0000-0000-000000000011", order_id: "a1000000-0000-0000-0000-000000000003", item_name: "Pure Silk Yarn", planned_qty: 600, planned_rate: 2800, unit: "kg" },
        { id: "b1000000-0000-0000-0000-000000000012", order_id: "a1000000-0000-0000-0000-000000000003", item_name: "Zari Thread (Gold)", planned_qty: 180, planned_rate: 1650, unit: "kg" },
        { id: "b1000000-0000-0000-0000-000000000013", order_id: "a1000000-0000-0000-0000-000000000003", item_name: "Natural Dyes", planned_qty: 45, planned_rate: 780, unit: "kg" },
        // PO-2026-004: Polyester Shirts
        { id: "b1000000-0000-0000-0000-000000000014", order_id: "a1000000-0000-0000-0000-000000000004", item_name: "Poly-Cotton Blend", planned_qty: 3200, planned_rate: 220, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000015", order_id: "a1000000-0000-0000-0000-000000000004", item_name: "Interlining Fabric", planned_qty: 800, planned_rate: 95, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000016", order_id: "a1000000-0000-0000-0000-000000000004", item_name: "Buttons (Plastic)", planned_qty: 20000, planned_rate: 1.50, unit: "pieces" },
        { id: "b1000000-0000-0000-0000-000000000017", order_id: "a1000000-0000-0000-0000-000000000004", item_name: "Labels & Tags", planned_qty: 4000, planned_rate: 4.00, unit: "pieces" },
        // PO-2026-005: Linen Kurtas
        { id: "b1000000-0000-0000-0000-000000000018", order_id: "a1000000-0000-0000-0000-000000000005", item_name: "Pure Linen Fabric", planned_qty: 2000, planned_rate: 560, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000019", order_id: "a1000000-0000-0000-0000-000000000005", item_name: "Shell Buttons", planned_qty: 12500, planned_rate: 5.00, unit: "pieces" },
        { id: "b1000000-0000-0000-0000-000000000020", order_id: "a1000000-0000-0000-0000-000000000005", item_name: "Embroidery Thread", planned_qty: 60, planned_rate: 320, unit: "kg" },
        // PO-2025-048: Winter Jackets (completed, savings)
        { id: "b1000000-0000-0000-0000-000000000021", order_id: "a1000000-0000-0000-0000-000000000006", item_name: "Fleece Fabric", planned_qty: 3000, planned_rate: 410, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000022", order_id: "a1000000-0000-0000-0000-000000000006", item_name: "Nylon Zipper (Heavy)", planned_qty: 2000, planned_rate: 28, unit: "pieces" },
        { id: "b1000000-0000-0000-0000-000000000023", order_id: "a1000000-0000-0000-0000-000000000006", item_name: "Polyester Lining", planned_qty: 2400, planned_rate: 150, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000024", order_id: "a1000000-0000-0000-0000-000000000006", item_name: "Snap Buttons (Metal)", planned_qty: 8000, planned_rate: 6.50, unit: "pieces" },
        // PO-2025-049: Formal Trousers (completed, overrun)
        { id: "b1000000-0000-0000-0000-000000000025", order_id: "a1000000-0000-0000-0000-000000000007", item_name: "Worsted Wool Blend", planned_qty: 3500, planned_rate: 640, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000026", order_id: "a1000000-0000-0000-0000-000000000007", item_name: "Pocket Lining", planned_qty: 3500, planned_rate: 45, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000027", order_id: "a1000000-0000-0000-0000-000000000007", item_name: "Belt Hooks", planned_qty: 3500, planned_rate: 8.00, unit: "pieces" },
        { id: "b1000000-0000-0000-0000-000000000028", order_id: "a1000000-0000-0000-0000-000000000007", item_name: "Waistband Elastic", planned_qty: 1800, planned_rate: 35, unit: "meters" },
        // PO-2026-006: Cushion Covers (draft)
        { id: "b1000000-0000-0000-0000-000000000029", order_id: "a1000000-0000-0000-0000-000000000008", item_name: "Canvas Fabric", planned_qty: 4800, planned_rate: 180, unit: "meters" },
        { id: "b1000000-0000-0000-0000-000000000030", order_id: "a1000000-0000-0000-0000-000000000008", item_name: "Embroidery Thread Mix", planned_qty: 90, planned_rate: 380, unit: "kg" },
    ];
    r = await supabase.from("bom_items").insert(bomItems);
    if (r.error) { console.error("  ✗ bom_items:", r.error.message); return; }
    console.log(`  ✓ ${bomItems.length} BOM items inserted`);

    // ── 4. ACTUAL CONSUMPTIONS ──────────────────────────
    console.log("\n💰 Seeding actual consumptions...");
    const consumptions = [
        // PO-2026-001: Cotton T-Shirts
        { bom_item_id: "b1000000-0000-0000-0000-000000000001", actual_qty: 1200, actual_rate: 338, reason: "market_fluctuation", notes: "Cotton prices increased 5.6% in Jan", consumed_at: "2026-01-22T14:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000001", actual_qty: 1380, actual_rate: 345, reason: "market_fluctuation", notes: "Second lot – supplier raised price again", consumed_at: "2026-02-03T10:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000002", actual_qty: 148, actual_rate: 85, reason: "normal", notes: null, consumed_at: "2026-01-25T11:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000003", actual_qty: 24800, actual_rate: 2.30, reason: "normal", notes: "Bulk discount from Surat supplier", consumed_at: "2026-01-28T09:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000004", actual_qty: 3200, actual_rate: 8.00, reason: "normal", notes: "Partial delivery", consumed_at: "2026-02-01T16:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000005", actual_qty: 85, actual_rate: 520, reason: "emergency", notes: "Emergency purchase from alternate vendor at premium", consumed_at: "2026-02-05T08:00:00+05:30" },
        // PO-2026-002: Denim Jeans
        { bom_item_id: "b1000000-0000-0000-0000-000000000006", actual_qty: 2200, actual_rate: 510, reason: "market_fluctuation", notes: "Denim prices surged due to raw cotton shortage", consumed_at: "2026-01-28T10:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000006", actual_qty: 2500, actual_rate: 525, reason: "scope_change", notes: "Added pre-wash process – higher fabric consumption", consumed_at: "2026-02-08T14:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000007", actual_qty: 18200, actual_rate: 3.40, reason: "normal", notes: "Slight defect rate in first batch", consumed_at: "2026-02-02T09:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000008", actual_qty: 2950, actual_rate: 15, reason: "normal", notes: null, consumed_at: "2026-02-04T11:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000009", actual_qty: 115, actual_rate: 495, reason: "normal", notes: "Better dye penetration reduced quantity needed", consumed_at: "2026-02-06T08:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000010", actual_qty: 195, actual_rate: 72, reason: "normal", notes: null, consumed_at: "2026-02-07T10:00:00+05:30" },
        // PO-2026-003: Silk Sarees
        { bom_item_id: "b1000000-0000-0000-0000-000000000011", actual_qty: 320, actual_rate: 3050, reason: "market_fluctuation", notes: "Import duties increased; exchange rate unfavorable", consumed_at: "2026-02-01T09:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000011", actual_qty: 300, actual_rate: 3120, reason: "supplier_delay", notes: "Original supplier delayed; sourced from alternative", consumed_at: "2026-02-12T10:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000012", actual_qty: 90, actual_rate: 1680, reason: "normal", notes: null, consumed_at: "2026-02-03T11:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000013", actual_qty: 42, actual_rate: 760, reason: "normal", notes: "Used optimized dyeing process", consumed_at: "2026-02-05T14:00:00+05:30" },
        // PO-2026-004: Polyester Shirts
        { bom_item_id: "b1000000-0000-0000-0000-000000000014", actual_qty: 3100, actual_rate: 205, reason: "normal", notes: "Long-term contract pricing activated", consumed_at: "2026-02-08T10:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000015", actual_qty: 790, actual_rate: 95, reason: "normal", notes: null, consumed_at: "2026-02-09T11:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000016", actual_qty: 19800, actual_rate: 1.35, reason: "normal", notes: "Bulk pricing from local manufacturer", consumed_at: "2026-02-10T09:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000017", actual_qty: 4000, actual_rate: 4.00, reason: "normal", notes: null, consumed_at: "2026-02-11T10:00:00+05:30" },
        // PO-2026-005: Linen Kurtas
        { bom_item_id: "b1000000-0000-0000-0000-000000000018", actual_qty: 1050, actual_rate: 595, reason: "market_fluctuation", notes: "European flax prices up 6%", consumed_at: "2026-02-10T09:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000018", actual_qty: 980, actual_rate: 610, reason: "supplier_delay", notes: "Alternate supplier – higher rate", consumed_at: "2026-02-15T14:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000019", actual_qty: 6200, actual_rate: 5.00, reason: "normal", notes: "Partial delivery", consumed_at: "2026-02-12T10:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000020", actual_qty: 58, actual_rate: 305, reason: "normal", notes: "Discovered more efficient stitch pattern", consumed_at: "2026-02-13T11:00:00+05:30" },
        // PO-2025-048: Winter Jackets (completed, ~5% savings)
        { bom_item_id: "b1000000-0000-0000-0000-000000000021", actual_qty: 2900, actual_rate: 395, reason: "normal", notes: "Seasonal discount on fleece", consumed_at: "2025-11-25T10:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000022", actual_qty: 1980, actual_rate: 26, reason: "normal", notes: "Good batch quality – fewer rejects", consumed_at: "2025-12-02T09:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000023", actual_qty: 2350, actual_rate: 145, reason: "normal", notes: "Negotiated better rate", consumed_at: "2025-12-05T11:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000024", actual_qty: 7800, actual_rate: 6.20, reason: "normal", notes: null, consumed_at: "2025-12-08T10:00:00+05:30" },
        // PO-2025-049: Formal Trousers (completed, ~8% overrun)
        { bom_item_id: "b1000000-0000-0000-0000-000000000025", actual_qty: 3600, actual_rate: 695, reason: "market_fluctuation", notes: "Wool prices spiked due to winter demand + scarcity", consumed_at: "2025-12-15T10:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000026", actual_qty: 3600, actual_rate: 48, reason: "scope_change", notes: "Added extra pocket – more lining needed", consumed_at: "2025-12-18T09:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000027", actual_qty: 3600, actual_rate: 8.50, reason: "normal", notes: "Slight price increase", consumed_at: "2025-12-20T11:00:00+05:30" },
        { bom_item_id: "b1000000-0000-0000-0000-000000000028", actual_qty: 1900, actual_rate: 38, reason: "normal", notes: null, consumed_at: "2025-12-22T10:00:00+05:30" },
    ];
    r = await supabase.from("actual_consumptions").insert(consumptions);
    if (r.error) { console.error("  ✗ actual_consumptions:", r.error.message); return; }
    console.log(`  ✓ ${consumptions.length} consumption records inserted`);

    // ── 5. INVENTORY ITEMS ──────────────────────────────
    console.log("\n📦 Seeding inventory items...");

    const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

    const inventoryItems = [
        // CRITICAL
        { item_name: "Cotton Fabric 60s", current_stock: 180, minimum_stock: 500, safety_stock: 200, daily_consumption: 45, lead_time_days: 7, unit: "meters", updated_at: hoursAgo(2) },
        { item_name: "Pure Silk Yarn", current_stock: 25, minimum_stock: 100, safety_stock: 40, daily_consumption: 12, lead_time_days: 14, unit: "kg", updated_at: hoursAgo(1) },
        { item_name: "Indigo Dye", current_stock: 8, minimum_stock: 30, safety_stock: 15, daily_consumption: 4, lead_time_days: 10, unit: "kg", updated_at: hoursAgo(0.5) },
        // WARNING
        { item_name: "Denim Fabric 14oz", current_stock: 650, minimum_stock: 800, safety_stock: 300, daily_consumption: 55, lead_time_days: 7, unit: "meters", updated_at: hoursAgo(3) },
        { item_name: "Pure Linen Fabric", current_stock: 280, minimum_stock: 400, safety_stock: 150, daily_consumption: 30, lead_time_days: 10, unit: "meters", updated_at: hoursAgo(4) },
        { item_name: "Zari Thread (Gold)", current_stock: 35, minimum_stock: 60, safety_stock: 25, daily_consumption: 5, lead_time_days: 12, unit: "kg", updated_at: hoursAgo(5) },
        // SAFE
        { item_name: "Polyester Thread", current_stock: 850, minimum_stock: 200, safety_stock: 100, daily_consumption: 20, lead_time_days: 5, unit: "kg", updated_at: hoursAgo(6) },
        { item_name: "Buttons (Pearl)", current_stock: 45000, minimum_stock: 10000, safety_stock: 5000, daily_consumption: 800, lead_time_days: 3, unit: "pieces", updated_at: hoursAgo(24) },
        { item_name: "Buttons (Plastic)", current_stock: 62000, minimum_stock: 15000, safety_stock: 8000, daily_consumption: 1200, lead_time_days: 3, unit: "pieces", updated_at: hoursAgo(24) },
        { item_name: "Zippers (YKK)", current_stock: 4200, minimum_stock: 1000, safety_stock: 500, daily_consumption: 100, lead_time_days: 5, unit: "pieces", updated_at: hoursAgo(12) },
        { item_name: "Packaging Material", current_stock: 12000, minimum_stock: 3000, safety_stock: 1500, daily_consumption: 350, lead_time_days: 3, unit: "pieces", updated_at: hoursAgo(8) },
        { item_name: "Poly-Cotton Blend", current_stock: 2800, minimum_stock: 800, safety_stock: 400, daily_consumption: 80, lead_time_days: 7, unit: "meters", updated_at: hoursAgo(10) },
        { item_name: "Interlining Fabric", current_stock: 1600, minimum_stock: 400, safety_stock: 200, daily_consumption: 25, lead_time_days: 5, unit: "meters", updated_at: hoursAgo(24) },
        { item_name: "Dye (Reactive Colors)", current_stock: 120, minimum_stock: 50, safety_stock: 30, daily_consumption: 6, lead_time_days: 8, unit: "kg", updated_at: hoursAgo(6) },
        { item_name: "Embroidery Thread", current_stock: 200, minimum_stock: 80, safety_stock: 40, daily_consumption: 8, lead_time_days: 6, unit: "kg", updated_at: hoursAgo(48) },
    ];
    r = await supabase.from("inventory_items").insert(inventoryItems);
    if (r.error) { console.error("  ✗ inventory_items:", r.error.message); return; }
    console.log(`  ✓ ${inventoryItems.length} inventory items inserted`);

    // ── 6. MATERIAL INVENTORY ───────────────────────────
    console.log("\n🔬 Seeding material inventory...");
    const materialInventory = [
        { material_name: "Cotton Fabric 60s", current_stock: 180, reorder_level: 515 },
        { material_name: "Denim Fabric 14oz", current_stock: 650, reorder_level: 685 },
        { material_name: "Pure Silk Yarn", current_stock: 25, reorder_level: 208 },
        { material_name: "Pure Linen Fabric", current_stock: 280, reorder_level: 450 },
        { material_name: "Poly-Cotton Blend", current_stock: 2800, reorder_level: 960 },
        { material_name: "Polyester Thread", current_stock: 850, reorder_level: 200 },
        { material_name: "Zari Thread (Gold)", current_stock: 35, reorder_level: 85 },
        { material_name: "Indigo Dye", current_stock: 8, reorder_level: 55 },
        { material_name: "Dye (Reactive Colors)", current_stock: 120, reorder_level: 78 },
        { material_name: "Buttons (Pearl)", current_stock: 45000, reorder_level: 7400 },
        { material_name: "Buttons (Plastic)", current_stock: 62000, reorder_level: 11600 },
        { material_name: "Zippers (YKK)", current_stock: 4200, reorder_level: 1000 },
        { material_name: "Packaging Material", current_stock: 12000, reorder_level: 2550 },
        { material_name: "Embroidery Thread", current_stock: 200, reorder_level: 88 },
        { material_name: "Interlining Fabric", current_stock: 1600, reorder_level: 325 },
    ];
    r = await supabase.from("material_inventory").insert(materialInventory);
    if (r.error) { console.error("  ✗ material_inventory:", r.error.message); return; }
    console.log(`  ✓ ${materialInventory.length} material inventory entries inserted`);

    // ── 7. PRODUCTION LOGS (30 days) ────────────────────
    console.log("\n📊 Seeding production logs (30 days)...");
    const logs = [
        // Jan 20
        { created_at: "2026-01-20T17:00:00+05:30", planned_cost: 45000, actual_cost: 47250, quantity_used: 140, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-20T17:00:00+05:30", planned_cost: 28000, actual_cost: 27500, quantity_used: 60, material_name: "Denim Fabric 14oz" },
        // Jan 21
        { created_at: "2026-01-21T17:00:00+05:30", planned_cost: 48000, actual_cost: 49800, quantity_used: 150, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-21T17:00:00+05:30", planned_cost: 32000, actual_cost: 33600, quantity_used: 65, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-01-21T17:00:00+05:30", planned_cost: 33600, actual_cost: 36600, quantity_used: 12, material_name: "Pure Silk Yarn" },
        // Jan 22
        { created_at: "2026-01-22T17:00:00+05:30", planned_cost: 44000, actual_cost: 46200, quantity_used: 135, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-22T17:00:00+05:30", planned_cost: 30000, actual_cost: 31500, quantity_used: 62, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-01-22T17:00:00+05:30", planned_cost: 33600, actual_cost: 37200, quantity_used: 12, material_name: "Pure Silk Yarn" },
        // Jan 23
        { created_at: "2026-01-23T17:00:00+05:30", planned_cost: 46000, actual_cost: 48300, quantity_used: 142, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-23T17:00:00+05:30", planned_cost: 28800, actual_cost: 30960, quantity_used: 60, material_name: "Denim Fabric 14oz" },
        // Jan 24
        { created_at: "2026-01-24T17:00:00+05:30", planned_cost: 50000, actual_cost: 53000, quantity_used: 155, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-24T17:00:00+05:30", planned_cost: 31200, actual_cost: 33540, quantity_used: 65, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-01-24T17:00:00+05:30", planned_cost: 30800, actual_cost: 33300, quantity_used: 11, material_name: "Pure Silk Yarn" },
        // Jan 25
        { created_at: "2026-01-25T17:00:00+05:30", planned_cost: 47000, actual_cost: 50000, quantity_used: 145, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-25T17:00:00+05:30", planned_cost: 33600, actual_cost: 36120, quantity_used: 70, material_name: "Denim Fabric 14oz" },
        // Jan 26
        { created_at: "2026-01-26T17:00:00+05:30", planned_cost: 44800, actual_cost: 47600, quantity_used: 140, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-26T17:00:00+05:30", planned_cost: 30000, actual_cost: 31800, quantity_used: 62, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-01-26T17:00:00+05:30", planned_cost: 36400, actual_cost: 39000, quantity_used: 13, material_name: "Pure Silk Yarn" },
        // Jan 27
        { created_at: "2026-01-27T17:00:00+05:30", planned_cost: 48000, actual_cost: 50400, quantity_used: 148, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-27T17:00:00+05:30", planned_cost: 31200, actual_cost: 33800, quantity_used: 65, material_name: "Denim Fabric 14oz" },
        // Jan 28
        { created_at: "2026-01-28T17:00:00+05:30", planned_cost: 46400, actual_cost: 49100, quantity_used: 144, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-28T17:00:00+05:30", planned_cost: 34800, actual_cost: 37600, quantity_used: 72, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-01-28T17:00:00+05:30", planned_cost: 28000, actual_cost: 29400, quantity_used: 10, material_name: "Pure Silk Yarn" },
        // Jan 29
        { created_at: "2026-01-29T17:00:00+05:30", planned_cost: 50000, actual_cost: 52500, quantity_used: 155, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-29T17:00:00+05:30", planned_cost: 33600, actual_cost: 36960, quantity_used: 70, material_name: "Denim Fabric 14oz" },
        // Jan 30
        { created_at: "2026-01-30T17:00:00+05:30", planned_cost: 48000, actual_cost: 50400, quantity_used: 150, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-30T17:00:00+05:30", planned_cost: 31200, actual_cost: 34320, quantity_used: 65, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-01-30T17:00:00+05:30", planned_cost: 33600, actual_cost: 36900, quantity_used: 12, material_name: "Pure Silk Yarn" },
        // Jan 31
        { created_at: "2026-01-31T17:00:00+05:30", planned_cost: 45000, actual_cost: 46800, quantity_used: 140, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-01-31T17:00:00+05:30", planned_cost: 28800, actual_cost: 31400, quantity_used: 60, material_name: "Denim Fabric 14oz" },
        // Feb 1
        { created_at: "2026-02-01T17:00:00+05:30", planned_cost: 46000, actual_cost: 47500, quantity_used: 143, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-01T17:00:00+05:30", planned_cost: 30000, actual_cost: 32700, quantity_used: 62, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-01T17:00:00+05:30", planned_cost: 17600, actual_cost: 16400, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        // Feb 2
        { created_at: "2026-02-02T17:00:00+05:30", planned_cost: 48000, actual_cost: 50400, quantity_used: 148, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-02T17:00:00+05:30", planned_cost: 33600, actual_cost: 36700, quantity_used: 70, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-02T17:00:00+05:30", planned_cost: 17600, actual_cost: 16200, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        // Feb 3
        { created_at: "2026-02-03T17:00:00+05:30", planned_cost: 44000, actual_cost: 46200, quantity_used: 138, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-03T17:00:00+05:30", planned_cost: 31200, actual_cost: 34000, quantity_used: 65, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-03T17:00:00+05:30", planned_cost: 17600, actual_cost: 16000, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        { created_at: "2026-02-03T17:00:00+05:30", planned_cost: 33600, actual_cost: 37100, quantity_used: 12, material_name: "Pure Silk Yarn" },
        // Feb 4
        { created_at: "2026-02-04T17:00:00+05:30", planned_cost: 46000, actual_cost: 48800, quantity_used: 142, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-04T17:00:00+05:30", planned_cost: 30000, actual_cost: 32400, quantity_used: 62, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-04T17:00:00+05:30", planned_cost: 17600, actual_cost: 16100, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        // Feb 5
        { created_at: "2026-02-05T17:00:00+05:30", planned_cost: 50000, actual_cost: 53500, quantity_used: 155, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-05T17:00:00+05:30", planned_cost: 34800, actual_cost: 37800, quantity_used: 72, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-05T17:00:00+05:30", planned_cost: 16800, actual_cost: 17850, quantity_used: 30, material_name: "Pure Linen Fabric" },
        // Feb 6
        { created_at: "2026-02-06T17:00:00+05:30", planned_cost: 48000, actual_cost: 50100, quantity_used: 148, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-06T17:00:00+05:30", planned_cost: 33600, actual_cost: 36500, quantity_used: 70, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-06T17:00:00+05:30", planned_cost: 16800, actual_cost: 18060, quantity_used: 30, material_name: "Pure Linen Fabric" },
        { created_at: "2026-02-06T17:00:00+05:30", planned_cost: 17600, actual_cost: 16300, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        // Feb 7
        { created_at: "2026-02-07T17:00:00+05:30", planned_cost: 45000, actual_cost: 47500, quantity_used: 140, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-07T17:00:00+05:30", planned_cost: 31200, actual_cost: 33800, quantity_used: 65, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-07T17:00:00+05:30", planned_cost: 16800, actual_cost: 18200, quantity_used: 30, material_name: "Pure Linen Fabric" },
        // Feb 8
        { created_at: "2026-02-08T17:00:00+05:30", planned_cost: 47000, actual_cost: 49600, quantity_used: 145, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-08T17:00:00+05:30", planned_cost: 33600, actual_cost: 36400, quantity_used: 70, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-08T17:00:00+05:30", planned_cost: 16800, actual_cost: 18400, quantity_used: 30, material_name: "Pure Linen Fabric" },
        { created_at: "2026-02-08T17:00:00+05:30", planned_cost: 17600, actual_cost: 16000, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        // Feb 9
        { created_at: "2026-02-09T17:00:00+05:30", planned_cost: 46000, actual_cost: 48700, quantity_used: 142, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-09T17:00:00+05:30", planned_cost: 30000, actual_cost: 32700, quantity_used: 62, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-09T17:00:00+05:30", planned_cost: 16800, actual_cost: 17500, quantity_used: 30, material_name: "Pure Linen Fabric" },
        // Feb 10
        { created_at: "2026-02-10T17:00:00+05:30", planned_cost: 48000, actual_cost: 50600, quantity_used: 148, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-10T17:00:00+05:30", planned_cost: 33600, actual_cost: 36200, quantity_used: 70, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-10T17:00:00+05:30", planned_cost: 16800, actual_cost: 18300, quantity_used: 30, material_name: "Pure Linen Fabric" },
        { created_at: "2026-02-10T17:00:00+05:30", planned_cost: 17600, actual_cost: 16100, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        // Feb 11
        { created_at: "2026-02-11T17:00:00+05:30", planned_cost: 50000, actual_cost: 53200, quantity_used: 155, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-11T17:00:00+05:30", planned_cost: 34800, actual_cost: 38000, quantity_used: 72, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-11T17:00:00+05:30", planned_cost: 33600, actual_cost: 36800, quantity_used: 12, material_name: "Pure Silk Yarn" },
        // Feb 12
        { created_at: "2026-02-12T17:00:00+05:30", planned_cost: 46000, actual_cost: 48300, quantity_used: 142, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-12T17:00:00+05:30", planned_cost: 31200, actual_cost: 33900, quantity_used: 65, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-12T17:00:00+05:30", planned_cost: 16800, actual_cost: 18600, quantity_used: 30, material_name: "Pure Linen Fabric" },
        // Feb 13
        { created_at: "2026-02-13T17:00:00+05:30", planned_cost: 44000, actual_cost: 46200, quantity_used: 135, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-13T17:00:00+05:30", planned_cost: 30000, actual_cost: 32400, quantity_used: 62, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-13T17:00:00+05:30", planned_cost: 17600, actual_cost: 15800, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        // Feb 14
        { created_at: "2026-02-14T17:00:00+05:30", planned_cost: 48000, actual_cost: 50800, quantity_used: 148, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-14T17:00:00+05:30", planned_cost: 33600, actual_cost: 36700, quantity_used: 70, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-14T17:00:00+05:30", planned_cost: 16800, actual_cost: 18100, quantity_used: 30, material_name: "Pure Linen Fabric" },
        { created_at: "2026-02-14T17:00:00+05:30", planned_cost: 17600, actual_cost: 16200, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        // Feb 15
        { created_at: "2026-02-15T17:00:00+05:30", planned_cost: 47000, actual_cost: 49700, quantity_used: 145, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-15T17:00:00+05:30", planned_cost: 31200, actual_cost: 34100, quantity_used: 65, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-15T17:00:00+05:30", planned_cost: 33600, actual_cost: 37500, quantity_used: 12, material_name: "Pure Silk Yarn" },
        // Feb 16
        { created_at: "2026-02-16T17:00:00+05:30", planned_cost: 50000, actual_cost: 53500, quantity_used: 155, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-16T17:00:00+05:30", planned_cost: 34800, actual_cost: 38200, quantity_used: 72, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-16T17:00:00+05:30", planned_cost: 16800, actual_cost: 18500, quantity_used: 30, material_name: "Pure Linen Fabric" },
        // Feb 17
        { created_at: "2026-02-17T17:00:00+05:30", planned_cost: 46000, actual_cost: 48900, quantity_used: 142, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-17T17:00:00+05:30", planned_cost: 33600, actual_cost: 36400, quantity_used: 70, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-17T17:00:00+05:30", planned_cost: 17600, actual_cost: 16000, quantity_used: 80, material_name: "Poly-Cotton Blend" },
        { created_at: "2026-02-17T17:00:00+05:30", planned_cost: 33600, actual_cost: 37200, quantity_used: 12, material_name: "Pure Silk Yarn" },
        // Feb 18 (today)
        { created_at: "2026-02-18T12:00:00+05:30", planned_cost: 44000, actual_cost: 46800, quantity_used: 138, material_name: "Cotton Fabric 60s" },
        { created_at: "2026-02-18T12:00:00+05:30", planned_cost: 30000, actual_cost: 32700, quantity_used: 62, material_name: "Denim Fabric 14oz" },
        { created_at: "2026-02-18T12:00:00+05:30", planned_cost: 16800, actual_cost: 18400, quantity_used: 30, material_name: "Pure Linen Fabric" },
        { created_at: "2026-02-18T12:00:00+05:30", planned_cost: 17600, actual_cost: 15900, quantity_used: 80, material_name: "Poly-Cotton Blend" },
    ];
    // Insert in batches of 30
    for (let i = 0; i < logs.length; i += 30) {
        const batch = logs.slice(i, i + 30);
        r = await supabase.from("production_logs").insert(batch);
        if (r.error) { console.error(`  ✗ production_logs batch ${i}:`, r.error.message); return; }
    }
    console.log(`  ✓ ${logs.length} production log entries inserted`);

    // ── Summary ─────────────────────────────────────────
    console.log("\n" + "═".repeat(50));
    console.log("✅ Seed complete! Summary:");
    console.log(`   • ${orders.length} orders (5 active, 2 completed, 1 draft)`);
    console.log(`   • ${bomItems.length} BOM items`);
    console.log(`   • ${consumptions.length} consumption records`);
    console.log(`   • ${inventoryItems.length} inventory items (3 critical, 3 warning, 9 safe)`);
    console.log(`   • ${materialInventory.length} material inventory entries`);
    console.log(`   • ${logs.length} production logs (30 days)`);
    console.log("\n🎯 Refresh your dashboard to see the data!");
}

seed().catch(console.error);
