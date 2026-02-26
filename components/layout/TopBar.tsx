"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/overview": {
        title: "Overview",
        subtitle: "Cost variance and inventory alerts",
    },
    "/planning": {
        title: "Production Planning",
        subtitle: "Manage orders and bill of materials",
    },
    "/consumption": {
        title: "Actual Consumption",
        subtitle: "Log and review actual material usage",
    },
    "/inventory": {
        title: "Inventory Control",
        subtitle: "Monitor stock levels and reorder needs",
    },
    "/reports": {
        title: "Reports",
        subtitle: "Order-wise variance summary",
    },
};

export function TopBar() {
    const pathname = usePathname();
    const page = pageTitles[pathname] ?? {
        title: "CostIQ",
        subtitle: "Production Intelligence",
    };

    return (
        <header
            className="fixed right-0 top-0 z-30 flex h-14 items-center px-6"
            style={{
                left: "224px",
                background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
                borderBottom: "1px solid var(--color-border)",
                backdropFilter: "blur(8px)",
            }}
        >
            <div>
                <h1
                    className="text-sm font-semibold leading-none"
                    style={{ color: "var(--color-text-primary)" }}
                >
                    {page.title}
                </h1>
                <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    {page.subtitle}
                </p>
            </div>
        </header>
    );
}
