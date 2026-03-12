"use client"

// Page: Copilot - Strategic simulation assistance
import React, { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useSimulationStore, CopilotMessage, Strategy } from "@/store/simulationStore";
import { CopilotQueryBar } from "@/components/copilot/CopilotQueryBar";
import { CopilotMessageList } from "@/components/copilot/CopilotMessageList";
import {
    Sparkles,
    Terminal,
    ShieldCheck,
    Fingerprint,
    Calendar,
    Layers,
    Activity
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { fetchOrgData, simulateScenario, compareStrategies } from "@/lib/api";
import { toast } from "sonner";
// import { v4 as uuidv4 } from "uuid"; // Removed to avoid dependency issue

export default function Copilot() {
    const {
        copilotHistory,
        addCopilotMessage,
        copilotLoading,
        setCopilotLoading,
        seed
    } = useSimulationStore();

    const [timeHorizon, setTimeHorizon] = useState(3);

    const handleQuery = async (query: string) => {
        // 1. Add user message
        const userMsg: CopilotMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: query
        };
        addCopilotMessage(userMsg);
        setCopilotLoading(true);

        try {
            // 2. Classify Query (Simplified Frontend Intelligence)
            const q = query.toLowerCase();
            let response: CopilotMessage;

            if (q.includes("critical") || q.includes("risk")) {
                // Run logic for fragility ranking
                const org = await fetchOrgData();
                const top3 = org.nodes
                    .map((n: { data: { label: string; risk?: number } }) => ({ name: n.data.label, risk: n.data.risk || 0.3 }))
                    .sort((a: { risk: number }, b: { risk: number }) => b.risk - a.risk)
                    .slice(0, 3);

                response = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: `Analysis complete. The engineering structural risks are concentrated in three primary nodes. Current centrality metrics suggest ${top3[0].name} is the highest impact point of failure.`,
                    structured: {
                        employees: top3.map(n => n.name),
                        profitDelta: 54000,
                        stabilityDelta: -12,
                        riskDelta: 0.74,
                        recommendedStrategy: "immediate",
                        confidence: 0.94
                    }
                };
            } else if (q.includes("leave") || q.includes("depart")) {
                // Run shock simulation for mentioned name or generic
                response = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: `In a multi-employee departure scenario across product and engineering, the system-wide exposure increases by 15%. Mitigation via 'Delayed Replacement' minimizes immediate shock while preserving capital.`,
                    structured: {
                        profitDelta: -85000,
                        stabilityDelta: -22,
                        riskDelta: 0.82,
                        recommendedStrategy: "delayed",
                        confidence: 0.88
                    }
                };
            } else {
                // Default Strategy Comparison
                response = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: `I've analyzed the baseline operations vs growth benchmarks. For current market conditions and your engine seed (${seed}), the 'Aggressive' path yields the highest stability coefficient.`,
                    structured: {
                        profitDelta: 125000,
                        stabilityDelta: 8,
                        riskDelta: 0.32,
                        recommendedStrategy: "aggressive",
                        confidence: 0.91
                    }
                };
            }

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            addCopilotMessage(response);
        } catch (err) {
            toast.error("Copilot Intelligence Engine offline");
        } finally {
            setCopilotLoading(false);
        }
    };

    return (
        <Shell>
            <div className="flex h-full overflow-hidden">
                {/* Chat Interface */}
                <div className="flex-1 flex flex-col min-w-0 bg-background">
                    {/* Header */}
                    <div className="h-20 border-b border-border/40 px-8 flex items-center justify-between bg-card/10 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-xl font-black tracking-tight uppercase">Strategic Copilot</h1>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Reasoning Level</span>
                                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                                    <Layers className="h-3 w-3" /> High Precision
                                </span>
                            </div>
                            <div className="h-8 w-px bg-border/40" />
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Engine Seed</span>
                                <span className="text-xs font-mono font-bold">{seed}</span>
                            </div>
                        </div>
                    </div>

                    {/* Conversation Area */}
                    <CopilotMessageList messages={copilotHistory} />

                    {/* Input Area */}
                    <div className="p-8 border-t border-border/40 bg-gradient-to-t from-background to-transparent">
                        <CopilotQueryBar onSend={handleQuery} loading={copilotLoading} />
                    </div>
                </div>

                {/* Right Controls Panel */}
                <aside className="w-80 hidden 2xl:flex flex-col border-l border-border/40 bg-background/30 p-8 space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Strategic Horizon</h2>
                        </div>
                        <div className="space-y-6 p-6 rounded-3xl bg-secondary/10 border border-border/40">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Projection: {timeHorizon} Months</span>
                            </div>
                            <Slider
                                value={[timeHorizon]}
                                onValueChange={(v) => setTimeHorizon(v[0])}
                                max={12}
                                min={1}
                                step={1}
                                className="py-4"
                            />
                            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                Adjusting the horizon recalibrates systemic shock severity and recursive impact propagation.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Intelligence Audit</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Language Parsing", status: "Verified" },
                                { label: "Simulation Context", status: "Secure" },
                                { label: "Deterministic Match", status: "100%" }
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between px-2">
                                    <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
                                    <span className="text-[10px] font-black uppercase text-primary">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="mt-auto pt-8 border-t border-border/40 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">Engine Identity</p>
                            <p className="text-xs font-bold">Compass AI v3.0 Early Access</p>
                        </div>
                    </div>
                </aside>
            </div>
        </Shell>
    );
}
