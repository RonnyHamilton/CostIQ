"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { name: "Overview", href: "/overview", icon: LayoutDashboard },
    { name: "Orders", href: "/planning", icon: ShoppingCart },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed left-0 top-0 z-40 h-screen w-20 flex flex-col items-center border-r border-white/5 bg-bg/50 backdrop-blur-xl py-8"
        >
            {/* Logo */}
            <div className="mb-10 text-glow-safe">
                <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_var(--color-accent)]">
                    <Zap className="h-6 w-6 text-bg fill-current" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-6 w-full px-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-white/10 text-accent shadow-[0_0_15px_-5px_rgba(255,255,255,0.2)]"
                                    : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                            )}
                            title={item.name}
                        >
                            <Icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", isActive && "stroke-[2.5px]")} />
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute -right-1 h-2 w-2 rounded-full bg-accent blur-[2px]"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Status (Floating) */}
            <div className="mt-auto px-4 w-full flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-safe to-accent animate-pulse blur-xl absolute bottom-8 opacity-20" />
                <div className="h-8 w-8 rounded-full border border-white/10 bg-surface-raised flex items-center justify-center hover:scale-110 transition-transform cursor-pointer" title="Status: Online">
                    <div className="h-2 w-2 rounded-full bg-safe shadow-[0_0_8px_var(--color-safe)]" />
                </div>
            </div>
        </motion.aside>
    );
}
