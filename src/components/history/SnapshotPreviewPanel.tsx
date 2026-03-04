import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryRecord, useSimulationStore } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import {
    FileText,
    RotateCcw,
    Download,
    ExternalLink,
    ShieldCheck,
    TrendingUp,
    Fingerprint,
    Cpu,
    Zap,
    Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PreviewProps {
    record: HistoryRecord | null;
    onClose?: () => void;
}

export function SnapshotPreviewPanel({ record }: PreviewProps) {
    const { replayHistory } = useSimulationStore();
    const navigate = useNavigate();

    if (!record) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-50">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                    <Fingerprint className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest">No Selection</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                        Select a record from the timeline to view the board-ready decision snapshot.
                    </p>
                </div>
            </div>
        );
    }

    const handleReplay = () => {
        replayHistory(record.id);
        navigate("/dashboard");
        toast.success(`Replaying simulation for ${record.employee_name}`);
    };

    return (
        <Card className="h-full border-none shadow-none bg-transparent overflow-y-auto no-scrollbar">
            <CardHeader className="px-0 pt-0 pb-6 border-b border-border/40 mb-8 sticky top-0 bg-background/50 backdrop-blur-md z-20">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Compliance Verified</span>
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-[8px] font-black uppercase tracking-widest text-muted-foreground">ID: {record.id.slice(0, 8)}</span>
                </div>
                <CardTitle className="text-2xl font-black">{record.employee_name}</CardTitle>
                <p className="text-xs text-muted-foreground font-medium italic">Decision Date: {new Date(record.timestamp).toLocaleString()}</p>

                <div className="flex items-center gap-2 mt-6">
                    <Button onClick={handleReplay} size="sm" className="flex-1 rounded-xl h-9 font-bold">
                        <RotateCcw className="h-3.5 w-3.5 mr-2" />
                        Replay
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl h-9 font-bold border-border/60">
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Report
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary">
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-0 space-y-10 pb-20">
                {/* Core Metrics */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        <Zap className="h-3 w-3" /> Governance Snapshot
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-border/40 bg-secondary/10">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Optimal Path</p>
                            <p className="text-sm font-black text-primary uppercase">{record.best_strategy}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-border/40 bg-secondary/10">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Financial Delta</p>
                            <p className="text-sm font-black text-green-500 tabular-nums">+${record.profit_delta.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-border/40 bg-secondary/10">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Stability</p>
                            <p className="text-sm font-black tabular-nums">{(record.stability_score * 100).toFixed(0)}%</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-border/40 bg-secondary/10">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Model State</p>
                            <p className="text-sm font-black uppercase font-mono">{record.model_version}</p>
                        </div>
                    </div>
                </section>

                {/* AI Interpretation */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        <Cpu className="h-3 w-3" /> AI Executive Reasoning
                    </h4>
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                        <Quote className="absolute -right-4 -top-4 h-24 w-24 text-primary opacity-[0.03]" />
                        <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                            "{record.llm_summary.recommendation}"
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Confidence</span>
                                <span className="text-xs font-black text-primary">{(record.llm_summary.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Engine Latency</span>
                                <span className="text-xs font-bold font-mono">{record.llm_summary.latency_ms}ms</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Verification Footer */}
                <div className="pt-6 border-t border-border/40 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Audit Consistency</p>
                        <p className="text-xs font-bold">Deterministic Results Verified</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
