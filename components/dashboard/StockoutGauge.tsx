"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StockoutGaugeProps {
    criticalCount: number;
    totalItems: number;
}

export function StockoutGauge({ criticalCount, totalItems }: StockoutGaugeProps) {
    // Gauge Data: 3 zones (Safe, Warning, Critical)
    // We want the pointer to reflect the "Risk Level".
    // High critical count = High Risk (Right side, Red).
    // Low critical count = Low Risk (Left side, Green).

    // Normalized risk score (0 to 100)
    // If 0 critical items -> score 0 (Safe).
    // If > 20% critical -> score 100 (Critical).
    const riskRatio = totalItems > 0 ? criticalCount / totalItems : 0;
    const riskScore = Math.min(riskRatio * 500, 100); // Scaling factor to make it sensitive

    // Gauge background segments
    const data = [
        { name: "Safe", value: 33, color: "var(--color-safe)" },
        { name: "Warning", value: 33, color: "var(--color-warning)" },
        { name: "Critical", value: 34, color: "var(--color-critical)" },
    ];

    // Pointer rotation: -90deg (Start) to 90deg (End)
    // Map riskScore (0-100) to angle (-90 to 90)
    const rotation = -90 + (riskScore / 100) * 180;

    const isCritical = criticalCount > 0;

    return (
        <Card className="h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

            <div className="z-10 px-6 pt-6">
                <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest mb-1">
                    <div className={cn("h-1.5 w-1.5 rounded-full", isCritical ? "bg-loss animate-pulse" : "bg-safe")} />
                    Stockout Risk
                </div>
                <div className="flex items-baseline gap-2">
                    <span className={cn(
                        "text-3xl font-bold tracking-tighter",
                        isCritical ? "text-loss text-glow-critical" : "text-safe text-glow-safe"
                    )}>
                        {criticalCount}
                    </span>
                    <span className="text-sm text-text-muted">items at risk</span>
                </div>
            </div>

            <div className="h-[140px] w-full relative z-10 -mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    fillOpacity={0.2}
                                    stroke={entry.color}
                                    strokeWidth={1}
                                    className="outline-none"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Needle */}
                <motion.div
                    className="absolute bottom-0 left-[50%] h-1 w-[80px] origin-left bg-text-primary rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 10 }}
                    style={{ marginLeft: 0, marginBottom: 0 }} // Pivot at bottom-center of chart
                />
                {/* Hub */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-4 w-4 bg-text-primary rounded-full shadow-[0_0_15px_white] z-30" />
            </div>

            <div className="px-6 pb-6 pt-2 z-10 flex justify-between text-[10px] text-text-muted font-mono uppercase tracking-widest opacity-60">
                <span>Safe</span>
                <span>Critical</span>
            </div>

            {/* Ambient Glow based on state */}
            <div
                className={cn(
                    "absolute inset-0 z-0 blur-[60px] opacity-10 transition-colors duration-1000",
                    isCritical ? "bg-loss" : "bg-safe"
                )}
            />
        </Card>
    );
}
