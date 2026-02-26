"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import {
    createConsumptionSchema,
    type ActionResult,
} from "./schemas";

// ─── Consumption Actions ──────────────────────────────────────────────────────

export async function createConsumption(
    input: z.infer<typeof createConsumptionSchema>
): Promise<ActionResult<{ id: string }>> {
    const parsed = createConsumptionSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { data, error } = await supabase
        .from("actual_consumptions")
        .insert({
            bom_item_id: parsed.data.bomItemId,
            actual_qty: parsed.data.actualQty,
            actual_rate: parsed.data.actualRate,
            reason: parsed.data.reason,
            notes: parsed.data.notes ?? null,
        })
        .select("id")
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/consumption");
    revalidatePath("/overview");
    revalidatePath("/reports");
    return { success: true, data: { id: data.id } };
}

export async function deleteConsumption(id: string): Promise<ActionResult> {
    const { error } = await supabase
        .from("actual_consumptions")
        .delete()
        .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/consumption");
    revalidatePath("/overview");
    return { success: true, data: undefined };
}
