import React from "react";
import { HistoryRecord } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import {
    History,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Clock
} from "lucide-react";
import { format } from "date-fns";

interface TimelineProps {
    data: HistoryRecord[];
    activeId?: string;
    onSelect: (record: HistoryRecord) => void;
}

export function DecisionTimeline({ data, activeId, onSelect }: TimelineProps) {
    return (
        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border/50 before:to-transparent">
            {data.map((record) => {
                const isActive = activeId === record.id;
                const isCritical = record.fragility_score > 0.6;
                const isHighProfit = record.profit_delta > 30000;

                return (
                    <div
                        key={record.id}
                        onClick={() => onSelect(record)}
                        className={cn(
                            "group relative cursor-pointer transition-all duration-300",
                            isActive ? "scale-[1.02]" : "hover:translate-x-1"
                        )}
                    >
                        {/* Timeline Node */}
                        <div className={cn(
                            "absolute -left-[26px] top-1.5 h-4 w-4 rounded-full border-2 bg-background z-10 transition-all shadow-sm",
                            isActive ? "border-primary scale-125 shadow-primary/20" : "border-border group-hover:border-primary/50"
                        )} />

                        <div className={cn(
                            "p-5 rounded-3xl border transition-all duration-300",
                            isActive
                                ? "bg-card border-primary shadow-xl shadow-primary/5"
                                : "bg-card/50 border-border/40 hover:bg-card hover:border-border/60"
                        )}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" />
                                            {format(new Date(record.timestamp), "MMM d, HH:mm")}
                                        </span>
                                        <span className="px-1.5 py-px rounded bg-secondary text-[8px] font-bold uppercase tracking-widest border border-border/50">
                                            {record.model_version}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-base group-hover:text-primary transition-colors">{record.employee_name}</h3>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Best Path</p>
                                        <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            {record.best_strategy}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/30">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Profit Delta</p>
                                    <p className={cn(
                                        "text-sm font-black tabular-nums flex items-center gap-1",
                                        record.profit_delta > 0 ? "text-green-500" : "text-red-500"
                                    )}>
                                        {record.profit_delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        ${Math.abs(record.profit_delta).toLocaleString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Stability</p>
                                    <p className="text-sm font-black tabular-nums">{(record.stability_score * 100).toFixed(0)}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Fragility</p>
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            isCritical ? "bg-red-500" : "bg-green-500"
                                        )} />
                                        <p className="text-sm font-black tabular-nums">{record.fragility_score.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
