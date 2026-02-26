"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Activity,
    Zap,
    ShoppingCart,
    AlertTriangle,
    PackageX,
    PieChart as PieChartIcon,
    BarChart3,
    Flame,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import Link from "next/link";

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

// ─── Chart Theme ──────────────────────────────────────────────────────────────

const MINT = "#00E096";
const CRIMSON = "#FF2E63";
const INDIGO = "#818CF8";
const AMBER = "#FBBF24";
const TEAL = "#2DD4BF";

const DONUT_COLORS = [MINT, CRIMSON, INDIGO, AMBER, TEAL];

const tooltipStyle = {
    backgroundColor: "rgba(19, 19, 19, 0.9)",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
    backdropFilter: "blur(12px)",
};

// ─── Empty State Component ────────────────────────────────────────────────────

function EmptyState({
    icon: Icon,
    label,
}: {
    icon: React.ElementType;
    label: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <Icon className="w-10 h-10 text-text-muted" />
            <span className="text-xs font-medium text-text-muted tracking-wide uppercase">
                {label}
            </span>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
    const { data, isLoading } = useDashboardData();

    // ── Loading State ───────────────────────────────────────────────────────────

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-sm font-medium tracking-widest uppercase text-accent"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    Initializing Nexus Intelligence...
                </motion.p>
            </div>
        );
    }

    // ── Derived values ──────────────────────────────────────────────────────────

    // netVariance = actual − planned; positive = increase (green), negative = decline (red)
    const isIncrease = data.netVariance >= 0;
    const efficiencyClamped = Math.min(Math.round(data.efficiencyScore * 10) / 10, 150);
    const healthPct = Math.round(data.inventoryHealth);

    return (
        <motion.div
            className="space-y-4 pb-10 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* ─── Ambient Backlight Blob ──────────────────────────────────── */}
            <div
                className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[120px] -z-10"
                style={{
                    background: isIncrease
                        ? "radial-gradient(circle, rgba(0,224,150,0.25) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(255,46,99,0.25) 0%, transparent 70%)",
                }}
            />

            {/* ─── Row 1: Hero + KPI Cards ────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* ═══ HERO CARD: Net Cost Variance (spans 6 cols) ═══ */}
                <motion.div
                    variants={itemVariants}
                    className={`lg:col-span-6 card-glass ${isIncrease ? 'glow-mint' : 'glow-crimson'} p-6 rounded-3xl group relative`}
                >
                    <div className="relative z-10 flex items-center gap-6 h-full">
                        {/* Left 60%: Text Content */}
                        <div className="flex-[3] flex flex-col justify-between min-h-[140px]">
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="w-4 h-4 text-text-muted" />
                                <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">
                                    Net Cost Variance
                                </span>
                            </div>
                            <div>
                                <span
                                    className={`text-5xl font-bold tracking-tight block ${isIncrease ? 'text-glow-profit' : 'text-glow-loss'}`}
                                    style={{
                                        fontFamily: "'Space Grotesk', 'JetBrains Mono', monospace",
                                        color: isIncrease ? MINT : CRIMSON,
                                    }}
                                >
                                    {data.netVariance > 0 ? "+" : ""}
                                    {formatCurrency(data.netVariance)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                {isIncrease ? (
                                    <TrendingUp className="w-4 h-4" style={{ color: MINT }} />
                                ) : (
                                    <TrendingDown className="w-4 h-4" style={{ color: CRIMSON }} />
                                )}
                                <span className="text-xs text-text-secondary">
                                    {isIncrease ? "cost growth" : "cost decline"} vs planned budget
                                </span>
                            </div>
                        </div>

                        {/* Right 40%: Sparkline + 3D Element */}
                        <div className="flex-[2] flex flex-col items-center justify-center gap-3">
                            {/* 3D Floating Icon */}
                            <div className="animate-float-slow relative">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: isIncrease
                                            ? "linear-gradient(135deg, rgba(0,224,150,0.15), rgba(0,224,150,0.05))"
                                            : "linear-gradient(135deg, rgba(255,46,99,0.15), rgba(255,46,99,0.05))",
                                        boxShadow: isIncrease
                                            ? "0 8px 30px -5px rgba(0,224,150,0.3), 0 20px 40px -10px rgba(0,224,150,0.1)"
                                            : "0 8px 30px -5px rgba(255,46,99,0.3), 0 20px 40px -10px rgba(255,46,99,0.1)",
                                        border: `1px solid ${isIncrease ? 'rgba(0,224,150,0.2)' : 'rgba(255,46,99,0.2)'}`,
                                    }}
                                >
                                    {isIncrease ? (
                                        <TrendingUp className="w-10 h-10" style={{ color: MINT, filter: `drop-shadow(0 0 8px ${MINT})` }} />
                                    ) : (
                                        <TrendingDown className="w-10 h-10" style={{ color: CRIMSON, filter: `drop-shadow(0 0 8px ${CRIMSON})` }} />
                                    )}
                                </div>
                                {/* 3D reflection shadow */}
                                <div
                                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full blur-md"
                                    style={{
                                        background: isIncrease
                                            ? "rgba(0,224,150,0.2)"
                                            : "rgba(255,46,99,0.2)",
                                    }}
                                />
                            </div>

                            {/* Mini sparkline */}
                            {data.varianceTrend.length > 0 && (
                                <div className="w-full opacity-60 group-hover:opacity-100 transition-opacity">
                                    <ResponsiveContainer width="100%" height={40}>
                                        <AreaChart data={data.varianceTrend}>
                                            <defs>
                                                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop
                                                        offset="0%"
                                                        stopColor={isIncrease ? MINT : CRIMSON}
                                                        stopOpacity={0.4}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor={isIncrease ? MINT : CRIMSON}
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="planned"
                                                stroke={isIncrease ? MINT : CRIMSON}
                                                strokeWidth={2}
                                                fill="url(#sparkGrad)"
                                                dot={false}
                                                style={{ filter: `drop-shadow(0 0 6px ${isIncrease ? MINT : CRIMSON})` }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ═══ Efficiency Score ═══ */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 card-glass glow-accent p-5 rounded-2xl group flex flex-col"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">
                            Efficiency
                        </span>
                        <Zap className="w-3.5 h-3.5 text-text-muted" />
                    </div>
                    <span
                        className="text-2xl font-bold text-white tracking-tight text-glow-accent"
                        style={{ fontFamily: "'Space Grotesk', monospace" }}
                    >
                        {efficiencyClamped.toFixed(1)}%
                    </span>
                    <div className="flex-1 flex flex-col justify-end pb-1 gap-2 mt-3">
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden w-full">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(efficiencyClamped, 100)}%` }}
                                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{
                                    background: `linear-gradient(90deg, ${MINT}, ${TEAL})`,
                                    boxShadow: `0 0 12px -2px rgba(0, 224, 150, 0.5)`,
                                }}
                            />
                        </div>
                        <span className="text-[10px] text-text-muted text-right">
                            Target: 96%
                        </span>
                    </div>
                </motion.div>

                {/* ═══ Active Orders ═══ */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 card-glass glow-indigo p-5 rounded-2xl group flex flex-col"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">
                            Active Orders
                        </span>
                        <ShoppingCart className="w-3.5 h-3.5 text-text-muted" />
                    </div>
                    <span
                        className="text-4xl font-black text-white tracking-tighter mt-2 text-glow-indigo"
                        style={{ fontFamily: "'Space Grotesk', monospace" }}
                    >
                        {data.activeOrdersCount}
                    </span>
                    <span className="text-[10px] text-text-muted mt-auto">
                        Non-draft production orders
                    </span>
                </motion.div>

                {/* ═══ Inventory Health ═══ */}
                <motion.div
                    variants={itemVariants}
                    className={`lg:col-span-2 card-glass ${data.criticalItemsCount > 0 ? 'glow-crimson' : 'glow-mint'} p-5 rounded-2xl group flex flex-col`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">
                            Inv. Health
                        </span>
                        <AlertTriangle className="w-3.5 h-3.5 text-text-muted" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span
                            className="text-2xl font-bold text-white tracking-tight"
                            style={{ fontFamily: "'Space Grotesk', monospace" }}
                        >
                            {healthPct}%
                        </span>
                        {data.criticalItemsCount > 0 && (
                            <span
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold animate-pulse"
                                style={{
                                    backgroundColor: "rgba(255,46,99,0.12)",
                                    color: CRIMSON,
                                    border: `1px solid rgba(255,46,99,0.25)`,
                                    boxShadow: `0 0 12px -3px rgba(255,46,99,0.4)`,
                                }}
                            >
                                {data.criticalItemsCount} Crit
                            </span>
                        )}
                    </div>
                    <div className="flex-1 flex items-end mt-3">
                        <div className="flex gap-3 text-[10px] text-text-secondary">
                            <div className="flex items-center gap-1">
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: MINT, boxShadow: `0 0 6px ${MINT}` }}
                                />
                                Healthy
                            </div>
                            <div className="flex items-center gap-1">
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: CRIMSON, boxShadow: `0 0 6px ${CRIMSON}` }}
                                />
                                Critical
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ─── Row 2: Variance Trend + Spend Composition ─────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 340 }}>
                {/* Variance Trend - Area Chart (2/3) */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 card-glass glow-accent p-5 rounded-3xl flex flex-col group"
                >
                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-white text-glow">Variance Trend</h3>
                        <p className="text-xs text-text-secondary">
                            Planned vs Actual Cost Over Time
                        </p>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        {data.varianceTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={data.varianceTrend}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="gradPlanned" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={MINT} stopOpacity={0.4} />
                                            <stop offset="100%" stopColor={MINT} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={CRIMSON} stopOpacity={0.4} />
                                            <stop offset="100%" stopColor={CRIMSON} stopOpacity={0} />
                                        </linearGradient>
                                        {/* Neon glow filter for lines */}
                                        <filter id="glowMint" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={MINT} floodOpacity="0.5" />
                                        </filter>
                                        <filter id="glowCrimson" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={CRIMSON} floodOpacity="0.5" />
                                        </filter>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.04)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke="var(--color-text-secondary)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="var(--color-text-secondary)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v: number) =>
                                            v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                                        }
                                    />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        itemStyle={{ fontSize: "11px" }}
                                        labelStyle={{
                                            color: "var(--color-text-secondary)",
                                            marginBottom: "4px",
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        height={32}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: "11px", fontWeight: 500 }}
                                    />
                                    <Area
                                        name="Planned"
                                        type="monotone"
                                        dataKey="planned"
                                        stroke={MINT}
                                        strokeWidth={3}
                                        fill="url(#gradPlanned)"
                                        dot={false}
                                        activeDot={{ r: 5, fill: MINT, strokeWidth: 0, style: { filter: `drop-shadow(0 0 8px ${MINT})` } }}
                                        style={{ filter: "url(#glowMint)" }}
                                    />
                                    <Area
                                        name="Actual"
                                        type="monotone"
                                        dataKey="actual"
                                        stroke={CRIMSON}
                                        strokeWidth={3}
                                        fill="url(#gradActual)"
                                        dot={false}
                                        activeDot={{ r: 5, fill: CRIMSON, strokeWidth: 0, style: { filter: `drop-shadow(0 0 8px ${CRIMSON})` } }}
                                        style={{ filter: "url(#glowCrimson)" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState icon={PackageX} label="No Production Logs" />
                        )}
                    </div>
                </motion.div>

                {/* Spend Composition - Donut Chart (1/3) */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-1 card-glass glow-indigo p-5 rounded-3xl flex flex-col group"
                >
                    <div className="mb-2">
                        <h3 className="text-sm font-bold text-white text-glow">Spend Composition</h3>
                        <p className="text-xs text-text-secondary">Top 5 Materials by Cost</p>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        {data.spendComposition.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        {DONUT_COLORS.map((color, i) => (
                                            <filter key={`donutGlow-${i}`} id={`donutGlow-${i}`} x="-20%" y="-20%" width="140%" height="140%">
                                                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} floodOpacity="0.4" />
                                            </filter>
                                        ))}
                                    </defs>
                                    <Pie
                                        data={data.spendComposition}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius="40%"
                                        outerRadius="70%"
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.spendComposition.map((_, i) => (
                                            <Cell
                                                key={`cell-${i}`}
                                                fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                                                style={{ filter: `url(#donutGlow-${i % DONUT_COLORS.length})` }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        itemStyle={{ fontSize: "11px", color: "#fff" }}
                                        formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: "10px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState icon={PieChartIcon} label="No Cost Data" />
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ─── Row 3: Burn Rate + MRP Exception Table ────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 320 }}>
                {/* Burn Rate - Bar Chart (1/3) */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-1 card-glass glow-amber p-5 rounded-3xl flex flex-col group"
                >
                    <div className="mb-2">
                        <h3 className="text-sm font-bold text-white text-glow">Daily Burn Rate</h3>
                        <p className="text-xs text-text-secondary">Material Consumption</p>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        {data.burnRate.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data.burnRate}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={TEAL} stopOpacity={1} />
                                            <stop offset="100%" stopColor={TEAL} stopOpacity={0.4} />
                                        </linearGradient>
                                        <filter id="glowBar" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={TEAL} floodOpacity="0.4" />
                                        </filter>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.04)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke="var(--color-text-secondary)"
                                        fontSize={9}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="var(--color-text-secondary)"
                                        fontSize={9}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        itemStyle={{ fontSize: "11px", color: "#fff" }}
                                    />
                                    <Bar
                                        dataKey="quantity"
                                        name="Qty Used"
                                        fill="url(#barGrad)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={32}
                                        style={{ filter: "url(#glowBar)" }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState icon={BarChart3} label="No Burn Data" />
                        )}
                    </div>
                </motion.div>

                {/* MRP Exception Matrix (2/3) */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 card-glass glow-crimson p-5 rounded-3xl flex flex-col group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-white text-glow">
                                MRP Exception Matrix
                            </h3>
                            <p className="text-xs text-text-secondary">
                                Items requiring immediate reorder
                            </p>
                        </div>
                        <Link
                            href="/inventory"
                            className="text-xs font-bold text-accent hover:text-white transition-colors"
                        >
                            View All →
                        </Link>
                    </div>

                    {data.mrpExceptions.length > 0 ? (
                        <div className="overflow-auto flex-1">
                            <table className="data-table w-full">
                                <thead>
                                    <tr>
                                        <th>Material</th>
                                        <th className="text-right">Stock</th>
                                        <th className="text-right">Reorder Lvl</th>
                                        <th className="text-right">Deficit</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.mrpExceptions.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <span className="text-xs font-medium text-white">
                                                    {item.material_name}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span
                                                    className="text-xs font-bold text-glow-loss"
                                                    style={{
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        color: CRIMSON,
                                                    }}
                                                >
                                                    {item.current_stock}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span
                                                    className="text-xs text-text-secondary"
                                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                                >
                                                    {item.reorder_level}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span
                                                    className="text-xs font-bold text-glow-loss"
                                                    style={{
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        color: CRIMSON,
                                                    }}
                                                >
                                                    -{item.deficit}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white cursor-pointer border-none"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${CRIMSON}, #e6194b)`,
                                                        boxShadow: `0 0 18px -4px rgba(255,46,99,0.6)`,
                                                        animation: "pulse 2s ease-in-out infinite",
                                                    }}
                                                >
                                                    Order Now
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState icon={Flame} label="No Critical Items — All Clear" />
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
