"use client"

import {
    ShieldCheck,
    Clock,
    User
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
    return (
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur shrink-0 flex items-center justify-between px-8 z-10">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">Digital Twin</span>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-sm font-medium text-foreground">v3.0 (Deterministic)</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/50">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-medium tabular-nums">Feb 28, 18:30 UTC</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="h-8 w-px bg-border mx-1" />
                <div className="flex items-center gap-3 pl-2">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold leading-none">Executive User</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-semibold">Admin Access</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </header>
    );
}
