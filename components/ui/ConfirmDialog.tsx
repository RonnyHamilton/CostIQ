"use client";

import { Modal } from "./Modal";
import { Loader2, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "default";
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    {variant === "destructive" && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-loss/10 text-loss">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="mt-2 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50 ${variant === "destructive"
                                ? "bg-loss hover:opacity-90"
                                : "bg-primary hover:opacity-90"
                            }`}
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
