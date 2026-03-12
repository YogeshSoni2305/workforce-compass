"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Activity,
    LayoutDashboard,
    FlaskConical,
    PieChart,
    History,
    Settings,
    Zap,
    Layers,
    Wallet,
    GitMerge,
    BotMessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBackendStatus } from "@/hooks/use-backend-status";

interface NavItem {
    label: string;
    icon: React.ElementType;
    path: string;
    disabled?: boolean;
}

const items: NavItem[] = [
    { label: "Command Center", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Scenario Lab", icon: FlaskConical, path: "/scenario-lab" },
    { label: "Org Analytics", icon: PieChart, path: "/org-analytics" },
    { label: "Predictive AI", icon: Zap, path: "/predictive-intelligence" },
    { label: "Portfolio Sim", icon: Layers, path: "/portfolio-simulation" },
    { label: "Budget Strategy", icon: Wallet, path: "/budget-strategy" },
    { label: "M&A Modeling", icon: GitMerge, path: "/ma-modeling" },
    { label: "Decision History", icon: History, path: "/decision-history" },
    { label: "Strategic Copilot", icon: BotMessageSquare, path: "/copilot" },
    { label: "Settings", icon: Settings, path: "/settings", disabled: true },
];

export function Sidebar() {
    const pathname = usePathname();
    const backendStatus = useBackendStatus();

    const statusConfig = {
        connected: { dot: "bg-green-500", label: "Backend Connected", pulse: true },
        offline: { dot: "bg-red-500", label: "Backend Offline", pulse: false },
        checking: { dot: "bg-amber-400", label: "Checking...", pulse: true },
    };

    const { dot, label, pulse } = statusConfig[backendStatus];

    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
            <div className="p-6 flex items-center gap-3 border-b border-border">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold tracking-tight text-lg">Compass</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {items.map((item) => {
                    const isActive = pathname === item.path || (item.path === "/org-analytics" && pathname === "/analytics");
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-secondary text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                                item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn(
                                    "h-4 w-4 transition-colors",
                                    "group-hover:text-foreground"
                                )} />
                                <span>{item.label}</span>
                            </div>
                            {item.disabled && (
                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">Soon</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">API Status</p>
                    <div className="flex items-center gap-2 text-xs font-medium">
                        <div className={cn("h-2 w-2 rounded-full", dot, pulse && "animate-pulse")} />
                        <span>{label}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
