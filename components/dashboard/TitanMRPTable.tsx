"use client";


import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { ArrowRight } from "lucide-react";

// Mock Data for MRP Matrix
const MRP_ITEMS = [
    { id: "M-001", name: "Steel Sheet 4mm", status: "Critical", usage: 85, burn: "High", days: 2 },
    { id: "M-042", name: "Copper Wiring", status: "Warning", usage: 65, burn: "Med", days: 5 },
    { id: "C-109", name: "Control Unit v2", status: "Healthy", usage: 32, burn: "Low", days: 24 },
    { id: "P-882", name: "Rubber Gasket", status: "Healthy", usage: 12, burn: "Low", days: 45 },
    { id: "M-003", name: "Alum. Extrusion", status: "Warning", usage: 58, burn: "Med", days: 6 },
];

export function TitanMRPTable() {
    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-white/5 hover:bg-transparent">
                        <TableHead className="text-[10px] uppercase font-bold text-text-secondary h-8">Item</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-text-secondary h-8">Status</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-text-secondary h-8 text-right">Usage</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-text-secondary h-8 text-center">Runway</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-text-secondary h-8 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MRP_ITEMS.map((item) => (
                        <TableRow key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <TableCell className="py-2">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-white group-hover:text-accent transition-colors">{item.name}</span>
                                    <span className="text-[10px] text-text-muted">{item.id}</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-2">
                                <div className="flex items-center gap-1.5">
                                    {item.status === "Critical" && <div className="w-1.5 h-1.5 rounded-full bg-critical animate-pulse" />}
                                    {item.status === "Warning" && <div className="w-1.5 h-1.5 rounded-full bg-warning" />}
                                    {item.status === "Healthy" && <div className="w-1.5 h-1.5 rounded-full bg-safe" />}
                                    <span className={cn(
                                        "text-xs font-medium",
                                        item.status === "Critical" ? "text-critical" :
                                            item.status === "Warning" ? "text-warning" : "text-safe"
                                    )}>
                                        {item.status}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="py-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-16 h-1 bg-surface-raised rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full", item.usage > 70 ? "bg-critical" : "bg-accent")}
                                            style={{ width: `${item.usage}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-text-secondary">{item.usage}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-2 text-center">
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold border",
                                    item.days < 3 ? "bg-critical/10 text-critical border-critical/20" :
                                        item.days < 7 ? "bg-warning/10 text-warning border-warning/20" :
                                            "bg-safe/10 text-safe border-safe/20"
                                )}>
                                    {item.days} Days
                                </span>
                            </TableCell>
                            <TableCell className="py-2 text-right">
                                <button className="p-1.5 rounded hover:bg-white/10 text-text-secondary hover:text-white transition-colors">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
