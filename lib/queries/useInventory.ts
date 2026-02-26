import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
    calcReorderLevel,
    calcReorderQty,
    getInventoryStatus,
} from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InventoryItemWithStatus {
    id: string;
    itemName: string;
    currentStock: number;
    minimumStock: number;
    safetyStock: number;
    dailyConsumption: number;
    leadTimeDays: number;
    unit: string;
    updatedAt: string;
    // computed
    reorderLevel: number;
    reorderQty: number;
    status: "critical" | "warning" | "safe";
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchInventoryItems(): Promise<InventoryItemWithStatus[]> {
    const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("item_name");

    if (error) throw new Error(error.message);

    return data.map((item) => {
        const reorderLevel = calcReorderLevel(
            Number(item.daily_consumption),
            item.lead_time_days,
            Number(item.safety_stock)
        );
        const reorderQty = calcReorderQty(Number(item.current_stock), reorderLevel);
        const status = getInventoryStatus(
            Number(item.current_stock),
            Number(item.minimum_stock),
            reorderLevel
        );

        return {
            id: item.id,
            itemName: item.item_name,
            currentStock: Number(item.current_stock),
            minimumStock: Number(item.minimum_stock),
            safetyStock: Number(item.safety_stock),
            dailyConsumption: Number(item.daily_consumption),
            leadTimeDays: item.lead_time_days,
            unit: item.unit,
            updatedAt: item.updated_at,
            reorderLevel,
            reorderQty,
            status,
        };
    });
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useInventoryItems() {
    return useQuery({
        queryKey: ["inventory-items"],
        queryFn: fetchInventoryItems,
        staleTime: 30_000,
    });
}

export function useInventoryAlerts() {
    return useQuery({
        queryKey: ["inventory-items"],
        queryFn: fetchInventoryItems,
        staleTime: 30_000,
        select: (data) =>
            data
                .filter((item) => item.status !== "safe")
                .sort((a, b) => {
                    const order = { critical: 0, warning: 1, safe: 2 };
                    return order[a.status] - order[b.status];
                }),
    });
}
