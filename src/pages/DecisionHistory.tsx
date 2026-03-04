// Page: DecisionHistory - Persistent records and audit trails
import React, { useState, useMemo, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useSimulationStore, HistoryRecord, Strategy } from "@/store/simulationStore";
import { DecisionFilters } from "@/components/history/DecisionFilters";
import { DecisionTimeline } from "@/components/history/DecisionTimeline";
import { DecisionTable } from "@/components/history/DecisionTable";
import { SnapshotPreviewPanel } from "@/components/history/SnapshotPreviewPanel";
import {
    Fingerprint,
    LayoutList,
    Clock,
    Download,
    ChevronRight,
    ShieldCheck,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import historySeeds from "@/data/simulation_history.json";

export default function DecisionHistory() {
    const {
        persistentHistory,
        addPersistentRecord,
        activeSnapshot,
        setActiveSnapshot
    } = useSimulationStore();

    const [view, setView] = useState<"timeline" | "table">("timeline");
    const [searchTerm, setSearchTerm] = useState("");
    const [strategyFilter, setStrategyFilter] = useState<Strategy | "all">("all");
    const [riskFilter, setRiskFilter] = useState("all");

    // Load seeds if empty
    useEffect(() => {
        if (persistentHistory.length === 0) {
            historySeeds.forEach(record => {
                addPersistentRecord(record as HistoryRecord);
            });
        }
    }, [addPersistentRecord, persistentHistory.length]);

    const filteredHistory = useMemo(() => {
        return persistentHistory.filter(record => {
            const matchSearch = record.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStrategy = strategyFilter === "all" || record.best_strategy === strategyFilter;
            const matchRisk = riskFilter === "all" || (
                riskFilter === "high" ? record.fragility_score >= 0.6 :
                    riskFilter === "medium" ? (record.fragility_score >= 0.3 && record.fragility_score < 0.6) :
                        record.fragility_score < 0.3
            );
            return matchSearch && matchStrategy && matchRisk;
        });
    }, [persistentHistory, searchTerm, strategyFilter, riskFilter]);

    return (
        <Shell>
            <div className="flex h-full overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar border-r border-border/40 bg-background/50">
                    <div className="p-8 max-w-5xl mx-auto space-y-10">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-primary">
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <h1 className="text-3xl font-black tracking-tight uppercase">Governance Console</h1>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium max-w-lg">
                                    Auditable workforce decision history and board-ready simulation reporting layer.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 p-1 bg-secondary/20 rounded-2xl border border-border/40">
                                <Button
                                    variant={view === "timeline" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setView("timeline")}
                                    className={cn("rounded-xl h-9 px-4 font-bold shadow-none", view === "timeline" && "bg-background border-border/50")}
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Timeline
                                </Button>
                                <Button
                                    variant={view === "table" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setView("table")}
                                    className={cn("rounded-xl h-9 px-4 font-bold shadow-none", view === "table" && "bg-background border-border/50")}
                                >
                                    <LayoutList className="h-4 w-4 mr-2" />
                                    Table
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <DecisionFilters
                            onSearch={setSearchTerm}
                            onStrategyFilter={setStrategyFilter}
                            onRiskFilter={setRiskFilter}
                        />

                        {/* Results */}
                        <div className="pb-20">
                            {filteredHistory.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-border/40 rounded-3xl">
                                    <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <p className="text-sm font-bold text-muted-foreground">No historical records found for "{searchTerm}"</p>
                                </div>
                            ) : (
                                view === "timeline" ? (
                                    <DecisionTimeline
                                        data={filteredHistory}
                                        activeId={activeSnapshot?.id}
                                        onSelect={setActiveSnapshot}
                                    />
                                ) : (
                                    <DecisionTable
                                        data={filteredHistory}
                                        activeId={activeSnapshot?.id}
                                        onSelect={setActiveSnapshot}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Snapshot Preview */}
                <aside className="w-[450px] hidden xl:flex flex-col bg-background/30 backdrop-blur-xl border-l border-border/40 p-8 h-full">
                    <SnapshotPreviewPanel record={activeSnapshot} />
                </aside>
            </div>
        </Shell>
    );
}
