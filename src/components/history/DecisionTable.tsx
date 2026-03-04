import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { HistoryRecord } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TableProps {
    data: HistoryRecord[];
    activeId?: string;
    onSelect: (record: HistoryRecord) => void;
}

export function DecisionTable({ data, activeId, onSelect }: TableProps) {
    return (
        <div className="rounded-3xl border border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm">
            <Table>
                <TableHeader className="bg-secondary/10">
                    <TableRow className="border-border/30">
                        <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest">Timestamp</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Employee</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Best Strategy</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Profit Delta</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Stability</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Fragility</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Model</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((record) => {
                        const isActive = activeId === record.id;
                        const isCritical = record.fragility_score > 0.6;
                        return (
                            <TableRow
                                key={record.id}
                                onClick={() => onSelect(record)}
                                className={cn(
                                    "cursor-pointer border-border/20 transition-colors",
                                    isActive ? "bg-primary/5" : "hover:bg-secondary/10"
                                )}
                            >
                                <TableCell className="pl-6 py-4 text-xs font-medium text-muted-foreground">
                                    {format(new Date(record.timestamp), "yyyy-MM-dd HH:mm")}
                                </TableCell>
                                <TableCell className="font-bold text-xs">{record.employee_name}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider border border-primary/20">
                                        {record.best_strategy}
                                    </span>
                                </TableCell>
                                <TableCell className={cn(
                                    "font-mono text-xs font-bold",
                                    record.profit_delta > 0 ? "text-green-500" : "text-red-500"
                                )}>
                                    {record.profit_delta > 0 ? "+" : ""}${record.profit_delta.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-xs font-semibold">{(record.stability_score * 100).toFixed(0)}%</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "h-1.5 w-8 rounded-full",
                                            isCritical ? "bg-red-500" : (record.fragility_score > 0.3 ? "bg-yellow-500" : "bg-green-500")
                                        )} />
                                        <span className="text-[10px] font-mono">{record.fragility_score.toFixed(2)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-[10px] font-bold text-muted-foreground uppercase">{record.model_version}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
