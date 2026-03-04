import React from "react";
import { CopilotMessage, Strategy } from "@/store/simulationStore";
import { cn } from "@/lib/utils";
import {
    Cpu,
    TrendingUp,
    TrendingDown,
    ShieldCheck,
    Zap,
    ArrowRight,
    Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MessageListProps {
    messages: CopilotMessage[];
}

export function CopilotMessageList({ messages }: MessageListProps) {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-10 no-scrollbar">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                        "flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500",
                        msg.role === "user" ? "items-end" : "items-start"
                    )}
                >
                    {msg.role === "user" ? (
                        <div className="bg-primary text-primary-foreground px-6 py-3 rounded-[2rem] rounded-tr-none shadow-xl max-w-[80%] text-sm font-semibold leading-relaxed">
                            {msg.content}
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-[90%] w-full">
                            {/* Narrative Response */}
                            <div className="flex gap-4 items-start">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <Cpu className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-4 pt-1">
                                    <p className="text-base font-medium leading-relaxed text-foreground/90">
                                        {msg.content}
                                    </p>

                                    {msg.structured && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <MetricsCard
                                                label="Combined Profit"
                                                value={`$${msg.structured.profitDelta?.toLocaleString()}`}
                                                trend={msg.structured.profitDelta! > 0 ? "up" : "down"}
                                            />
                                            <MetricsCard
                                                label="Stability Delta"
                                                value={`${msg.structured.stabilityDelta}%`}
                                                trend={msg.structured.stabilityDelta! > 0 ? "up" : "down"}
                                            />
                                            <MetricsCard
                                                label="Risk Index"
                                                value={msg.structured.riskDelta?.toFixed(2) || "0.00"}
                                                trend={msg.structured.riskDelta! > 0.6 ? "down" : "up"}
                                            />
                                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex flex-col justify-between">
                                                <span className="text-[10px] font-black uppercase text-primary/60">Confidence</span>
                                                <span className="text-lg font-black text-primary">{(msg.structured.confidence! * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    )}

                                    {msg.structured?.recommendedStrategy && (
                                        <div className="flex items-center gap-3 bg-secondary/20 border border-border/40 p-4 rounded-2xl">
                                            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex-1">
                                                Recommended Mitigation: <span className="text-foreground">{msg.structured.recommendedStrategy.replace('_', ' ')}</span>
                                            </p>
                                            <ArrowRight className="h-4 w-4 text-primary" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function MetricsCard({ label, value, trend }: { label: string, value: string, trend: "up" | "down" }) {
    return (
        <div className="bg-secondary/10 border border-border/40 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-muted-foreground/60">{label}</span>
            <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-black">{value}</span>
                {trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                )}
            </div>
        </div>
    );
}
