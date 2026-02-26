"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useOrders, useBomItems } from "@/lib/queries/useOrders";
import {
    createOrder,
    createBomItem,
    deleteOrder,
    deleteBomItem,
} from "@/lib/actions/orders";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { Plus, ChevronDown, ChevronRight, Trash2, Upload } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CsvUploader } from "@/components/dashboard/CsvUploader";

// ─── Local form schemas (avoids z.coerce type issues with react-hook-form) ────

const orderFormSchema = z.object({
    orderNumber: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    status: z.enum(["draft", "active", "completed"]),
});

const bomFormSchema = z.object({
    orderId: z.string(),
    itemName: z.string().min(1, "Required"),
    plannedQty: z.number().positive("Must be positive"),
    plannedRate: z.number().positive("Must be positive"),
    unit: z.string().min(1, "Required"),
});

type OrderFormData = z.infer<typeof orderFormSchema>;
type BomFormData = z.infer<typeof bomFormSchema>;

// ─── Order Form Modal ─────────────────────────────────────────────────────────

function OrderFormModal({ onClose }: { onClose: () => void }) {
    const qc = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: { status: "draft" },
    });

    async function onSubmit(data: OrderFormData) {
        const result = await createOrder(data);
        if (result.success) {
            toast.success(`Order ${data.orderNumber} created successfully`);
            qc.invalidateQueries({ queryKey: ["orders"] });
            qc.invalidateQueries({ queryKey: ["orders-variance"] });
            onClose();
        } else {
            toast.error(result.error);
        }
    }

    return (
        <Modal isOpen={true} onClose={onClose} title="New Order">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="form-group">
                    <label className="label">Order Number</label>
                    <input {...register("orderNumber")} className="input" placeholder="PO-2024-005" />
                    {errors.orderNumber && <p className="error-text">{errors.orderNumber.message}</p>}
                </div>
                <div className="form-group">
                    <label className="label">Description</label>
                    <input {...register("description")} className="input" placeholder="Order description" />
                    {errors.description && <p className="error-text">{errors.description.message}</p>}
                </div>
                <div className="form-group">
                    <label className="label">Status</label>
                    <select {...register("status")} className="select">
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? "Creating..." : "Create Order"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─── BOM Form Modal ───────────────────────────────────────────────────────────

function BomFormModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
    const qc = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<BomFormData>({
        resolver: zodResolver(bomFormSchema),
        defaultValues: { orderId, unit: "units" },
    });

    async function onSubmit(data: BomFormData) {
        const result = await createBomItem({
            orderId: data.orderId,
            itemName: data.itemName,
            plannedQty: data.plannedQty,
            plannedRate: data.plannedRate,
            unit: data.unit,
        });
        if (result.success) {
            toast.success(`Added ${data.itemName} to BOM`);
            qc.invalidateQueries({ queryKey: ["bom-items", orderId] });
            qc.invalidateQueries({ queryKey: ["orders-variance"] });
            onClose();
        } else {
            toast.error(result.error);
        }
    }

    return (
        <Modal isOpen={true} onClose={onClose} title="Add BOM Item">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register("orderId")} />
                <div className="form-group">
                    <label className="label">Item Name</label>
                    <input {...register("itemName")} className="input" placeholder="Cotton Fabric" />
                    {errors.itemName && <p className="error-text">{errors.itemName.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="form-group">
                        <label className="label">Planned Qty</label>
                        <input {...register("plannedQty", { valueAsNumber: true })} type="number" step="0.001" className="input" placeholder="100" />
                        {errors.plannedQty && <p className="error-text">{errors.plannedQty.message}</p>}
                    </div>
                    <div className="form-group">
                        <label className="label">Unit</label>
                        <input {...register("unit")} className="input" placeholder="kg" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="label">Planned Rate (₹ per unit)</label>
                    <input {...register("plannedRate", { valueAsNumber: true })} type="number" step="0.01" className="input" placeholder="250" />
                    {errors.plannedRate && <p className="error-text">{errors.plannedRate.message}</p>}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? "Adding..." : "Add Item"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─── BOM Items Sub-table ──────────────────────────────────────────────────────

function BomSubTable({ orderId }: { orderId: string }) {
    const [showBomModal, setShowBomModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const qc = useQueryClient();
    const { data: items, isLoading } = useBomItems(orderId);

    async function handleDeleteBom() {
        if (!deleteId) return;
        const result = await deleteBomItem(deleteId);
        if (result.success) {
            toast.success("BOM item removed");
            qc.invalidateQueries({ queryKey: ["bom-items", orderId] });
            qc.invalidateQueries({ queryKey: ["orders-variance"] });
            setDeleteId(null);
        } else {
            toast.error(result.error);
        }
    }

    if (isLoading) return <div className="skeleton mx-4 my-3 h-16 rounded" />;

    return (
        <div className="mx-4 mb-4 rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border-subtle)" }}>
            {showBomModal && <BomFormModal orderId={orderId} onClose={() => setShowBomModal(false)} />}
            {deleteId && (
                <ConfirmDialog
                    isOpen={true}
                    onClose={() => setDeleteId(null)}
                    onConfirm={handleDeleteBom}
                    title="Remove BOM Item"
                    description="Are you sure you want to remove this item from the Bill of Materials? This action cannot be undone."
                    confirmText="Remove Item"
                    variant="destructive"
                />
            )}

            <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border-subtle)" }}>
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                    Bill of Materials
                </span>
                <button onClick={() => setShowBomModal(true)} className="btn-ghost py-1 px-2 text-xs">
                    <Plus className="h-3 w-3" /> Add Item
                </button>
            </div>
            {!items?.length ? (
                <div className="px-4 py-6 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
                    No items yet — add materials to this order
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Planned Qty</th>
                            <th>Rate (₹)</th>
                            <th>Planned Amount</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td style={{ color: "var(--color-text-primary)" }}>{item.itemName}</td>
                                <td>{formatNumber(item.plannedQty, 2)} {item.unit}</td>
                                <td>{formatCurrency(item.plannedRate)}</td>
                                <td className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                                    {formatCurrency(item.plannedQty * item.plannedRate)}
                                </td>
                                <td>
                                    <button
                                        onClick={() => setDeleteId(item.id)}
                                        className="rounded p-1 transition-colors hover:bg-surface-raised hover:text-loss"
                                        style={{ color: "var(--color-text-muted)" }}
                                        title="Remove item"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({ order }: { order: { id: string; orderNumber: string; description: string; status: string; createdAt: string } }) {
    const [expanded, setExpanded] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const qc = useQueryClient();

    async function handleDelete() {
        const result = await deleteOrder(order.id);
        if (result.success) {
            toast.success(`Order ${order.orderNumber} deleted`);
            qc.invalidateQueries({ queryKey: ["orders"] });
            qc.invalidateQueries({ queryKey: ["orders-variance"] });
        } else {
            toast.error(result.error);
        }
        setShowDelete(false);
    }

    const statusClass = {
        draft: "badge-draft",
        active: "badge-active",
        completed: "badge-completed",
    }[order.status] ?? "badge-draft";

    return (
        <>
            <tr
                className="cursor-pointer transition-colors hover:bg-surface-raised/50"
                onClick={() => setExpanded((e) => !e)}
            >
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
                <td>{order.description}</td>
                <td>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                        {order.status}
                    </span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowDelete(true)}
                        className="rounded p-1.5 transition-colors hover:bg-surface-raised hover:text-loss"
                        style={{ color: "var(--color-text-muted)" }}
                        title="Delete order"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    {showDelete && (
                        <ConfirmDialog
                            isOpen={true}
                            onClose={() => setShowDelete(false)}
                            onConfirm={handleDelete}
                            title="Delete Order"
                            description={`Are you sure you want to delete order ${order.orderNumber}? This will also remove all associated BOM items.`}
                            confirmText="Delete Order"
                            variant="destructive"
                        />
                    )}
                </td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan={5} className="p-0 bg-surface-raised/20">
                        <BomSubTable orderId={order.id} />
                    </td>
                </tr>
            )}
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlanningPage() {
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showCsvUploader, setShowCsvUploader] = useState(false);
    const { data: orders, isLoading, error } = useOrders();

    return (
        <div className="space-y-5">
            {showOrderModal && <OrderFormModal onClose={() => setShowOrderModal(false)} />}
            <CsvUploader isOpen={showCsvUploader} onClose={() => setShowCsvUploader(false)} uploadType="production" />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        Production Orders
                    </h2>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {orders?.length ?? 0} orders total
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowCsvUploader(true)} className="btn-ghost">
                        <Upload className="h-4 w-4" /> Upload CSV
                    </button>
                    <button onClick={() => setShowOrderModal(true)} className="btn-primary">
                        <Plus className="h-4 w-4" /> New Order
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden">
                {isLoading ? (
                    <div className="space-y-px p-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="skeleton h-12 w-full rounded" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-sm" style={{ color: "var(--color-loss)" }}>
                        Failed to load orders. Check your database connection.
                    </div>
                ) : !orders?.length ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                            No orders yet
                        </p>
                        <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                            Create your first production order to get started
                        </p>
                        <button onClick={() => setShowOrderModal(true)} className="btn-primary mt-4">
                            <Plus className="h-4 w-4" /> New Order
                        </button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <OrderRow key={order.id} order={order} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
