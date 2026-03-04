import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusFactorEntry } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import {
    ShieldAlert,
    Target,
    TrendingDown,
    Play,
    ChevronRight,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusFactorProps {
    data: BusFactorEntry[];
    onSimulate?: (id: string) => void;
}

export function BusFactorView({ data, onSimulate }: BusFactorProps) {
    return (
        <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-secondary/5 border-b border-border/30 pb-4">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground/80">
                        Bus Factor Ranking
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                    {data.map((emp, idx) => {
                        const isTop3 = idx < 3;
                        return (
                            <div
                                key={emp.id}
                                className={cn(
                                    "group flex items-center justify-between p-4 transition-all duration-300 hover:bg-secondary/10",
                                    isTop3 && "bg-primary/[0.02]"
                                )}
                            >
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className={cn(
                                        "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-all",
                                        isTop3
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0"
                                            : "bg-secondary text-muted-foreground border-border/50"
                                    )}>
                                        {idx + 1}
                                    </div>

                                    <div className="min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm truncate">{emp.name}</p>
                                            <span className="px-1.5 py-px rounded-md bg-secondary text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-border/30">
                                                {emp.dept}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-tight italic">
                                            {emp.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 ml-6">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Impact</p>
                                        <p className="text-sm font-bold text-red-500">${emp.revenueImpact.toLocaleString()}</p>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Risk Score</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden border border-border/30">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        emp.compositeScore > 0.6 ? "bg-red-500" : (emp.compositeScore > 0.3 ? "bg-yellow-500" : "bg-green-500")
                                                    )}
                                                    style={{ width: `${emp.compositeScore * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black tabular-nums">{emp.compositeScore.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => onSimulate?.(emp.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all group-hover:translate-x-1"
                                    >
                                        <Play className="h-4 w-4 fill-current" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
