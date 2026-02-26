"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface NetVarianceHeroProps {
    totalVariance: number;
    variancePct: number;
}

export function NetVarianceHero({ totalVariance, variancePct }: NetVarianceHeroProps) {
    // Cost Variance = Actual - Planned. 
    // If Result > 0, Actual > Planned => Loss (Red).
    // If Result < 0, Actual < Planned => Gain (Green).

    const isLoss = totalVariance > 0;
    const colorClass = isLoss ? "text-loss" : "text-gain";
    const glowColor = isLoss ? "var(--color-loss)" : "var(--color-gain)";

    return (
        <Card className="h-full relative flex flex-col justify-center overflow-hidden group">
            {/* Abstract Glow Background */}
            <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[100px] opacity-20 transition-all duration-1000 group-hover:opacity-30"
                style={{ background: glowColor }}
            />
            <div
                className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full blur-[80px] opacity-10 transition-all duration-1000 group-hover:opacity-20"
                style={{ background: isLoss ? "var(--color-warning)" : "var(--color-accent)" }}
            />

            <div className="relative z-10 px-2 space-y-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 text-text-muted text-sm font-medium uppercase tracking-widest"
                >
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    Net Variance Efficiency
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={cn("text-5xl md:text-6xl font-bold tracking-tighter flex items-center gap-3", colorClass)}
                    style={{ textShadow: `0 0 40px ${isLoss ? "var(--color-loss-subtle)" : "var(--color-gain-subtle)"}` }}
                >
                    <span>{totalVariance > 0 ? "+" : ""}{formatCurrency(totalVariance)}</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 mt-2"
                >
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-white/5 border border-white/5 backdrop-blur-sm",
                        colorClass
                    )}>
                        {isLoss ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {formatNumber(Math.abs(variancePct), 1)}%
                    </div>
                    <span className="text-text-secondary text-sm">vs planned cost</span>
                </motion.div>
            </div>
        </Card>
    );
}
