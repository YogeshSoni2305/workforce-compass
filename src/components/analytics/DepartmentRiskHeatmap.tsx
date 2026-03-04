import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DeptRisk } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import {
    Users,
    AlertTriangle,
    TrendingDown,
    ChevronRight,
    Info
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapProps {
    data: DeptRisk[];
    onDeptClick?: (dept: string) => void;
}

export function DepartmentRiskHeatmap({ data, onDeptClick }: HeatmapProps) {
    const getRiskColor = (fragility: number) => {
        if (fragility < 0.3) return "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400";
        if (fragility < 0.6) return "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400";
        return "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400";
    };

    const getIntensityColor = (fragility: number) => {
        if (fragility < 0.3) return "bg-green-500";
        if (fragility < 0.6) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {data.map((dept) => (
                <TooltipProvider key={dept.name} delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card
                                onClick={() => onDeptClick?.(dept.name)}
                                className={cn(
                                    "relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2",
                                    getRiskColor(dept.avgFragility)
                                )}
                            >
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold uppercase tracking-wider truncate max-w-[80%]">{dept.name}</h3>
                                        <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", getIntensityColor(dept.avgFragility))} />
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-2xl font-black tabular-nums">{(dept.avgFragility * 100).toFixed(0)}%</p>
                                        <p className="text-[10px] font-bold uppercase opacity-70 tracking-tighter">Avg Fragility</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-current/10">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3 opacity-60" />
                                            <span className="text-[10px] font-bold">{dept.employeeCount}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3 opacity-60" />
                                            <span className="text-[10px] font-bold text-red-500">{dept.criticalCount}</span>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Background Decor */}
                                <div className="absolute -right-4 -bottom-4 opacity-5">
                                    <TrendingDown className="h-16 w-16" />
                                </div>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="w-64 p-0 border-none bg-transparent shadow-none" sideOffset={8}>
                            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="bg-secondary/30 p-4 border-b border-border">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Exposure Deep Dive</p>
                                    <p className="text-xs font-bold">{dept.name} Intelligence</p>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Highest Risk Nodes</p>
                                        <div className="space-y-1.5">
                                            {dept.topFragileEmployees.map((emp, i) => (
                                                <div key={i} className="flex items-center justify-between bg-secondary/20 px-2 py-1 rounded-lg">
                                                    <span className="text-[10px] font-medium truncate max-w-[120px]">{emp}</span>
                                                    <ChevronRight className="h-2 w-2 text-muted-foreground" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingDown className="h-3 w-3 text-red-500" />
                                            <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Rev Exposure</span>
                                        </div>
                                        <span className="text-xs font-bold text-red-500">${dept.totalRevenueExposure.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
}
