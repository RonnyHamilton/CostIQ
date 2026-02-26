"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryItem {
    id: string;
    item_name: string;
    current_stock: number;
    minimum_stock: number;
    safety_stock: number;
}

interface ActualConsumption {
    actual_qty: number;
    actual_rate: number;
    consumed_at: string;
}

interface BomItem {
    id: string;
    item_name: string;
    planned_qty: number;
    planned_rate: number;
    actual_consumptions: ActualConsumption[];
}

interface OrderRow {
    id: string;
    order_number: string;
    status: string;
    created_at: string;
    bom_items: BomItem[];
}

// ─── Chart Data Types ─────────────────────────────────────────────────────────

export interface VarianceTrendPoint {
    date: string;
    planned: number;
    actual: number;
}

export interface SpendCompositionPoint {
    name: string;
    value: number;
}

export interface BurnRatePoint {
    date: string;
    quantity: number;
}

export interface MRPExceptionItem {
    id: string;
    material_name: string;
    current_stock: number;
    reorder_level: number;
    deficit: number;
}

export interface DashboardData {
    // KPIs
    netVariance: number;        // actual − planned (positive = overrun)
    efficiencyScore: number;
    inventoryHealth: number;
    criticalItemsCount: number;
    activeOrdersCount: number;
    totalMaterials: number;

    // Chart data
    varianceTrend: VarianceTrendPoint[];
    spendComposition: SpendCompositionPoint[];
    burnRate: BurnRatePoint[];
    mrpExceptions: MRPExceptionItem[];
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchDashboard(): Promise<DashboardData> {
    // Fetch inventory + orders (with nested bom_items → actual_consumptions)
    const [inventoryRes, ordersRes] = await Promise.all([
        supabase.from("inventory_items").select("*"),
        supabase
            .from("orders")
            .select(`
                id,
                order_number,
                status,
                created_at,
                bom_items (
                    id,
                    item_name,
                    planned_qty,
                    planned_rate,
                    actual_consumptions (
                        actual_qty,
                        actual_rate,
                        consumed_at
                    )
                )
            `)
            .order("created_at", { ascending: true }),
    ]);

    if (inventoryRes.error) throw new Error(inventoryRes.error.message);
    if (ordersRes.error) throw new Error(ordersRes.error.message);

    const inventory: InventoryItem[] = (inventoryRes.data ?? []).map((r) => ({
        ...r,
        current_stock: Number(r.current_stock),
        minimum_stock: Number(r.minimum_stock),
        safety_stock: Number(r.safety_stock),
    }));

    const allOrders: OrderRow[] = ordersRes.data ?? [];

    // Filter out draft orders for cost calculations (same as reports page)
    const activeOrders = allOrders.filter((o) => o.status !== "draft");

    // ── KPI Calculations from orders → bom_items → actual_consumptions ──────

    let totalPlanned = 0;
    let totalActual = 0;

    // Also collect per-material spend and per-date data for charts
    const spendMap = new Map<string, number>();
    const trendMap = new Map<string, { planned: number; actual: number }>();
    const burnMap = new Map<string, number>();

    for (const order of activeOrders) {
        for (const item of order.bom_items ?? []) {
            const planned = Number(item.planned_qty) * Number(item.planned_rate);
            totalPlanned += planned;

            // Add planned cost to the order's creation date for trend
            const orderDateKey = format(new Date(order.created_at), "dd MMM");
            const trendEntry = trendMap.get(orderDateKey) ?? { planned: 0, actual: 0 };
            trendEntry.planned += planned;

            for (const ac of item.actual_consumptions ?? []) {
                const actualAmount = Number(ac.actual_qty) * Number(ac.actual_rate);
                totalActual += actualAmount;

                // Spend composition by material
                spendMap.set(
                    item.item_name,
                    (spendMap.get(item.item_name) ?? 0) + actualAmount
                );

                // Actual cost on the consumption date for trend
                const acDateKey = format(new Date(ac.consumed_at), "dd MMM");
                const acTrend = trendMap.get(acDateKey) ?? { planned: 0, actual: 0 };
                acTrend.actual += actualAmount;
                trendMap.set(acDateKey, acTrend);

                // Burn rate (quantity used per date)
                burnMap.set(acDateKey, (burnMap.get(acDateKey) ?? 0) + Number(ac.actual_qty));
            }

            trendMap.set(orderDateKey, trendEntry);
        }
    }

    // Net Variance: actual − planned (positive = overrun, negative = savings)
    // This matches the reports page convention
    const netVariance = totalActual - totalPlanned;

    const efficiencyScore = totalActual === 0 ? 100 : (totalPlanned / totalActual) * 100;

    // ── Inventory Health ──────────────────────────────────────────────────────

    const reorderLevel = (item: InventoryItem) => item.minimum_stock + item.safety_stock;
    const healthyCount = inventory.filter((i) => i.current_stock > reorderLevel(i)).length;
    const inventoryHealth = inventory.length === 0 ? 100 : (healthyCount / inventory.length) * 100;
    const criticalItemsCount = inventory.filter((i) => i.current_stock <= reorderLevel(i)).length;
    const activeOrdersCount = activeOrders.length;

    // ── Chart: Variance Trend ─────────────────────────────────────────────────

    const varianceTrend: VarianceTrendPoint[] = Array.from(trendMap.entries()).map(
        ([date, { planned, actual }]) => ({ date, planned: Math.round(planned), actual: Math.round(actual) })
    );

    // ── Chart: Spend Composition (top 5 materials by actual cost) ─────────────

    const spendComposition: SpendCompositionPoint[] = Array.from(spendMap.entries())
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // ── Chart: Burn Rate ──────────────────────────────────────────────────────

    const burnRate: BurnRatePoint[] = Array.from(burnMap.entries()).map(([date, quantity]) => ({
        date,
        quantity: Math.round(quantity),
    }));

    // ── MRP Exceptions (critical inventory) ───────────────────────────────────

    const mrpExceptions: MRPExceptionItem[] = inventory
        .filter((i) => i.current_stock <= reorderLevel(i))
        .map((i) => ({
            id: i.id,
            material_name: i.item_name,
            current_stock: i.current_stock,
            reorder_level: reorderLevel(i),
            deficit: reorderLevel(i) - i.current_stock,
        }))
        .sort((a, b) => b.deficit - a.deficit);

    return {
        netVariance,
        efficiencyScore,
        inventoryHealth,
        criticalItemsCount,
        activeOrdersCount,
        totalMaterials: inventory.length,
        varianceTrend,
        spendComposition,
        burnRate,
        mrpExceptions,
    };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboardData() {
    return useQuery<DashboardData>({
        queryKey: ["nexus-dashboard"],
        queryFn: fetchDashboard,
        staleTime: 30_000,
        refetchInterval: 60_000, // auto-refresh every minute
    });
}
