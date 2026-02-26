import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "hero";
    padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
    className,
    children,
    variant = "default",
    padding = "lg",
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden transition-all duration-500",
                "rounded-[var(--radius-xl)] border border-white/5",
                "bg-white/5 backdrop-blur-xl", // Nexus Glass spec
                "hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.05)]", // Hover lift & glow
                variant === "hero" && "bg-gradient-to-br from-white/10 to-white/5 shadow-[0_0_50px_-20px_var(--color-accent-subtle)] ring-1 ring-white/10",
                padding === "none" && "p-0",
                padding === "sm" && "p-4",
                padding === "md" && "p-6",
                padding === "lg" && "p-8",
                className
            )}
            {...props}
        >
            {/* Top-edge highlight for 3D effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("mb-6 flex flex-col gap-1.5", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn("text-base font-semibold leading-none tracking-tight text-text-primary", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn("text-sm text-text-muted", className)} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("", className)} {...props}>
            {children}
        </div>
    );
}
