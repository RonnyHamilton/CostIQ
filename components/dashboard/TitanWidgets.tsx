"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// ─── Generic KPI Card ─────────────────────────────────────────────────────────

interface TitanKPICardProps {
    title: string;
    value: string;
    trend?: { value: number; isGood: boolean };
    icon?: React.ReactNode;
    children?: React.ReactNode;
    delay?: number;
}

export function TitanKPICard({ title, value, trend, icon, children, delay = 0 }: TitanKPICardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="relative p-5 rounded-2xl bg-surface border border-white/5 overflow-hidden group hover:border-white/10 transition-colors flex flex-col"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{title}</span>
                {icon && <div className="text-text-muted">{icon}</div>}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
                {trend && (
                    <div className={cn("flex items-center text-xs font-bold", trend.isGood ? "text-safe" : "text-critical")}>
                        {trend.isGood ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
            <div className="flex-1 w-full min-h-0 relative mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
                {children}
            </div>
        </motion.div>
    );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

export function TitanSparkline({ data, color = "#66FCF1" }: { data: number[]; color?: string }) {
    const chartData = data.map((val, i) => ({ i, val }));

    return (
        <div className="w-full h-full min-h-[40px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="val"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// ─── Inventory Health Pie ─────────────────────────────────────────────────────

const PIE_DATA = [
    { name: "Healthy", value: 65, color: "var(--color-safe)" },
    { name: "Risk", value: 25, color: "var(--color-warning)" },
    { name: "Critical", value: 10, color: "var(--color-critical)" },
];

export function InventoryPie() {
    return (
        <div className="h-full w-full flex items-center gap-3">
            <div className="h-14 w-14 flex-shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={PIE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={16}
                            outerRadius={24}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {PIE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-bold text-text-secondary">92%</span>
                </div>
            </div>
            <div className="flex flex-col gap-0.5 text-[10px] text-text-secondary">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-safe" /> Healthy</div>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-warning" /> Risk</div>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-critical" /> Critical</div>
            </div>
        </div>
    );
}

// ─── Active Production Avatar Stack ───────────────────────────────────────────

const USERS = [
    { bg: "bg-blue-500", label: "JD" },
    { bg: "bg-purple-500", label: "AM" },
    { bg: "bg-emerald-500", label: "RK" },
];

export function ActiveProductionStack() {
    return (
        <div className="flex items-end h-full w-full pb-1">
            <div className="flex -space-x-3">
                {USERS.map((u, i) => (
                    <div key={i} className={cn("w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-[10px] font-bold text-white shadow-md", u.bg)}>
                        {u.label}
                    </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-raised flex items-center justify-center text-[10px] text-text-secondary font-medium shadow-md">
                    +12
                </div>
            </div>
            <div className="ml-4 flex flex-col justify-center">
                <span className="text-sm font-bold text-white">3 Active Shifts</span>
                <span className="text-[10px] text-accent animate-pulse">Live Operations</span>
            </div>
        </div>
    );
}
