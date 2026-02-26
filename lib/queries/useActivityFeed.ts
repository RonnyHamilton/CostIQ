import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface RawOrder {
    id: string;
    status: string;
    created_at: string;
    description: string;
    order_number: string;
}

// Define a local fetcher since we can't import the server action directly for client-side query
async function fetchOrders() {
    const { data, error } = await supabase
        .from("orders")
        .select("id, status, created_at, description, order_number")
        .order("created_at", { ascending: false })
        .limit(10);

    if (error) throw new Error(error.message);
    return data as RawOrder[];
}

export interface ActivityItem {
    id: string;
    type: "order" | "inventory" | "production";
    action: string;
    description: string;
    timestamp: string;
    status: "success" | "warning" | "error" | "info";
    user?: string;
    value?: string;
}

export function useActivityFeed() {
    return useQuery({
        queryKey: ["activity-feed"],
        queryFn: async (): Promise<ActivityItem[]> => {
            const orders = await fetchOrders();

            // Transform orders into activity items
            const orderActivities: ActivityItem[] = orders.map((order) => ({
                id: `order-${order.id}`,
                type: "order",
                action: `Order ${order.status}`,
                description: `${order.order_number} - ${order.description}`,
                timestamp: order.created_at,
                status: order.status === "completed" ? "success" : order.status === "pending" ? "info" : "warning",
                value: "Order",
            }));

            // Mock some "Inventory" and "Production" events to populate the feed visually
            // for the "Nexus Vibe" demo since strict backend logging might not be fully implemented for every action
            // This ensures the UI looks rich.
            const mockEvents: ActivityItem[] = [
                {
                    id: "evt-1",
                    type: "production",
                    action: "Shift Output Logged",
                    description: "Line A - Style ST-2024",
                    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
                    status: "success",
                    value: "150 pcs"
                },
                {
                    id: "evt-2",
                    type: "inventory",
                    action: "Low Stock Alert",
                    description: "Denim Fabric - Roll #45",
                    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
                    status: "warning",
                    value: "12 m"
                },
                {
                    id: "evt-3",
                    type: "production",
                    action: "QC Rejection",
                    description: "Stitching Defect detected",
                    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
                    status: "error",
                    value: "5 pcs"
                }
            ];

            const allActivities = [...orderActivities, ...mockEvents].sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            return allActivities;
        }
    });
}
