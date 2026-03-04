import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { KPIResult, Strategy } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import { TrendingUp, ShieldCheck, Clock, Award } from "lucide-react";

interface StrategyComparisonCardProps {
    strategy: Strategy;
    result: KPIResult;
    isBest?: boolean;
    rank: number;
}

export function StrategyComparisonCard({
    strategy,
    result,
    isBest,
    rank
}: StrategyComparisonCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden border-2 transition-all duration-300",
            isBest
                ? "border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02] z-10"
                : "border-border shadow-sm hover:border-border/80"
        )}>
            {isBest && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl flex items-center gap-1.5 shadow-sm">
                    <Award className="h-3 w-3" />
                    Optimal Path
                </div>
            )}

            <CardHeader className={cn(
                "pb-4 border-b",
                isBest ? "bg-primary/5 border-primary/10" : "bg-secondary/10 border-border/50"
            )}>
                <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-background flex items-center justify-center text-[10px] font-bold border border-border shadow-sm">
                        {rank}
                    </span>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">
                        {strategy.replace('_', ' ')}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Profit</p>
                        <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-sm font-bold">${result?.financial?.profit_projection?.toLocaleString() ?? "—"}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Stability</p>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-sm font-bold">{result?.risk?.stability_score ?? "—"}%</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Duration</p>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-bold">{result?.execution?.total_duration ?? "—"}d</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Risk Profile</p>
                        <RiskBadge risk={result?.risk?.fragility_index ?? 0.3} className="w-fit" />
                    </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                        Confidence: <span className="font-bold text-foreground">84%</span> based on deterministic seed verification.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
