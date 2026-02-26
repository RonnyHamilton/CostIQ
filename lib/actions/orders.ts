"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import {
    createOrderSchema,
    updateOrderSchema,
    createBomItemSchema,
    updateBomItemSchema,
    type ActionResult,
} from "./schemas";

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function createOrder(
    input: z.infer<typeof createOrderSchema>
): Promise<ActionResult<{ id: string }>> {
    const parsed = createOrderSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { data, error } = await supabase
        .from("orders")
        .insert({
            order_number: parsed.data.orderNumber,
            description: parsed.data.description,
            status: parsed.data.status,
        })
        .select("id")
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/planning");
    revalidatePath("/overview");
    return { success: true, data: { id: data.id } };
}

export async function updateOrder(
    input: z.infer<typeof updateOrderSchema>
): Promise<ActionResult> {
    const parsed = updateOrderSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { error } = await supabase
        .from("orders")
        .update({
            order_number: parsed.data.orderNumber,
            description: parsed.data.description,
            status: parsed.data.status,
            updated_at: new Date().toISOString(),
        })
        .eq("id", parsed.data.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/planning");
    revalidatePath("/overview");
    return { success: true, data: undefined };
}

export async function deleteOrder(id: string): Promise<ActionResult> {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/planning");
    revalidatePath("/overview");
    return { success: true, data: undefined };
}

// ─── BOM Items ────────────────────────────────────────────────────────────────

export async function createBomItem(
    input: z.infer<typeof createBomItemSchema>
): Promise<ActionResult<{ id: string }>> {
    const parsed = createBomItemSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { data, error } = await supabase
        .from("bom_items")
        .insert({
            order_id: parsed.data.orderId,
            item_name: parsed.data.itemName,
            planned_qty: parsed.data.plannedQty,
            planned_rate: parsed.data.plannedRate,
            unit: parsed.data.unit,
        })
        .select("id")
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/planning");
    return { success: true, data: { id: data.id } };
}

export async function updateBomItem(
    input: z.infer<typeof updateBomItemSchema>
): Promise<ActionResult> {
    const parsed = updateBomItemSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { error } = await supabase
        .from("bom_items")
        .update({
            item_name: parsed.data.itemName,
            planned_qty: parsed.data.plannedQty,
            planned_rate: parsed.data.plannedRate,
            unit: parsed.data.unit,
        })
        .eq("id", parsed.data.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/planning");
    return { success: true, data: undefined };
}

export async function deleteBomItem(id: string): Promise<ActionResult> {
    const { error } = await supabase.from("bom_items").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/planning");
    return { success: true, data: undefined };
}
