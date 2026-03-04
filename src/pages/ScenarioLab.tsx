import { useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useSimulationStore, Strategy, KPIResult } from "@/store/simulationStore";
import { compareStrategies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmployeeSearchInput } from "@/components/ui/EmployeeSearchInput";
import { StrategyComparisonCard } from "@/components/ui/StrategyComparisonCard";
import { ComparisonMatrixTable } from "@/components/ui/ComparisonMatrixTable";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    Play,
    Loader2,
    FlaskConical,
    TrendingUp,
    ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

export default function ScenarioLab() {
    const {
        selectedEmployee,
        seed,
        comparisonResult,
        loading,
        setConfig,
        setComparisonResult,
        setLoading,
    } = useSimulationStore();

    /* ---------------- RUN ALL STRATEGIES ---------------- */

    async function runAll() {
        if (!selectedEmployee) {
            toast.warning("Please search and select a workforce subject first.");
            return;
        }

        setLoading(true);

        try {
            const res = await compareStrategies({
                employee_id: selectedEmployee,
                seed,
            });

            setComparisonResult(res);

            toast.success("Strategic Suite Compiled", {
                description: "Comparative metrics ready for review.",
            });
        } catch (err) {
            toast.error("Process failed", {
                description: "Simulation engine timeout",
            });
        } finally {
            setLoading(false);
        }
    }

    /* ---------------- SAFE DATA EXTRACTION ---------------- */

    const strategies = comparisonResult?.strategies ?? {};
    const bestStrategy = comparisonResult?.best_strategy ?? null;

    const strategyEntries = Object.entries(strategies);

    /* ---------------- SAFE CHART DATA ---------------- */

    const chartData = useMemo(() => {
        if (!strategyEntries.length) return [];

        return strategyEntries.map(([name, kpis]) => ({
            name: name.replace("_", " ").toUpperCase(),
            profit: (kpis as KPIResult)?.financial?.profit_projection ?? 0,
            stability: (kpis as KPIResult)?.risk?.stability_score ?? 0,
        }));
    }, [strategyEntries]);

    /* ---------------- RENDER ---------------- */

    return (
        <Shell>
            <div className="p-8 max-w-7xl mx-auto space-y-10">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/60">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-primary">
                            <FlaskConical className="h-5 w-5" />
                            <h1 className="text-2xl font-bold tracking-tight">
                                Scenario Lab
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Perform side-by-side strategy benchmarks for workforce events.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-secondary/20 p-4 rounded-2xl border border-border/40">
                        <div className="w-[280px]">
                            <EmployeeSearchInput />
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                                Seed
                            </Label>
                            <Input
                                type="number"
                                value={seed}
                                onChange={(e) =>
                                    setConfig({ seed: Number(e.target.value) })
                                }
                                className="w-16 h-10 rounded-xl bg-background border-border/50 text-xs font-mono"
                            />
                        </div>

                        <Button
                            onClick={runAll}
                            disabled={loading || !selectedEmployee}
                            className="h-10 px-6 rounded-xl font-bold"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Play className="h-4 w-4 mr-2" />
                            )}
                            Generate Benchmark
                        </Button>
                    </div>
                </div>

                {/* EMPTY STATE */}
                {!comparisonResult && !loading && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <FlaskConical className="h-12 w-12 text-muted-foreground/30 mb-6" />
                        <h2 className="text-xl font-bold">
                            Ready for Comparative Analysis
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                            Select an employee and generate a benchmark to compare
                            profit, risk, and stability.
                        </p>
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Running Parallel Scenarios...
                        </p>
                    </div>
                )}

                {/* RESULTS */}
                {comparisonResult && !loading && strategyEntries.length > 0 && (
                    <div className="space-y-12">

                        {/* STRATEGY CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {strategyEntries.map(([strategy, result], idx) => (
                                <StrategyComparisonCard
                                    key={strategy}
                                    strategy={strategy as Strategy}
                                    result={result as KPIResult}
                                    isBest={strategy === bestStrategy}
                                    rank={idx + 1}
                                />
                            ))}
                        </div>

                        {/* MATRIX + CHART */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                            {/* MATRIX */}
                            <div className="xl:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Profit Benchmark Matrix
                                    </h3>
                                </div>
                                <ComparisonMatrixTable data={comparisonResult} />
                            </div>

                            {/* CHART */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Strategic Distribution
                                    </h3>
                                </div>

                                <div className="h-[400px] w-full bg-card border border-border rounded-2xl p-6 shadow-sm">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            layout="vertical"
                                            margin={{ left: 20 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                opacity={0.1}
                                            />
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize={10}
                                                fontWeight="bold"
                                                width={100}
                                            />
                                            <Tooltip />
                                            <Bar dataKey="profit" radius={[0, 8, 8, 0]}>
                                                {chartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            entry.name
                                                                .toLowerCase()
                                                                .replace(" ", "_") === bestStrategy
                                                                ? "hsl(var(--primary))"
                                                                : "hsl(var(--muted-foreground) / 0.4)"
                                                        }
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Shell>
    );
}