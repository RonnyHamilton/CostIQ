import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Order {
    id: string;
    orderNumber: string;
    description: string;
    status: "draft" | "active" | "completed";
    createdAt: string;
}

export interface BomItem {
    id: string;
    orderId: string;
    itemName: string;
    plannedQty: number;
    plannedRate: number;
    unit: string;
    createdAt: string;
}

export interface ActualConsumption {
    id: string;
    bomItemId: string;
    actualQty: number;
    actualRate: number;
    reason: string;
    notes: string | null;
    consumedAt: string;
}

async function fetchOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        description: o.description,
        status: o.status,
        createdAt: o.created_at,
    }));
}

async function fetchBomItems(orderId: string): Promise<BomItem[]> {
    const { data, error } = await supabase
        .from("bom_items")
        .select("*")
        .eq("order_id", orderId)
        .order("item_name");

    if (error) throw new Error(error.message);

    return data.map((b) => ({
        id: b.id,
        orderId: b.order_id,
        itemName: b.item_name,
        plannedQty: Number(b.planned_qty),
        plannedRate: Number(b.planned_rate),
        unit: b.unit,
        createdAt: b.created_at,
    }));
}

async function fetchConsumptions(
    bomItemId: string
): Promise<ActualConsumption[]> {
    const { data, error } = await supabase
        .from("actual_consumptions")
        .select("*")
        .eq("bom_item_id", bomItemId)
        .order("consumed_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((c) => ({
        id: c.id,
        bomItemId: c.bom_item_id,
        actualQty: Number(c.actual_qty),
        actualRate: Number(c.actual_rate),
        reason: c.reason,
        notes: c.notes,
        consumedAt: c.consumed_at,
    }));
}

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: fetchOrders,
        staleTime: 30_000,
    });
}

export function useBomItems(orderId: string | null) {
    return useQuery({
        queryKey: ["bom-items", orderId],
        queryFn: () => fetchBomItems(orderId!),
        enabled: !!orderId,
        staleTime: 30_000,
    });
}

export function useConsumptions(bomItemId: string | null) {
    return useQuery({
        queryKey: ["consumptions", bomItemId],
        queryFn: () => fetchConsumptions(bomItemId!),
        enabled: !!bomItemId,
        staleTime: 30_000,
    });
}
