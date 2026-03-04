import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: "up" | "down" | "neutral";
    description?: string;
    className?: string;
}

export function MetricCard({
    label,
    value,
    icon: Icon,
    trend,
    description,
    className
}: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-md",
                className
            )}
        >
            <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                {Icon && (
                    <div className="rounded-lg bg-secondary/50 p-1.5 transition-colors group-hover:bg-primary/10">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                )}
            </div>

            <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold tabular-nums tracking-tight text-foreground">
                    {typeof value === "number" && !label.toLowerCase().includes("factor") ? value.toLocaleString() : value}
                </h3>
                {trend && (
                    <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        trend === "up" ? "bg-green-500/10 text-green-600" :
                            trend === "down" ? "bg-red-500/10 text-red-600" :
                                "bg-blue-500/10 text-blue-600"
                    )}>
                        {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                    </span>
                )}
            </div>

            {description && (
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{description}</p>
            )}

            {/* Decorative background element */}
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] transition-opacity group-hover:opacity-[0.07]">
                {Icon && <Icon className="h-12 w-12" />}
            </div>
        </motion.div>
    );
}

interface KPIGridProps {
    metrics: {
        label: string;
        value: string | number;
        icon?: LucideIcon;
        trend?: "up" | "down" | "neutral";
        description?: string;
    }[];
    title: string;
}

export function KPIGrid({ metrics, title }: KPIGridProps) {
    return (
        <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 px-1">{title}</h4>
            <div className="grid grid-cols-2 gap-3">
                {metrics.map((m, i) => (
                    <MetricCard key={`${title}-${m.label}-${i}`} {...m} />
                ))}
            </div>
        </div>
    );
}
