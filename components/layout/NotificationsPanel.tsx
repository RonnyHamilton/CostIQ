"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    Package,
    X,
    Bell,
    CheckCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
    id: string;
    type: "critical" | "overrun" | "saving" | "new_order";
    title: string;
    description: string;
    timestamp: Date;
    href: string;
    read: boolean;
}

// ─── Icon + Color Config ──────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
    string,
    { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
    critical: {
        icon: AlertTriangle,
        color: "#FB7185",
        bgColor: "rgba(251,113,133,0.1)",
        label: "Critical Alert",
    },
    overrun: {
        icon: TrendingDown,
        color: "#FF2E63",
        bgColor: "rgba(255,46,99,0.1)",
        label: "Cost Overrun",
    },
    saving: {
        icon: TrendingUp,
        color: "#00E096",
        bgColor: "rgba(0,224,150,0.1)",
        label: "Savings Detected",
    },
    new_order: {
        icon: Package,
        color: "#818CF8",
        bgColor: "rgba(129,140,248,0.1)",
        label: "New Order",
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationsPanel({
    isOpen,
    onClose,
    onCountChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    onCountChange: (count: number) => void;
}) {
    const router = useRouter();
    const panelRef = useRef<HTMLDivElement>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // ── Fetch notifications ───────────────────────────────────────────────────

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchNotifications() {
        setIsLoading(true);
        const items: Notification[] = [];

        try {
            // 1. Critical stock alerts
            const { data: materials } = await supabase
                .from("material_inventory")
                .select("*");

            (materials ?? []).forEach((m: { id: string; material_name: string; current_stock: number; reorder_level: number; created_at: string }) => {
                if (m.current_stock <= m.reorder_level) {
                    const deficit = m.reorder_level - m.current_stock;
                    items.push({
                        id: `crit-${m.id}`,
                        type: "critical",
                        title: `${m.material_name} Below Reorder`,
                        description: `Stock: ${m.current_stock} units (deficit: ${deficit}). Immediate reorder required.`,
                        timestamp: new Date(m.created_at),
                        href: "/inventory",
                        read: false,
                    });
                }
            });

            // 2. Recent cost overruns (last 7 days, >5% over budget)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const { data: recentLogs } = await supabase
                .from("production_logs")
                .select("*")
                .gte("created_at", weekAgo.toISOString())
                .order("created_at", { ascending: false });

            // Group by date+material for overruns
            const overrunMap = new Map<string, { material: string; total_planned: number; total_actual: number; latest: string }>();

            (recentLogs ?? []).forEach((l: { material_name: string; planned_cost: number; actual_cost: number; created_at: string }) => {
                const dateKey = new Date(l.created_at).toISOString().slice(0, 10);
                const key = `${dateKey}-${l.material_name}`;
                const existing = overrunMap.get(key);
                if (existing) {
                    existing.total_planned += Number(l.planned_cost);
                    existing.total_actual += Number(l.actual_cost);
                } else {
                    overrunMap.set(key, {
                        material: l.material_name,
                        total_planned: Number(l.planned_cost),
                        total_actual: Number(l.actual_cost),
                        latest: l.created_at,
                    });
                }
            });

            let overrunCount = 0;
            let savingCount = 0;
            overrunMap.forEach((v, key) => {
                const variancePct = ((v.total_actual - v.total_planned) / v.total_planned) * 100;
                if (variancePct > 5 && overrunCount < 5) {
                    overrunCount++;
                    items.push({
                        id: `overrun-${key}`,
                        type: "overrun",
                        title: `${v.material} Cost Overrun`,
                        description: `+${variancePct.toFixed(1)}% over budget (₹${Math.round(v.total_actual - v.total_planned).toLocaleString()} excess)`,
                        timestamp: new Date(v.latest),
                        href: "/reports",
                        read: false,
                    });
                } else if (variancePct < -3 && savingCount < 3) {
                    savingCount++;
                    items.push({
                        id: `saving-${key}`,
                        type: "saving",
                        title: `${v.material} Cost Savings`,
                        description: `${Math.abs(variancePct).toFixed(1)}% under budget (₹${Math.abs(Math.round(v.total_actual - v.total_planned)).toLocaleString()} saved)`,
                        timestamp: new Date(v.latest),
                        href: "/reports",
                        read: false,
                    });
                }
            });

            // 3. New orders (last 48 hours)
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            const { data: newOrders } = await supabase
                .from("orders")
                .select("*")
                .gte("created_at", twoDaysAgo.toISOString())
                .order("created_at", { ascending: false });

            (newOrders ?? []).forEach((o: { id: string; order_number: string; description: string; created_at: string }) => {
                items.push({
                    id: `order-${o.id}`,
                    type: "new_order",
                    title: `New Order: ${o.order_number}`,
                    description: o.description,
                    timestamp: new Date(o.created_at),
                    href: "/planning",
                    read: false,
                });
            });
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }

        // Sort by timestamp descending
        items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setNotifications(items);
        onCountChange(items.filter((n) => !n.read).length);
        setIsLoading(false);
    }

    // ── Click outside ─────────────────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen) return;
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen, onClose]);

    // ── Actions ───────────────────────────────────────────────────────────────

    function markAllRead() {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        onCountChange(0);
    }

    function dismiss(id: string) {
        setNotifications((prev) => {
            const next = prev.filter((n) => n.id !== id);
            onCountChange(next.filter((n) => !n.read).length);
            return next;
        });
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-3 w-[380px] bg-[#18181B] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[100]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-text-muted" />
                            <span className="text-sm font-bold text-white">
                                Notifications
                            </span>
                            {unreadCount > 0 && (
                                <span
                                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                                    style={{
                                        backgroundColor: "rgba(251,113,133,0.15)",
                                        color: "#FB7185",
                                    }}
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[420px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <span className="text-xs text-text-muted animate-pulse">
                                    Loading alerts...
                                </span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <Bell className="w-8 h-8 text-text-muted opacity-30" />
                                <span className="text-xs text-text-muted">
                                    All clear — no new alerts
                                </span>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const config = TYPE_CONFIG[n.type];
                                const Icon = config.icon;
                                return (
                                    <div
                                        key={n.id}
                                        className={`flex gap-3 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer group ${n.read ? "opacity-50" : ""
                                            }`}
                                        onClick={() => {
                                            router.push(n.href);
                                            onClose();
                                        }}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                            style={{ backgroundColor: config.bgColor }}
                                        >
                                            <Icon
                                                className="w-4 h-4"
                                                style={{ color: config.color }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="text-xs font-semibold text-white truncate">
                                                    {n.title}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dismiss(n.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md text-text-muted hover:text-white hover:bg-white/5 transition-all cursor-pointer flex-shrink-0"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
                                                {n.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className="text-[9px] font-bold uppercase tracking-wider"
                                                    style={{ color: config.color }}
                                                >
                                                    {config.label}
                                                </span>
                                                <span className="text-[9px] text-text-muted">
                                                    {formatDistanceToNow(n.timestamp, {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
