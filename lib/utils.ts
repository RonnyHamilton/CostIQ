import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatCurrency(value: number | string): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}

export function formatNumber(value: number | string, decimals = 2): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    }).format(num);
}

// ─── Variance Calculations ────────────────────────────────────────────────────

export function calcVariance(planned: number, actual: number) {
    const diff = actual - planned;
    const pct = planned !== 0 ? (diff / planned) * 100 : 0;
    return { diff, pct, isLoss: diff > 0 };
}

// ─── Inventory Calculations ───────────────────────────────────────────────────

export function calcReorderLevel(
    dailyConsumption: number,
    leadTimeDays: number,
    safetyStock: number
): number {
    return dailyConsumption * leadTimeDays + safetyStock;
}

export function calcReorderQty(
    currentStock: number,
    reorderLevel: number
): number {
    return Math.max(0, reorderLevel - currentStock);
}

export type InventoryStatus = "critical" | "warning" | "safe";

export function getInventoryStatus(
    currentStock: number,
    minimumStock: number,
    reorderLevel: number
): InventoryStatus {
    if (currentStock <= minimumStock) return "critical";
    if (currentStock <= reorderLevel) return "warning";
    return "safe";
}

// ─── Date Formatting ─────────────────────────────────────────────────────────

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}
