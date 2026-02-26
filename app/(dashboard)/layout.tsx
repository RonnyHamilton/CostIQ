import { createClient } from "@/utils/supabase/server";
import { FloatingTopNav } from "@/components/layout/TopNav";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/30 selection:text-accent">
            <FloatingTopNav user={user} />
            <div className="pt-24 pb-8 px-8 max-w-[1600px] mx-auto">
                <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </main>
            </div>
        </div>
    );
}
