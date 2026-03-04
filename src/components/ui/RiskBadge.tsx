import { cn } from "@/lib/utils";

interface RiskBadgeProps {
    risk: number;
    className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
    const getRiskDetails = (val: number) => {
        if (val < 0.3) return { label: "Low Risk", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" };
        if (val < 0.6) return { label: "Medium Risk", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" };
        return { label: "High Risk", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" };
    };

    const { label, color } = getRiskDetails(risk);

    return (
        <div className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            color,
            className
        )}>
            {label}
        </div>
    );
}
