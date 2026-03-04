import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ComparisonResult, Strategy } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import { TrendingUp, ShieldCheck, Clock, Layers } from "lucide-react";

interface ComparisonTableProps {
    data: ComparisonResult;
}

export function ComparisonMatrixTable({ data }: ComparisonTableProps) {
    const strategies = Object.entries(data?.strategies ?? {});

    return (
        <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
            <Table>
                <TableHeader className="bg-secondary/20">
                    <TableRow>
                        <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest py-4">Strategy</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><TrendingUp className="h-3 w-3" /> Profit</div>
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Stability</div>
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Duration</div>
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><Layers className="h-3 w-3" /> Bus Factor</div>
                        </TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest pr-6">Efficiency Rank</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {strategies.map(([name, kpis], idx) => {
                        const isBest = name === data.best_strategy;
                        return (
                            <TableRow
                                key={name}
                                className={cn(
                                    "group transition-colors",
                                    isBest ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-secondary/40"
                                )}
                            >
                                <TableCell className="font-bold py-4">
                                    <div className="flex items-center gap-3">
                                        {isBest && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                                        <span className={cn(isBest ? "text-primary" : "text-foreground")}>
                                            {name.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">${kpis.financial.profit_projection.toLocaleString()}</TableCell>
                                <TableCell className="text-sm font-medium">{kpis.risk.stability_score}%</TableCell>
                                <TableCell className="text-sm font-medium">{kpis.execution.total_duration} days</TableCell>
                                <TableCell className="text-sm font-medium">{kpis.risk.bus_factor_impact}</TableCell>
                                <TableCell className="text-right pr-6">
                                    <span className={cn(
                                        "inline-flex items-center justify-center h-6 w-6 rounded-lg text-[10px] font-bold border",
                                        isBest ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 border-border"
                                    )}>
                                        {idx + 1}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
