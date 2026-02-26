import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderWithVariance {
    id: string;
    orderNumber: string;
    description: string;
    status: "draft" | "active" | "completed";
    createdAt: string;
    plannedTotal: number;
    actualTotal: number;
    variance: number;
    variancePct: number;
    bomItemCount: number;
}

export interface BomItemWithVariance {
    id: string;
    orderId: string;
    itemName: string;
    plannedQty: number;
    plannedRate: number;
    plannedAmount: number;
    unit: string;
    actualQty: number;
    actualAmount: number;
    variance: number;
    variancePct: number;
    consumptionCount: number;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchOrdersWithVariance(): Promise<OrderWithVariance[]> {
    const { data: orders, error } = await supabase
        .from("orders")
        .select(`
      id,
      order_number,
      description,
      status,
      created_at,
      bom_items (
        id,
        planned_qty,
        planned_rate,
        actual_consumptions (
          actual_qty,
          actual_rate
        )
      )
    `)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return orders.map((order) => {
        let plannedTotal = 0;
        let actualTotal = 0;
        const bomItemCount = order.bom_items?.length ?? 0;

        for (const item of order.bom_items ?? []) {
            const planned = Number(item.planned_qty) * Number(item.planned_rate);
            plannedTotal += planned;

            for (const ac of item.actual_consumptions ?? []) {
                actualTotal += Number(ac.actual_qty) * Number(ac.actual_rate);
            }
        }

        const variance = actualTotal - plannedTotal;
        const variancePct = plannedTotal !== 0 ? (variance / plannedTotal) * 100 : 0;

        return {
            id: order.id,
            orderNumber: order.order_number,
            description: order.description,
            status: order.status as "draft" | "active" | "completed",
            createdAt: order.created_at,
            plannedTotal,
            actualTotal,
            variance,
            variancePct,
            bomItemCount,
        };
    });
}

async function fetchBomItemsWithVariance(
    orderId: string
): Promise<BomItemWithVariance[]> {
    const { data, error } = await supabase
        .from("bom_items")
        .select(`
      id,
      order_id,
      item_name,
      planned_qty,
      planned_rate,
      unit,
      actual_consumptions (
        id,
        actual_qty,
        actual_rate,
        reason,
        notes,
        consumed_at
      )
    `)
        .eq("order_id", orderId)
        .order("item_name");

    if (error) throw new Error(error.message);

    return data.map((item) => {
        const plannedAmount =
            Number(item.planned_qty) * Number(item.planned_rate);
        let actualQty = 0;
        let actualAmount = 0;

        for (const ac of item.actual_consumptions ?? []) {
            actualQty += Number(ac.actual_qty);
            actualAmount += Number(ac.actual_qty) * Number(ac.actual_rate);
        }

        const variance = actualAmount - plannedAmount;
        const variancePct =
            plannedAmount !== 0 ? (variance / plannedAmount) * 100 : 0;

        return {
            id: item.id,
            orderId: item.order_id,
            itemName: item.item_name,
            plannedQty: Number(item.planned_qty),
            plannedRate: Number(item.planned_rate),
            plannedAmount,
            unit: item.unit,
            actualQty,
            actualAmount,
            variance,
            variancePct,
            consumptionCount: item.actual_consumptions?.length ?? 0,
        };
    });
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useOrdersWithVariance() {
    return useQuery({
        queryKey: ["orders-variance"],
        queryFn: fetchOrdersWithVariance,
        staleTime: 30_000,
    });
}

export function useBomItemsWithVariance(orderId: string | null) {
    return useQuery({
        queryKey: ["bom-items-variance", orderId],
        queryFn: () => fetchBomItemsWithVariance(orderId!),
        enabled: !!orderId,
        staleTime: 30_000,
    });
}

// ─── Dashboard KPI Hook ───────────────────────────────────────────────────────

export function useDashboardKpis() {
    return useQuery({
        queryKey: ["orders-variance"],
        queryFn: fetchOrdersWithVariance,
        staleTime: 30_000,
        select: (orders) => {
            const activeOrders = orders.filter((o) => o.status !== "draft");
            const totalPlanned = activeOrders.reduce(
                (sum, o) => sum + o.plannedTotal,
                0
            );
            const totalActual = activeOrders.reduce(
                (sum, o) => sum + o.actualTotal,
                0
            );
            const totalVariance = totalActual - totalPlanned;
            const variancePct =
                totalPlanned !== 0 ? (totalVariance / totalPlanned) * 100 : 0;

            return {
                totalPlanned,
                totalActual,
                totalVariance,
                variancePct,
                activeOrderCount: activeOrders.length,
            };
        },
    });
}

// ─── Chart Data Hook ──────────────────────────────────────────────────────────

export function useVarianceChartData() {
    return useQuery({
        queryKey: ["orders-variance"],
        queryFn: fetchOrdersWithVariance,
        staleTime: 30_000,
        select: (orders) =>
            orders
                .filter((o) => o.status !== "draft" && o.plannedTotal > 0)
                .map((o) => ({
                    name: o.orderNumber,
                    planned: Math.round(o.plannedTotal),
                    actual: Math.round(o.actualTotal),
                    variance: Math.round(o.variance),
                })),
    });
}
