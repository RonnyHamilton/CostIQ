"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import {
    createInventoryItemSchema,
    updateInventoryItemSchema,
    type ActionResult,
} from "./schemas";

// ─── Inventory Actions ────────────────────────────────────────────────────────

export async function createInventoryItem(
    input: z.infer<typeof createInventoryItemSchema>
): Promise<ActionResult<{ id: string }>> {
    const parsed = createInventoryItemSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { data, error } = await supabase
        .from("inventory_items")
        .insert({
            item_name: parsed.data.itemName,
            current_stock: parsed.data.currentStock,
            minimum_stock: parsed.data.minimumStock,
            safety_stock: parsed.data.safetyStock,
            daily_consumption: parsed.data.dailyConsumption,
            lead_time_days: parsed.data.leadTimeDays,
            unit: parsed.data.unit,
        })
        .select("id")
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/inventory");
    revalidatePath("/overview");
    return { success: true, data: { id: data.id } };
}

export async function updateInventoryItem(
    input: z.infer<typeof updateInventoryItemSchema>
): Promise<ActionResult> {
    const parsed = updateInventoryItemSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { error } = await supabase
        .from("inventory_items")
        .update({
            item_name: parsed.data.itemName,
            current_stock: parsed.data.currentStock,
            minimum_stock: parsed.data.minimumStock,
            safety_stock: parsed.data.safetyStock,
            daily_consumption: parsed.data.dailyConsumption,
            lead_time_days: parsed.data.leadTimeDays,
            unit: parsed.data.unit,
            updated_at: new Date().toISOString(),
        })
        .eq("id", parsed.data.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/inventory");
    revalidatePath("/overview");
    return { success: true, data: undefined };
}

export async function deleteInventoryItem(id: string): Promise<ActionResult> {
    const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/inventory");
    revalidatePath("/overview");
    return { success: true, data: undefined };
}
