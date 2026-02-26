import {
    pgTable,
    uuid,
    text,
    numeric,
    integer,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const orderStatusEnum = pgEnum("order_status", [
    "draft",
    "active",
    "completed",
]);

export const consumptionReasonEnum = pgEnum("consumption_reason", [
    "normal",
    "emergency",
    "scope_change",
    "market_fluctuation",
    "supplier_delay",
]);

// ─── Orders ──────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("order_number").notNull().unique(),
    description: text("description").notNull(),
    status: orderStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// ─── BOM Items (Planned) ─────────────────────────────────────────────────────

export const bomItems = pgTable("bom_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
    itemName: text("item_name").notNull(),
    plannedQty: numeric("planned_qty", { precision: 12, scale: 3 }).notNull(),
    plannedRate: numeric("planned_rate", { precision: 12, scale: 2 }).notNull(),
    unit: text("unit").notNull().default("units"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// ─── Actual Consumptions ─────────────────────────────────────────────────────

export const actualConsumptions = pgTable("actual_consumptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    bomItemId: uuid("bom_item_id")
        .notNull()
        .references(() => bomItems.id, { onDelete: "cascade" }),
    actualQty: numeric("actual_qty", { precision: 12, scale: 3 }).notNull(),
    actualRate: numeric("actual_rate", { precision: 12, scale: 2 }).notNull(),
    reason: consumptionReasonEnum("reason").notNull().default("normal"),
    notes: text("notes"),
    consumedAt: timestamp("consumed_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// ─── Inventory Items ─────────────────────────────────────────────────────────

export const inventoryItems = pgTable("inventory_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    itemName: text("item_name").notNull(),
    currentStock: numeric("current_stock", { precision: 12, scale: 3 }).notNull(),
    minimumStock: numeric("minimum_stock", {
        precision: 12,
        scale: 3,
    }).notNull(),
    safetyStock: numeric("safety_stock", { precision: 12, scale: 3 }).notNull(),
    dailyConsumption: numeric("daily_consumption", {
        precision: 12,
        scale: 3,
    }).notNull(),
    leadTimeDays: integer("lead_time_days").notNull(),
    unit: text("unit").notNull().default("units"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const ordersRelations = relations(orders, ({ many }) => ({
    bomItems: many(bomItems),
}));

export const bomItemsRelations = relations(bomItems, ({ one, many }) => ({
    order: one(orders, {
        fields: [bomItems.orderId],
        references: [orders.id],
    }),
    actualConsumptions: many(actualConsumptions),
}));

export const actualConsumptionsRelations = relations(
    actualConsumptions,
    ({ one }) => ({
        bomItem: one(bomItems, {
            fields: [actualConsumptions.bomItemId],
            references: [bomItems.id],
        }),
    })
);

// ─── Types ────────────────────────────────────────────────────────────────────

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type BomItem = typeof bomItems.$inferSelect;
export type NewBomItem = typeof bomItems.$inferInsert;
export type ActualConsumption = typeof actualConsumptions.$inferSelect;
export type NewActualConsumption = typeof actualConsumptions.$inferInsert;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type NewInventoryItem = typeof inventoryItems.$inferInsert;
