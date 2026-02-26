"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from "recharts";
import { formatCurrency } from "@/lib/utils";

// Define minimal types for Recharts tooltip props since the library types can be complex to import
interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        name: string;
        color: string;
        dataKey: string;
    }>;
    label?: string;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-white/10 bg-surface/90 px-4 py-3 text-xs shadow-xl backdrop-blur-md">
            <p className="mb-2 font-medium text-text-muted">{label}</p>
            {payload.map((p) => (
                <div key={p.dataKey} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                        <span className="text-text-secondary capitalize">{p.name}</span>
                    </div>
                    <span className="font-mono font-bold text-text-primary">
                        {formatCurrency(p.value)}
                    </span>
                </div>
            ))}
        </div>
    );
}

// Define the expected data shape
interface ChartDataPoint {
    name: string;
    variance: number;
    [key: string]: string | number;
}

export function CostTrendChart({ data }: { data: ChartDataPoint[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-text-muted">
                No trend data available
            </div>
        );
    }

    return (
        <div className="h-full w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorVariance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" opacity={0.3} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis
                        hide={true} // Cleaner look for "Vibe"
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "3 3" }} />
                    <ReferenceLine y={0} stroke="var(--color-border)" opacity={0.5} />

                    <Area
                        type="monotone" // Spline
                        dataKey="variance"
                        name="Cost Variance"
                        stroke="var(--color-accent)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorVariance)"
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-accent)" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
