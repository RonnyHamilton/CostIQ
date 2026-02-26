"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    PieChart,
    LayoutDashboard,
    Package,
    FileText,
    Bell,
    Search,
    LogOut,
    User,
} from "lucide-react";
import { signout } from "@/app/login/actions"; // Import the signout action
import { motion } from "framer-motion";
import { SearchPalette } from "./SearchPalette";
import { NotificationsPanel } from "./NotificationsPanel";

import { User as SupabaseUser } from "@supabase/supabase-js";

// ... imports remain the same

const navItems = [
    { href: "/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/planning", label: "Planning", icon: FileText },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/reports", label: "Reports", icon: PieChart },
];

interface FloatingTopNavProps {
    user: SupabaseUser;
}

export function FloatingTopNav({ user }: FloatingTopNavProps) {
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifCount, setNotifCount] = useState(0);
    const [profileOpen, setProfileOpen] = useState(false);

    const initials = user.email?.substring(0, 2).toUpperCase() || "US";
    const userEmail = user.email || "";

    // ── Global Ctrl+K shortcut ────────────────────────────────────────────────

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen((prev) => !prev);
                setNotifOpen(false);
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4"
            >
                <div className="flex items-center justify-between pl-6 pr-2 py-2 rounded-full bg-surface/50 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/20">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mr-8">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/30" style={{ boxShadow: '0 0 20px -4px rgba(45,212,191,0.4), 0 4px 12px -2px rgba(45,212,191,0.2)' }}>
                            <span className="font-bold text-black text-xs">IQ</span>
                        </div>
                        <span className="font-bold text-white tracking-tight hidden sm:block text-glow">
                            CostIQ
                        </span>
                    </div>

                    {/* Navigation Pills */}
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                        isActive
                                            ? "text-white bg-white/10 shadow-inner"
                                            : "text-text-secondary hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            className="absolute inset-0 rounded-full bg-white/5"
                                            style={{ boxShadow: '0 0 20px rgba(255,255,255,0.08), inset 0 0 12px rgba(255,255,255,0.04)' }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 ml-8">
                        {/* Search Button */}
                        <button
                            onClick={() => {
                                setSearchOpen(true);
                                setNotifOpen(false);
                            }}
                            className="p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            title="Search (Ctrl+K)"
                        >
                            <Search className="w-4 h-4" />
                        </button>

                        {/* Notifications Button */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setNotifOpen((prev) => !prev);
                                    setSearchOpen(false);
                                }}
                                className="p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-colors relative cursor-pointer"
                                title="Notifications"
                            >
                                <Bell className="w-4 h-4" />
                                {notifCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-critical text-[8px] font-bold text-white shadow-[0_0_8px_var(--color-critical)] px-0.5">
                                        {notifCount > 9 ? "9+" : notifCount}
                                    </span>
                                )}
                            </button>
                            <NotificationsPanel
                                isOpen={notifOpen}
                                onClose={() => setNotifOpen(false)}
                                onCountChange={setNotifCount}
                            />
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-1" />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setProfileOpen(!profileOpen);
                                    setSearchOpen(false);
                                    setNotifOpen(false);
                                }}
                                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-white/10 bg-white/5 hover:border-accent/50 transition-colors cursor-pointer group"
                            >
                                <span className="text-xs font-medium text-text-secondary group-hover:text-white transition-colors max-w-[100px] truncate">{userEmail}</span>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-purple-500/20">
                                    {initials}
                                </div>
                            </button>

                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#18181B] border border-white/10 shadow-2xl p-1 z-50 overflow-hidden"
                                >
                                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                                        <p className="text-xs font-medium text-white truncate">{userEmail}</p>
                                        <p className="text-[10px] text-text-secondary truncate">Authenticated User</p>
                                    </div>
                                    <button
                                        onClick={() => { }}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        Profile Settings
                                    </button>
                                    <button
                                        onClick={() => signout()}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-critical hover:bg-critical/10 transition-colors text-left"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Search Palette (rendered outside the nav for proper overlay) */}
            <SearchPalette
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </>
    );
}
