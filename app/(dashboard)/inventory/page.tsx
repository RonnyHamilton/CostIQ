"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useInventoryItems } from "@/lib/queries/useInventory";
import {
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} from "@/lib/actions/inventory";
import { formatNumber, formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle, X, Upload } from "lucide-react";
import type { InventoryItemWithStatus } from "@/lib/queries/useInventory";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CsvUploader } from "@/components/dashboard/CsvUploader";

// ─── Local form schemas (no z.coerce — avoids react-hook-form type issues) ────

const itemFormSchema = z.object({
    itemName: z.string().min(1, "Required"),
    currentStock: z.number().min(0, "Must be ≥ 0"),
    minimumStock: z.number().min(0, "Must be ≥ 0"),
    safetyStock: z.number().min(0, "Must be ≥ 0"),
    dailyConsumption: z.number().positive("Must be > 0"),
    leadTimeDays: z.number().int().min(1, "Must be ≥ 1"),
    unit: z.string().min(1, "Required"),
});

const editFormSchema = itemFormSchema.extend({ id: z.string() });

type CreateFormData = z.infer<typeof itemFormSchema>;
type UpdateFormData = z.infer<typeof editFormSchema>;

// ─── Create Modal ─────────────────────────────────────────────────────────────

function CreateModal({ onClose }: { onClose: () => void }) {
    const qc = useQueryClient();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateFormData>({
        resolver: zodResolver(itemFormSchema),
        defaultValues: { unit: "units", leadTimeDays: 3 },
    });

    async function onSubmit(data: CreateFormData) {
        const result = await createInventoryItem({
            itemName: data.itemName,
            currentStock: data.currentStock,
            minimumStock: data.minimumStock,
            safetyStock: data.safetyStock,
            dailyConsumption: data.dailyConsumption,
            leadTimeDays: data.leadTimeDays,
            unit: data.unit,
        });
        if (result.success) {
            toast.success(`Inventory item ${data.itemName} added`);
            qc.invalidateQueries({ queryKey: ["inventory-items"] });
            onClose();
        } else {
            toast.error(result.error);
        }
    }

    return (
        <Modal isOpen={true} onClose={onClose} title="Add Inventory Item">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="form-group col-span-2">
                        <label className="label">Item Name</label>
                        <input {...register("itemName")} className="input" placeholder="Cotton Fabric" />
                        {errors.itemName && <p className="error-text">{errors.itemName.message}</p>}
                    </div>
                    <div className="form-group">
                        <label className="label">Current Stock</label>
                        <input {...register("currentStock", { valueAsNumber: true })} type="number" step="0.001" className="input" placeholder="0" />
                        {errors.currentStock && <p className="error-text">{errors.currentStock.message}</p>}
                    </div>
                    <div className="form-group">
                        <label className="label">Unit</label>
                        <input {...register("unit")} className="input" placeholder="kg" />
                    </div>
                    <div className="form-group">
                        <label className="label">Minimum Stock</label>
                        <input {...register("minimumStock", { valueAsNumber: true })} type="number" step="0.001" className="input" placeholder="0" />
                    </div>
                    <div className="form-group">
                        <label className="label">Safety Stock</label>
                        <input {...register("safetyStock", { valueAsNumber: true })} type="number" step="0.001" className="input" placeholder="0" />
                    </div>
                    <div className="form-group">
                        <label className="label">Daily Consumption</label>
                        <input {...register("dailyConsumption", { valueAsNumber: true })} type="number" step="0.001" className="input" placeholder="0" />
                        {errors.dailyConsumption && <p className="error-text">{errors.dailyConsumption.message}</p>}
                    </div>
                    <div className="form-group">
                        <label className="label">Lead Time (days)</label>
                        <input {...register("leadTimeDays", { valueAsNumber: true })} type="number" className="input" placeholder="3" />
                    </div>
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary flex-1">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                        {isSubmitting ? "Adding..." : "Add Item"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ item, onClose }: { item: InventoryItemWithStatus; onClose: () => void }) {
    const qc = useQueryClient();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateFormData>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            id: item.id,
            itemName: item.itemName,
            currentStock: item.currentStock,
            minimumStock: item.minimumStock,
            safetyStock: item.safetyStock,
            dailyConsumption: item.dailyConsumption,
            leadTimeDays: item.leadTimeDays,
            unit: item.unit,
        },
    });

    async function onSubmit(data: UpdateFormData) {
        const result = await updateInventoryItem({
            id: data.id,
            itemName: data.itemName,
            currentStock: data.currentStock,
            minimumStock: data.minimumStock,
            safetyStock: data.safetyStock,
            dailyConsumption: data.dailyConsumption,
            leadTimeDays: data.leadTimeDays,
            unit: data.unit,
        });
        if (result.success) {
            toast.success(`Inventory item ${data.itemName} updated`);
            qc.invalidateQueries({ queryKey: ["inventory-items"] });
            onClose();
        } else {
            toast.error(result.error);
        }
    }

    return (
        <Modal isOpen={true} onClose={onClose} title="Edit Item">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register("id")} />
                <div className="grid grid-cols-2 gap-3">
                    <div className="form-group col-span-2">
                        <label className="label">Item Name</label>
                        <input {...register("itemName")} className="input" />
                        {errors.itemName && <p className="error-text">{errors.itemName.message}</p>}
                    </div>
                    <div className="form-group">
                        <label className="label">Current Stock</label>
                        <input {...register("currentStock", { valueAsNumber: true })} type="number" step="0.001" className="input" />
                    </div>
                    <div className="form-group">
                        <label className="label">Unit</label>
                        <input {...register("unit")} className="input" />
                    </div>
                    <div className="form-group">
                        <label className="label">Minimum Stock</label>
                        <input {...register("minimumStock", { valueAsNumber: true })} type="number" step="0.001" className="input" />
                    </div>
                    <div className="form-group">
                        <label className="label">Safety Stock</label>
                        <input {...register("safetyStock", { valueAsNumber: true })} type="number" step="0.001" className="input" />
                    </div>
                    <div className="form-group">
                        <label className="label">Daily Consumption</label>
                        <input {...register("dailyConsumption", { valueAsNumber: true })} type="number" step="0.001" className="input" />
                        {errors.dailyConsumption && <p className="error-text">{errors.dailyConsumption.message}</p>}
                    </div>
                    <div className="form-group">
                        <label className="label">Lead Time (days)</label>
                        <input {...register("leadTimeDays", { valueAsNumber: true })} type="number" className="input" />
                    </div>
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary flex-1">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
    const [showCreate, setShowCreate] = useState(false);
    const [showCsvUploader, setShowCsvUploader] = useState(false);
    const [editItem, setEditItem] = useState<InventoryItemWithStatus | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const qc = useQueryClient();
    const { data: items, isLoading, error } = useInventoryItems();

    async function handleDelete() {
        if (!deleteId) return;
        const result = await deleteInventoryItem(deleteId);
        if (result.success) {
            toast.success("Inventory item deleted");
            qc.invalidateQueries({ queryKey: ["inventory-items"] });
        } else {
            toast.error(result.error);
        }
        setDeleteId(null);
    }

    const criticalCount = items?.filter((i) => i.status === "critical").length ?? 0;
    const warningCount = items?.filter((i) => i.status === "warning").length ?? 0;

    return (
        <div className="space-y-5">
            {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
            <CsvUploader isOpen={showCsvUploader} onClose={() => setShowCsvUploader(false)} uploadType="inventory" />
            {editItem && <EditModal item={editItem} onClose={() => setEditItem(null)} />}
            {deleteId && (
                <ConfirmDialog
                    isOpen={true}
                    onClose={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Delete Inventory Item"
                    description="Are you sure you want to delete this item? This action cannot be undone."
                    confirmText="Delete Item"
                    variant="destructive"
                />
            )}

            {/* Alert summary */}
            {!isLoading && (criticalCount > 0 || warningCount > 0) && (
                <div className="flex flex-wrap gap-3">
                    {criticalCount > 0 && (
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs badge-critical">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {criticalCount} critical — order immediately
                        </div>
                    )}
                    {warningCount > 0 && (
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs badge-warning">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {warningCount} items approaching reorder level
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        Inventory
                    </h2>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {items?.length ?? 0} items tracked
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowCsvUploader(true)} className="btn-ghost">
                        <Upload className="h-4 w-4" /> Upload CSV
                    </button>
                    <button onClick={() => setShowCreate(true)} className="btn-primary">
                        <Plus className="h-4 w-4" /> Add Item
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden">
                {isLoading ? (
                    <div className="space-y-px p-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="skeleton h-12 w-full rounded" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-sm" style={{ color: "var(--color-loss)" }}>
                        Failed to load inventory.
                    </div>
                ) : !items?.length ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                            No inventory items
                        </p>
                        <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                            Add items to start tracking stock levels
                        </p>
                        <button onClick={() => setShowCreate(true)} className="btn-primary mt-4">
                            <Plus className="h-4 w-4" /> Add First Item
                        </button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Status</th>
                                <th>Current Stock</th>
                                <th>Reorder Level</th>
                                <th>Reorder Qty</th>
                                <th>Lead Time</th>
                                <th>Updated</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const statusClass = {
                                    critical: "badge-critical",
                                    warning: "badge-warning",
                                    safe: "badge-safe",
                                }[item.status];

                                const StatusIcon = item.status === "safe" ? CheckCircle : AlertTriangle;

                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                                                {item.itemName}
                                            </span>
                                            <span className="ml-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                                                ({item.unit})
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="tabular-nums">{formatNumber(item.currentStock, 1)}</td>
                                        <td className="tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                                            {formatNumber(item.reorderLevel, 1)}
                                        </td>
                                        <td
                                            className="tabular-nums font-medium"
                                            style={{ color: item.reorderQty > 0 ? "var(--color-loss)" : "var(--color-gain)" }}
                                        >
                                            {item.reorderQty > 0 ? formatNumber(item.reorderQty, 1) : "—"}
                                        </td>
                                        <td style={{ color: "var(--color-text-muted)" }}>{item.leadTimeDays}d</td>
                                        <td style={{ color: "var(--color-text-muted)" }}>{formatDate(item.updatedAt)}</td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setEditItem(item)}
                                                    className="rounded p-1.5 transition-colors hover:bg-surface-raised hover:text-text-primary"
                                                    style={{ color: "var(--color-text-muted)" }}
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(item.id)}
                                                    className="rounded p-1.5 transition-colors hover:bg-surface-raised hover:text-loss"
                                                    style={{ color: "var(--color-text-muted)" }}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
