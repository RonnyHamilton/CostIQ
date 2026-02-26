"use client";

import { useState } from "react";
import { useOrdersWithVariance, useBomItemsWithVariance } from "@/lib/queries/useVariance";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Upload } from "lucide-react";
import { CsvUploader } from "@/components/dashboard/CsvUploader";

// ─── Variance Badge ───────────────────────────────────────────────────────────

function VarianceBadge({ variance, pct }: { variance: number; pct: number }) {
    const isPositive = variance > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    return (
        <div className="flex items-center gap-1.5">
            <Icon
                className="h-3.5 w-3.5"
                style={{ color: isPositive ? "var(--color-gain)" : "var(--color-loss)" }}
            />
            <span
                className="text-sm font-medium tabular-nums"
                style={{ color: isPositive ? "var(--color-gain)" : "var(--color-loss)" }}
            >
                {isPositive ? "+" : ""}{formatCurrency(variance)}
            </span>
            <span
                className="text-xs"
                style={{ color: isPositive ? "var(--color-gain)" : "var(--color-loss)" }}
            >
                ({isPositive ? "+" : ""}{formatNumber(pct, 1)}%)
            </span>
        </div>
    );
}

// ─── BOM Variance Sub-table ───────────────────────────────────────────────────

function BomVarianceTable({ orderId }: { orderId: string }) {
    const { data: items, isLoading } = useBomItemsWithVariance(orderId);

    if (isLoading) return <div className="skeleton mx-4 my-3 h-20 rounded" />;
    if (!items?.length) return (
        <div className="px-4 py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
            No BOM items for this order
        </div>
    );

    return (
        <div className="mx-4 mb-4 overflow-hidden rounded-lg" style={{ border: "1px solid var(--color-border-subtle)" }}>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Material</th>
                        <th>Planned Qty</th>
                        <th>Planned Amount</th>
                        <th>Actual Qty</th>
                        <th>Actual Amount</th>
                        <th>Variance</th>
                        <th>Entries</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td style={{ color: "var(--color-text-primary)" }}>{item.itemName}</td>
                            <td className="tabular-nums">{formatNumber(item.plannedQty, 2)}</td>
                            <td className="tabular-nums">{formatCurrency(item.plannedAmount)}</td>
                            <td className="tabular-nums">
                                {item.consumptionCount > 0 ? formatNumber(item.actualQty, 2) : "—"}
                            </td>
                            <td className="tabular-nums">
                                {item.consumptionCount > 0 ? formatCurrency(item.actualAmount) : "—"}
                            </td>
                            <td>
                                {item.consumptionCount > 0 ? (
                                    <VarianceBadge variance={item.variance} pct={item.variancePct} />
                                ) : (
                                    <span style={{ color: "var(--color-text-muted)" }}>—</span>
                                )}
                            </td>
                            <td style={{ color: "var(--color-text-muted)" }}>
                                {item.consumptionCount}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderVarianceRow({ order }: {
    order: {
        id: string;
        orderNumber: string;
        description: string;
        status: string;
        plannedTotal: number;
        actualTotal: number;
        variance: number;
        variancePct: number;
        bomItemCount: number;
    };
}) {
    const [expanded, setExpanded] = useState(false);

    const statusClass = {
        draft: "badge-draft",
        active: "badge-active",
        completed: "badge-completed",
    }[order.status] ?? "badge-draft";

    return (
        <>
            <tr className="cursor-pointer" onClick={() => setExpanded((e) => !e)}>
                <td>
                    <div className="flex items-center gap-2">
                        {expanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                        ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                        )}
                        <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                            {order.orderNumber}
                        </span>
                    </div>
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>{order.description}</td>
                <td>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                        {order.status}
                    </span>
                </td>
                <td className="tabular-nums font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {formatCurrency(order.plannedTotal)}
                </td>
                <td className="tabular-nums font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {order.actualTotal > 0 ? formatCurrency(order.actualTotal) : "—"}
                </td>
                <td>
                    {order.actualTotal > 0 ? (
                        <VarianceBadge variance={order.variance} pct={order.variancePct} />
                    ) : (
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>No consumption logged</span>
                    )}
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>{order.bomItemCount}</td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan={7} className="p-0">
                        <BomVarianceTable orderId={order.id} />
                    </td>
                </tr>
            )}
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
    const [showCsvUploader, setShowCsvUploader] = useState(false);
    const { data: orders, isLoading, error } = useOrdersWithVariance();

    // Filter out drafts for totals (consistent with overview dashboard)
    const activeOrders = orders?.filter((o) => o.status !== "draft");
    const totalPlanned = activeOrders?.reduce((s, o) => s + o.plannedTotal, 0) ?? 0;
    const totalActual = activeOrders?.reduce((s, o) => s + o.actualTotal, 0) ?? 0;
    const totalVariance = totalActual - totalPlanned;
    const totalVariancePct = totalPlanned > 0 ? (totalVariance / totalPlanned) * 100 : 0;

    return (
        <div className="space-y-5">
            <CsvUploader isOpen={showCsvUploader} onClose={() => setShowCsvUploader(false)} uploadType="reports" />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        Cost Variance Reports
                    </h2>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {orders?.length ?? 0} orders analyzed
                    </p>
                </div>
                <button onClick={() => setShowCsvUploader(true)} className="btn-ghost">
                    <Upload className="h-4 w-4" /> Upload CSV
                </button>
            </div>

            {/* Summary row */}
            {!isLoading && orders && orders.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Planned", value: formatCurrency(totalPlanned) },
                        { label: "Total Actual", value: formatCurrency(totalActual) },
                        {
                            label: "Net Variance",
                            value: `${totalVariance > 0 ? "+" : ""}${formatCurrency(totalVariance)}`,
                            sub: `${totalVariance > 0 ? "+" : ""}${formatNumber(totalVariancePct, 1)}%`,
                            color: totalVariance > 0 ? "var(--color-gain)" : "var(--color-loss)",
                        },
                    ].map((item) => (
                        <div key={item.label} className="card p-4">
                            <p className="text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                                {item.label}
                            </p>
                            <p
                                className="mt-2 text-xl font-semibold tabular-nums"
                                style={{ color: item.color ?? "var(--color-text-primary)" }}
                            >
                                {item.value}
                            </p>
                            {item.sub && (
                                <p className="text-xs" style={{ color: item.color }}>
                                    {item.sub} vs planned
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <div className="space-y-px p-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="skeleton h-12 w-full rounded" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-sm" style={{ color: "var(--color-loss)" }}>
                        Failed to load report data.
                    </div>
                ) : !orders?.length ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>No data yet</p>
                        <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                            Create orders and log consumption to see variance reports
                        </p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Planned Cost</th>
                                <th>Actual Cost</th>
                                <th>Variance</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <OrderVarianceRow key={order.id} order={order} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
