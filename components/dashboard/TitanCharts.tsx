"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend
} from "recharts";

// ─── Variance Analysis (Multi-Line) ───────────────────────────────────────────

interface VarianceDataPoint {
    name: string;
    actual: number;
    planned: number;
    variance: number;
    [key: string]: string | number;
}

interface VarianceChartProps {
    data: VarianceDataPoint[];
}

export function TitanVarianceChart({ data }: VarianceChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                />
                <XAxis
                    dataKey="name"
                    stroke="var(--color-text-secondary)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis
                    stroke="var(--color-text-secondary)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                    dx={-10}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                        backdropFilter: "blur(12px)",
                    }}
                    itemStyle={{ fontSize: "12px", padding: 0 }}
                    labelStyle={{ color: "var(--color-text-secondary)", marginBottom: "4px" }}
                    cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                />
                <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                />
                {/* Actual Cost - Critical/Laser Red if high, or just a distinct color */}
                <Line
                    name="Actual Cost"
                    type="monotone"
                    dataKey="actual"
                    stroke="#FB7185" /* Critical/Rose */
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#FB7185", strokeWidth: 0 }}
                />
                {/* Planned Cost - Neutral/Blue */}
                <Line
                    name="Planned Cost"
                    type="monotone"
                    dataKey="planned"
                    stroke="#818CF8" /* Indigo */
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                />
                {/* Variance - Dynamic color based on value is hard in simple Recharts without custom dot, so we stick to Accent/Teal for "Variance" as a tracked metric */}
                <Line
                    name="Variance Gap"
                    type="monotone"
                    dataKey="variance"
                    stroke="#2DD4BF" /* Accent/Teal */
                    strokeWidth={2}
                    dot={false}
                    strokeOpacity={0.6}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

// ─── Stockout Radar ───────────────────────────────────────────────────────────

const RADAR_DATA = [
    { subject: 'Lead Time', A: 120, fullMark: 150 },
    { subject: 'Demand', A: 98, fullMark: 150 },
    { subject: 'Stock', A: 86, fullMark: 150 },
    { subject: 'Reliability', A: 99, fullMark: 150 },
    { subject: 'Cost', A: 85, fullMark: 150 },
    { subject: 'Quality', A: 65, fullMark: 150 },
];

export function TitanStockoutRadar() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--color-text-secondary)", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                    name="Risk Profile"
                    dataKey="A"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    fill="var(--color-accent)"
                    fillOpacity={0.2}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        borderRadius: "8px",
                    }}
                    itemStyle={{ color: "white", fontSize: "11px" }}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
