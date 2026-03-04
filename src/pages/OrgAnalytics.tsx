// Page: OrgAnalytics - Organization-level structural intelligence
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Shell } from "@/components/layout/Shell";
import {
    useSimulationStore,
    DeptRisk,
    BusFactorEntry,
    BatchRunResult,
    Strategy
} from "@/store/simulationStore";

interface OrgNodeData {
    id: string;
    data: {
        label: string;
        department: string;
        role: string;
        risk: number;
        centrality: number;
        revenue_impact?: number;
    };
}

import { fetchOrgData, simulateScenario, compareStrategies } from "@/lib/api";
import { DepartmentRiskHeatmap } from "@/components/analytics/DepartmentRiskHeatmap";
import { BusFactorView } from "@/components/analytics/BusFactorView";
import { RevenueExposureMap } from "@/components/analytics/RevenueExposureMap";
import { AutoSimulationMatrix } from "@/components/analytics/AutoSimulationMatrix";
import {
    ShieldCheck,
    AlertCircle,
    RefreshCcw,
    Terminal,
    Search,
    CloudLightning,
    Activity,
    TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrgAnalytics() {
    const {
        departmentRiskData,
        busFactorRanking,
        revenueExposureData,
        batchSimulationResults,
        analyticsLoading,
        setAnalyticsData,
        setAnalyticsLoading,
        setConfig,
        seed
    } = useSimulationStore();

    const [filterDept, setFilterDept] = useState<string | null>(null);
    const [batchProgress, setBatchProgress] = useState(0);

    const loadBaseData = useCallback(async () => {
        setAnalyticsLoading("heatmap", true);
        setAnalyticsLoading("busFactor", true);
        try {
            const org = await fetchOrgData();
            const nodes: OrgNodeData[] = org.nodes;

            // 1. Process Departments
            const depts: Record<string, DeptRisk> = {};
            nodes.forEach((node: OrgNodeData) => {
                const dept = node.data.department || "Unassigned";
                if (!depts[dept]) {
                    depts[dept] = {
                        name: dept,
                        avgFragility: 0,
                        maxFragility: 0,
                        employeeCount: 0,
                        criticalCount: 0,
                        totalRevenueExposure: 0,
                        topFragileEmployees: []
                    };
                }
                const fragility = node.data.risk || 0.3;
                depts[dept].employeeCount++;
                depts[dept].avgFragility += fragility;
                depts[dept].maxFragility = Math.max(depts[dept].maxFragility, fragility);
                if (fragility > 0.6) depts[dept].criticalCount++;

                // Track top 3 per dept
                if (depts[dept].topFragileEmployees.length < 3) {
                    depts[dept].topFragileEmployees.push(node.data.label || node.id);
                }
            });

            Object.values(depts).forEach(d => {
                d.avgFragility /= d.employeeCount;
                // Mock revenue exposure for now until simulated
                d.totalRevenueExposure = d.criticalCount * 150000;
            });

            // 2. Process Bus Factor
            const ranking: BusFactorEntry[] = nodes
                .map((node: OrgNodeData) => {
                    const fragility = node.data.risk || 0.3;
                    const centrality = node.data.centrality || 0.5;
                    const revenueImpact = node.data.revenue_impact || 50000; // Assuming a default if not present

                    return {
                        id: node.id,
                        name: node.data.label,
                        dept: node.data.department,
                        role: node.data.role,
                        fragility: fragility,
                        centrality: centrality,
                        revenueImpact: revenueImpact,
                        compositeScore: (fragility * 0.4) + (centrality * 0.6) // Original composite score logic
                    };
                })
                .sort((a: BusFactorEntry, b: BusFactorEntry) => b.compositeScore - a.compositeScore)
                .slice(0, 10);

            setAnalyticsData({
                departmentRiskData: Object.values(depts),
                busFactorRanking: ranking
            });
        } catch (err) {
            toast.error("Failed to load organizational intelligence data");
        } finally {
            setAnalyticsLoading("heatmap", false);
            setAnalyticsLoading("busFactor", false);
        }
    }, [setAnalyticsData, setAnalyticsLoading]);

    useEffect(() => {
        loadBaseData();
    }, [loadBaseData]);

    // Filtered lists
    const filteredBusFactor = useMemo(() => {
        if (!filterDept) return busFactorRanking;
        return busFactorRanking.filter(e => e.dept === filterDept);
    }, [busFactorRanking, filterDept]);

    const runExposureAnalysis = async () => {
        setAnalyticsLoading("revenue", true);
        try {
            // Simulate top 8 from Bus Factor for Revenue Exposure Map
            const exposure: Array<{ name: string; loss: number; dept: string }> = [];
            const targets = busFactorRanking.slice(0, 8);

            for (const target of targets) {
                const res = await simulateScenario({
                    employee_id: target.id,
                    strategy: "no_replace",
                    seed,
                    shock_test: false
                });
                exposure.push({
                    name: target.name,
                    loss: Math.abs(res.kpis?.financial.revenue_delta || res.financial.revenue_delta || 0),
                    dept: target.dept
                });
            }
            setAnalyticsData({ revenueExposureData: exposure });
            toast.success("Structural Revenue Analysis Complete");
        } catch (err) {
            toast.error("Exposure analysis failed");
        } finally {
            setAnalyticsLoading("revenue", false);
        }
    };

    const runBatchSim = async (limit: number = 10) => {
        setAnalyticsLoading("batch", true);
        setBatchProgress(0);
        const results: BatchRunResult[] = [];
        const targets = busFactorRanking.slice(0, limit);

        try {
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i];
                const res = await compareStrategies({ employee_id: target.id, seed });
                const best = res.best_strategy;
                const bestKpi = res.strategies[best];

                results.push({
                    employee_id: target.id,
                    bestStrategy: best as Strategy,
                    profitDelta: bestKpi.financial.profit_projection,
                    stability: bestKpi.risk.stability_score,
                    risk: bestKpi.risk.fragility_index
                });
                setBatchProgress(((i + 1) / targets.length) * 100);
            }
            setAnalyticsData({ batchSimulationResults: results });
            toast.success(`Batch simulation for ${targets.length} critical nodes complete`);
        } catch (err) {
            toast.error("Batch simulation encountered errors");
        } finally {
            setAnalyticsLoading("batch", false);
        }
    };

    const exportCSV = () => {
        const headers = ["Employee ID", "Best Strategy", "Profit Delta", "Stability", "Risk Index"];
        const rows = batchSimulationResults.map(r => [
            r.employee_id,
            r.bestStrategy,
            r.profitDelta,
            r.stability,
            r.risk
        ]);
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `batch_simulation_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Shell>
            <div className="p-8 max-w-[1600px] mx-auto space-y-12 pb-20">
                {/* Superior Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight uppercase">Org Intelligence</h1>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium max-w-lg">
                            Strategic risk control room monitoring structural fragility, systematic exposure, and deterministic single points of failure.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={loadBaseData}
                            className="rounded-xl h-11 px-6 border-border/60 hover:bg-secondary active:scale-95 transition-all"
                        >
                            <RefreshCcw className={cn("h-4 w-4 mr-2", analyticsLoading.heatmap && "animate-spin")} />
                            Refresh State
                        </Button>
                        <div className="h-11 w-px bg-border/40 mx-2" />
                        <div className="bg-secondary/20 rounded-xl px-4 py-2 border border-border/40 flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Model Status</span>
                                <span className="text-xs font-bold text-green-500 flex items-center gap-1.5">
                                    <Activity className="h-3 w-3" /> Live
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Exposure</span>
                                <span className="text-xs font-bold text-amber-500 uppercase">Critical</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. Department Risk Heatmap */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <CloudLightning className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">1. Department Risk Heatmap</h2>
                        </div>
                        {filterDept && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilterDept(null)}
                                className="h-7 text-[10px] uppercase font-bold text-red-500 hover:bg-red-50"
                            >
                                Clear Filter: {filterDept}
                            </Button>
                        )}
                    </div>
                    <DepartmentRiskHeatmap data={departmentRiskData} onDeptClick={setFilterDept} />
                </section>

                {/* 2 & 3: Bus Factor and Revenue Map */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Terminal className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">2. Bus Factor Ranking</h2>
                        </div>
                        <BusFactorView data={filteredBusFactor} onSimulate={(id) => {
                            setConfig({ selectedEmployee: id });
                            toast.info(`Subject ${id} focused in Command Center`);
                        }} />
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3. Revenue Exposure Map</h2>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={runExposureAnalysis}
                                disabled={analyticsLoading.revenue}
                                className="h-8 rounded-lg text-[10px] font-bold uppercase border-border/60"
                            >
                                {analyticsLoading.revenue ? <RefreshCcw className="h-3 w-3 animate-spin mr-1.5" /> : <Activity className="h-3 w-3 mr-1.5" />}
                                Run Exposure Analysis
                            </Button>
                        </div>
                        <RevenueExposureMap data={revenueExposureData} loading={analyticsLoading.revenue} />
                    </section>
                </div>

                {/* 4. Auto-Simulation Matrix */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">4. Auto-Simulation Matrix</h2>
                    </div>
                    <AutoSimulationMatrix
                        data={batchSimulationResults}
                        loading={analyticsLoading.batch}
                        progress={batchProgress}
                        onRun={runBatchSim}
                        onDownload={exportCSV}
                    />
                </section>
            </div>
        </Shell>
    );
}
