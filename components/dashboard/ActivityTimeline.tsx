"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
    Activity,
    Package,
    ShoppingCart,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
    id: string;
    type: "order" | "inventory" | "production";
    action: string;
    description: string;
    timestamp: string;
    status: "success" | "warning" | "error" | "info";
    user?: string;
    value?: string;
}

const iconMap = {
    order: ShoppingCart,
    inventory: Package,
    production: Activity,
};

const statusColorMap = {
    success: "text-safe",
    warning: "text-warning",
    error: "text-loss",
    info: "text-accent",
};

const statusBgMap = {
    success: "bg-safe/10 border-safe/20",
    warning: "bg-warning/10 border-warning/20",
    error: "bg-loss/10 border-loss/20",
    info: "bg-accent/10 border-accent/20",
};

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-text-muted">
                No recent activity
            </div>
        );
    }

    return (
        <div className="relative space-y-2 p-4">
            {/* Vertical Line for connection (optional, currently using floating cards) */}
            {/* <div className="absolute left-8 top-6 bottom-6 w-px bg-white/10" /> */}

            {items.slice(0, 6).map((item, index) => {
                const Icon = iconMap[item.type] || Activity;
                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative flex items-center gap-4 rounded-xl border border-transparent p-3 transition-all duration-300 hover:bg-white/5 hover:border-white/10 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.05)] hover:scale-[1.01] cursor-default"
                    >
                        {/* Icon Box */}
                        <div className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm transition-all group-hover:shadow-[0_0_10px_currentColor]",
                            statusBgMap[item.status],
                            statusColorMap[item.status]
                        )}>
                            <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {item.action}
                                </p>
                                <span className="text-[10px] text-text-muted whitespace-nowrap flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                                <p className="text-xs text-text-secondary truncate pr-4">
                                    {item.description}
                                </p>
                                {item.value && (
                                    <span className="text-xs font-mono font-bold text-text-primary bg-white/5 px-2 py-0.5 rounded">
                                        {item.value}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
