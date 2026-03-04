import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatchRunResult } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import {
    Zap,
    Download,
    Settings2,
    TrendingUp,
    ShieldCheck,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BatchMatrixProps {
    data: BatchRunResult[];
    loading?: boolean;
    progress?: number;
    onRun?: (n: number) => void;
    onDownload?: () => void;
}

export function AutoSimulationMatrix({ data, loading, progress, onRun, onDownload }: BatchMatrixProps) {
    return (
        <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-secondary/5 border-b border-border/30 p-6 flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground/80">
                            Auto-Simulation Matrix
                        </CardTitle>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                        Batch execution of N-1 scenarios for optimal strategy identification
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={onDownload}
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-9 border-border/50 bg-background/50"
                        disabled={data.length === 0}
                    >
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Export
                    </Button>
                    <Button
                        onClick={() => onRun?.(10)}
                        size="sm"
                        className="rounded-xl h-9 font-bold px-4 shadow-lg shadow-primary/10"
                        disabled={loading}
                    >
                        {loading ? "Running..." : "Run Batch (10)"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {loading && (
                    <div className="px-6 py-4 bg-primary/5 border-b border-primary/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Engine Progress</span>
                            <span className="text-[10px] font-bold text-primary">{Math.round(progress || 0)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-primary/10" />
                    </div>
                )}

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-secondary/10">
                            <TableRow className="border-border/30">
                                <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest">Subject</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Optimal Path</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Profit Delta</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Stability</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Risk Index</TableHead>
                                <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-widest">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground/50 italic text-xs">
                                        No batch data available. Trigger a run to begin analysis.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((result) => (
                                    <TableRow key={result.employee_id} className="border-border/20 group hover:bg-secondary/10 transition-colors">
                                        <TableCell className="font-bold text-xs pl-6 py-4">{result.employee_id}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider border border-primary/20">
                                                {result.bestStrategy.replace('_', ' ')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-bold text-green-500">
                                            +${result.profitDelta.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold">{result.stability}%</TableCell>
                                        <TableCell>
                                            <div className={cn(
                                                "h-1.5 w-12 rounded-full",
                                                result.risk > 0.6 ? "bg-red-500" : (result.risk > 0.3 ? "bg-yellow-500" : "bg-green-500")
                                            )} />
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary hover:text-primary-foreground">
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
