"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    LayoutDashboard,
    FileText,
    Package,
    PieChart,
    ArrowRight,
    Command,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
    id: string;
    title: string;
    subtitle: string;
    category: "page" | "order" | "inventory" | "material";
    href: string;
    icon: React.ElementType;
}

// ─── Static Pages ─────────────────────────────────────────────────────────────

const PAGE_RESULTS: SearchResult[] = [
    {
        id: "page-overview",
        title: "Overview",
        subtitle: "Cost variance and inventory alerts",
        category: "page",
        href: "/overview",
        icon: LayoutDashboard,
    },
    {
        id: "page-planning",
        title: "Production Planning",
        subtitle: "Manage orders and bill of materials",
        category: "page",
        href: "/planning",
        icon: FileText,
    },
    {
        id: "page-inventory",
        title: "Inventory Control",
        subtitle: "Monitor stock levels and reorder needs",
        category: "page",
        href: "/inventory",
        icon: Package,
    },
    {
        id: "page-reports",
        title: "Reports",
        subtitle: "Order-wise variance summary",
        category: "page",
        href: "/reports",
        icon: PieChart,
    },
];

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
    page: "Pages",
    order: "Orders",
    inventory: "Inventory Items",
    material: "Materials",
};

const CATEGORY_COLORS: Record<string, string> = {
    page: "#2DD4BF",
    order: "#818CF8",
    inventory: "#FBBF24",
    material: "#00E096",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SearchPalette({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dbResults, setDbResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // ── Fetch DB data on open ─────────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);
        Promise.all([
            supabase.from("orders").select("id, order_number, description, status"),
            supabase.from("inventory_items").select("id, item_name, current_stock, unit"),
            supabase.from("material_inventory").select("id, material_name, current_stock, reorder_level"),
        ]).then(([ordersRes, invRes, matRes]) => {
            const items: SearchResult[] = [];

            // Orders
            (ordersRes.data ?? []).forEach((o: { id: string; order_number: string; description: string; status: string }) => {
                items.push({
                    id: `order-${o.id}`,
                    title: o.order_number,
                    subtitle: `${o.description} (${o.status})`,
                    category: "order",
                    href: "/planning",
                    icon: FileText,
                });
            });

            // Inventory items
            (invRes.data ?? []).forEach((i: { id: string; item_name: string; current_stock: number; unit: string }) => {
                items.push({
                    id: `inv-${i.id}`,
                    title: i.item_name,
                    subtitle: `Stock: ${i.current_stock} ${i.unit}`,
                    category: "inventory",
                    href: "/inventory",
                    icon: Package,
                });
            });

            // Materials
            (matRes.data ?? []).forEach((m: { id: string; material_name: string; current_stock: number; reorder_level: number }) => {
                const status =
                    m.current_stock <= m.reorder_level ? "⚠️ Below reorder" : "✓ In stock";
                items.push({
                    id: `mat-${m.id}`,
                    title: m.material_name,
                    subtitle: `${m.current_stock} units — ${status}`,
                    category: "material",
                    href: "/inventory",
                    icon: Package,
                });
            });

            setDbResults(items);
            setIsLoading(false);
        });
    }, [isOpen]);

    // ── Filter results ────────────────────────────────────────────────────────

    useEffect(() => {
        const allResults = [...PAGE_RESULTS, ...dbResults];
        if (!query.trim()) {
            setResults(allResults.slice(0, 12));
        } else {
            const q = query.toLowerCase();
            const filtered = allResults.filter(
                (r) =>
                    r.title.toLowerCase().includes(q) ||
                    r.subtitle.toLowerCase().includes(q)
            );
            setResults(filtered.slice(0, 12));
        }
        setActiveIndex(0);
    }, [query, dbResults]);

    // ── Focus input on open ───────────────────────────────────────────────────

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery("");
        }
    }, [isOpen]);

    // ── Keyboard navigation ───────────────────────────────────────────────────

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter" && results[activeIndex]) {
                e.preventDefault();
                router.push(results[activeIndex].href);
                onClose();
            } else if (e.key === "Escape") {
                onClose();
            }
        },
        [results, activeIndex, router, onClose]
    );

    // ── Group results by category ─────────────────────────────────────────────

    const grouped = results.reduce(
        (acc, r) => {
            if (!acc[r.category]) acc[r.category] = [];
            acc[r.category].push(r);
            return acc;
        },
        {} as Record<string, SearchResult[]>
    );

    // Track flat index for keyboard nav
    let flatIndex = -1;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-xl bg-[#18181B] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Input */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                            <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search pages, orders, materials..."
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-text-muted outline-none"
                            />
                            <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-text-muted border border-white/10">
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <div className="max-h-[50vh] overflow-y-auto py-2">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <span className="text-xs text-text-muted animate-pulse">
                                        Loading search index...
                                    </span>
                                </div>
                            ) : results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-2">
                                    <Search className="w-8 h-8 text-text-muted opacity-30" />
                                    <span className="text-xs text-text-muted">
                                        No results for &ldquo;{query}&rdquo;
                                    </span>
                                </div>
                            ) : (
                                Object.entries(grouped).map(([category, items]) => (
                                    <div key={category} className="mb-1">
                                        <div className="px-4 py-1.5">
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-widest"
                                                style={{
                                                    color: CATEGORY_COLORS[category] ?? "#A1A1AA",
                                                }}
                                            >
                                                {CATEGORY_LABELS[category] ?? category}
                                            </span>
                                        </div>
                                        {items.map((result) => {
                                            flatIndex++;
                                            const isActive = flatIndex === activeIndex;
                                            const idx = flatIndex;
                                            return (
                                                <button
                                                    key={result.id}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${isActive
                                                        ? "bg-white/5"
                                                        : "hover:bg-white/[0.03]"
                                                        }`}
                                                    onClick={() => {
                                                        router.push(result.href);
                                                        onClose();
                                                    }}
                                                    onMouseEnter={() => setActiveIndex(idx)}
                                                >
                                                    <div
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{
                                                            backgroundColor: `${CATEGORY_COLORS[result.category]}15`,
                                                        }}
                                                    >
                                                        <result.icon
                                                            className="w-3.5 h-3.5"
                                                            style={{
                                                                color: CATEGORY_COLORS[result.category],
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-white truncate">
                                                            {result.title}
                                                        </div>
                                                        <div className="text-[11px] text-text-secondary truncate">
                                                            {result.subtitle}
                                                        </div>
                                                    </div>
                                                    {isActive && (
                                                        <ArrowRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-[10px] text-text-muted">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">↑</kbd>
                                    <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">↓</kbd>
                                    navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">↵</kbd>
                                    select
                                </span>
                            </div>
                            <span className="flex items-center gap-1">
                                <Command className="w-3 h-3" />K to search
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
