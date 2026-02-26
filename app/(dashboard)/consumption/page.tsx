"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useOrders, useBomItems, useConsumptions } from "@/lib/queries/useOrders";
import { createConsumption, deleteConsumption } from "@/lib/actions/consumption";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { Plus, ChevronDown, ChevronRight, Trash2, X, AlertTriangle } from "lucide-react";

// Local form schema uses plain number (not coerce) to satisfy react-hook-form types
const consumptionFormSchema = z.object({
    bomItemId: z.string(),
    actualQty: z.number().positive("Must be positive"),
    actualRate: z.number().positive("Must be positive"),
    reason: z.enum(["normal", "emergency", "scope_change", "market_fluctuation", "supplier_delay"]),
    notes: z.string().max(500).optional(),
});
type ConsumptionFormData = z.infer<typeof consumptionFormSchema>;

const reasonLabels: Record<string, string> = {
    normal: "Normal",
    emergency: "Emergency",
    scope_change: "Scope Change",
    market_fluctuation: "Market Fluctuation",
    supplier_delay: "Supplier Delay",
};

// ─── Consumption Form Modal ───────────────────────────────────────────────────

function ConsumptionModal({ bomItemId, itemName, onClose }: {
    bomItemId: string;
    itemName: string;
    onClose: () => void;
}) {
    const qc = useQueryClient();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ConsumptionFormData>({
        resolver: zodResolver(consumptionFormSchema),
        defaultValues: { bomItemId, reason: "normal" },
    });

    async function onSubmit(data: ConsumptionFormData) {
        const result = await createConsumption(data);
        if (result.success) {
            toast.success("Consumption logged");
            qc.invalidateQueries({ queryKey: ["consumptions", bomItemId] });
            qc.invalidateQueries({ queryKey: ["orders-variance"] });
            onClose();
        } else {
            toast.error(result.error);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="card w-full max-w-md p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>Log Consumption</h2>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{itemName}</p>
                    </div>
                    <button onClick={onClose} className="btn-ghost p-1.5"><X className="h-4 w-4" /></button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" {...register("bomItemId")} />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="form-group">
                            <label className="label">Actual Qty</label>
                            <input {...register("actualQty", { valueAsNumber: true })} type="number" step="0.001" className="input" placeholder="0" />
                            {errors.actualQty && <p className="error-text">{errors.actualQty.message}</p>}
                        </div>
                        <div className="form-group">
                            <label className="label">Actual Rate (₹)</label>
                            <input {...register("actualRate", { valueAsNumber: true })} type="number" step="0.01" className="input" placeholder="0" />
                            {errors.actualRate && <p className="error-text">{errors.actualRate.message}</p>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="label">Reason</label>
                        <select {...register("reason")} className="select">
                            {Object.entries(reasonLabels).map(([v, l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label">Notes (optional)</label>
                        <input {...register("notes")} className="input" placeholder="Additional context..." />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                            {isSubmitting ? "Logging..." : "Log Entry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Consumption History ──────────────────────────────────────────────────────

function ConsumptionHistory({ bomItemId }: { bomItemId: string }) {
    const qc = useQueryClient();
    const { data: entries, isLoading } = useConsumptions(bomItemId);

    async function handleDelete(id: string) {
        const result = await deleteConsumption(id);
        if (result.success) {
            toast.success("Entry deleted");
            qc.invalidateQueries({ queryKey: ["consumptions", bomItemId] });
            qc.invalidateQueries({ queryKey: ["orders-variance"] });
        } else {
            toast.error(result.error);
        }
    }

    if (isLoading) return <div className="skeleton mx-4 my-2 h-10 rounded" />;
    if (!entries?.length) return (
        <div className="px-4 py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
            No consumption logged yet
        </div>
    );

    return (
        <div className="mx-4 mb-3 overflow-hidden rounded-lg" style={{ border: "1px solid var(--color-border-subtle)" }}>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Qty</th>
                        <th>Rate (₹)</th>
                        <th>Amount</th>
                        <th>Reason</th>
                        <th>Notes</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((e) => (
                        <tr key={e.id}>
                            <td>{formatDate(e.consumedAt)}</td>
                            <td>{formatNumber(e.actualQty, 2)}</td>
                            <td>{formatCurrency(e.actualRate)}</td>
                            <td className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                                {formatCurrency(e.actualQty * e.actualRate)}
                            </td>
                            <td>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${e.reason === "emergency" ? "badge-critical" :
                                    e.reason === "normal" ? "badge-safe" : "badge-warning"
                                    }`}>
                                    {reasonLabels[e.reason] ?? e.reason}
                                </span>
                            </td>
                            <td className="max-w-32 truncate text-xs" style={{ color: "var(--color-text-muted)" }}>
                                {e.notes ?? "—"}
                            </td>
                            <td>
                                <button onClick={() => handleDelete(e.id)} className="rounded p-1" style={{ color: "var(--color-text-muted)" }}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── BOM Item Row ─────────────────────────────────────────────────────────────

function BomItemRow({ item }: {
    item: { id: string; itemName: string; plannedQty: number; plannedRate: number; unit: string };
}) {
    const [expanded, setExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const plannedAmount = item.plannedQty * item.plannedRate;

    return (
        <>
            {showModal && (
                <ConsumptionModal
                    bomItemId={item.id}
                    itemName={item.itemName}
                    onClose={() => setShowModal(false)}
                />
            )}
            <tr className="cursor-pointer" onClick={() => setExpanded((e) => !e)}>
                <td>
                    <div className="flex items-center gap-2">
                        {expanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                        ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                        )}
                        <span style={{ color: "var(--color-text-primary)" }}>{item.itemName}</span>
                    </div>
                </td>
                <td>{formatNumber(item.plannedQty, 2)} {item.unit}</td>
                <td>{formatCurrency(item.plannedRate)}</td>
                <td className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {formatCurrency(plannedAmount)}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setShowModal(true)} className="btn-ghost py-1 px-2 text-xs">
                        <Plus className="h-3 w-3" /> Log
                    </button>
                </td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan={5} className="p-0">
                        <ConsumptionHistory bomItemId={item.id} />
                    </td>
                </tr>
            )}
        </>
    );
}

// ─── Order Section ────────────────────────────────────────────────────────────

function OrderSection({ order }: {
    order: { id: string; orderNumber: string; description: string; status: string };
}) {
    const [expanded, setExpanded] = useState(false);
    const { data: items, isLoading } = useBomItems(expanded ? order.id : null);

    const statusClass = {
        draft: "badge-draft",
        active: "badge-active",
        completed: "badge-completed",
    }[order.status] ?? "badge-draft";

    return (
        <div className="card overflow-hidden">
            <button
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => setExpanded((e) => !e)}
            >
                <div className="flex items-center gap-3">
                    {expanded ? (
                        <ChevronDown className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
                    ) : (
                        <ChevronRight className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
                    )}
                    <div>
                        <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                            {order.orderNumber}
                        </span>
                        <span className="ml-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                            {order.description}
                        </span>
                    </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                    {order.status}
                </span>
            </button>

            {expanded && (
                <div style={{ borderTop: "1px solid var(--color-border)" }}>
                    {isLoading ? (
                        <div className="skeleton m-4 h-16 rounded" />
                    ) : !items?.length ? (
                        <div className="px-4 py-6 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
                            No BOM items — add items in the Planning page first
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Planned Qty</th>
                                    <th>Planned Rate</th>
                                    <th>Planned Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <BomItemRow key={item.id} item={item} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConsumptionPage() {
    const { data: orders, isLoading, error } = useOrders();
    const activeOrders = orders?.filter((o) => o.status !== "draft") ?? [];

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: "var(--color-warning-subtle)", border: "1px solid color-mix(in srgb, var(--color-warning) 30%, transparent)" }}>
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--color-warning)" }} />
                <p className="text-xs" style={{ color: "var(--color-warning)" }}>
                    Log actual consumption per BOM item. Multiple entries per item are supported — variance is recalculated on each save.
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton h-16 w-full rounded-lg" />
                    ))}
                </div>
            ) : error ? (
                <div className="p-4 text-sm" style={{ color: "var(--color-loss)" }}>
                    Failed to load orders.
                </div>
            ) : !activeOrders.length ? (
                <div className="card flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>No active orders</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                        Create and activate orders in the Planning page first
                    </p>
                </div>
            ) : (
                activeOrders.map((order) => (
                    <OrderSection key={order.id} order={order} />
                ))
            )}
        </div>
    );
}
