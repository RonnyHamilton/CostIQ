"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface InventoryItem {
    id: string;
    itemName: string;
    currentStock: number;
    safetyStock: number;
    unit: string;
    status: "critical" | "warning" | "safe";
}

export function InventoryScroller({ items }: { items: InventoryItem[] }) {
    // Filter to show only items needing attention or critical ones first
    const criticalItems = items.filter(i => i.status !== "safe").slice(0, 10);

    return (
        <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <motion.div
                className="flex gap-4 w-max"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
            >
                {criticalItems.length === 0 ? (
                    <div className="text-text-muted text-sm italic px-4">No critical inventory alerts</div>
                ) : (
                    criticalItems.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={{
                                hidden: { opacity: 0, x: 20 },
                                visible: { opacity: 1, x: 0 }
                            }}
                        >
                            <Card className="w-[180px] h-[160px] flex flex-col justify-between group cursor-pointer" padding="md">
                                <div className="flex justify-between items-start">
                                    <div className={cn(
                                        "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                                        item.status === "critical" ? "bg-loss/20 text-loss" : "bg-warning/20 text-warning"
                                    )}>
                                        <AlertTriangle className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted opacity-50 group-hover:opacity-100 transition-opacity">
                                        Reorder
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-text-primary text-sm truncate" title={item.itemName}>
                                        {item.itemName}
                                    </h4>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-xl font-bold text-text-primary">
                                            {formatNumber(item.currentStock)}
                                        </span>
                                        <span className="text-xs text-text-muted">{item.unit}</span>
                                    </div>
                                </div>

                                {/* Mini Bar Chart: Current vs Safety */}
                                <div className="space-y-1">
                                    <div className="bg-white/10 h-1.5 w-full rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((item.currentStock / (item.safetyStock * 2)) * 100, 100)}%` }}
                                            className={cn(
                                                "h-full rounded-full",
                                                item.status === "critical" ? "bg-loss shadow-[0_0_8px_var(--color-loss)]" : "bg-warning"
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-text-secondary">
                                        <span>Current</span>
                                        <span>Safe: {formatNumber(item.safetyStock)}</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
}
