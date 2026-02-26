import { z } from "zod";

// ─── Order Schemas ────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
    orderNumber: z.string().min(1, "Order number is required").max(50),
    description: z.string().min(1, "Description is required").max(200),
    status: z.enum(["draft", "active", "completed"]).default("draft"),
});

export const updateOrderSchema = createOrderSchema.extend({
    id: z.string().uuid(),
});

// ─── BOM Item Schemas ─────────────────────────────────────────────────────────

export const createBomItemSchema = z.object({
    orderId: z.string().uuid(),
    itemName: z.string().min(1, "Item name is required").max(100),
    plannedQty: z.coerce
        .number()
        .positive("Planned quantity must be positive"),
    plannedRate: z.coerce
        .number()
        .positive("Planned rate must be positive"),
    unit: z.string().min(1).max(20).default("units"),
});

export const updateBomItemSchema = createBomItemSchema.extend({
    id: z.string().uuid(),
});

// ─── Inventory Schemas ────────────────────────────────────────────────────────

export const createInventoryItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required").max(100),
    currentStock: z.coerce.number().min(0, "Stock cannot be negative"),
    minimumStock: z.coerce.number().min(0, "Minimum stock cannot be negative"),
    safetyStock: z.coerce.number().min(0, "Safety stock cannot be negative"),
    dailyConsumption: z.coerce
        .number()
        .positive("Daily consumption must be greater than 0"),
    leadTimeDays: z.coerce
        .number()
        .int()
        .positive("Lead time must be a positive integer"),
    unit: z.string().min(1).max(20).default("units"),
});

export const updateInventoryItemSchema = createInventoryItemSchema.extend({
    id: z.string().uuid(),
});

// ─── Consumption Schemas ──────────────────────────────────────────────────────

export const createConsumptionSchema = z.object({
    bomItemId: z.string().uuid(),
    actualQty: z.coerce.number().positive("Actual quantity must be positive"),
    actualRate: z.coerce.number().positive("Actual rate must be positive"),
    reason: z.enum([
        "normal",
        "emergency",
        "scope_change",
        "market_fluctuation",
        "supplier_delay",
    ]),
    notes: z.string().max(500).optional(),
});

// ─── Shared Action Result Type ────────────────────────────────────────────────

export type ActionResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };
