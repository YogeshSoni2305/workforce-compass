import React, { useEffect, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useSimulationStore } from "@/store/simulationStore";
import { fetchAttritionPrediction, predictTrajectory } from "@/lib/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from "recharts";
import {
    TrendingUp,
    AlertTriangle,
    Activity,
    Zap,
    ShieldAlert,
    ArrowRight,
    RefreshCw,
    Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PredictiveIntelligence() {
    const {
        attritionPredictions,
        trajectoryData,
        predictiveLoading,
        seed,
        setPredictiveData,
        setPredictiveLoading
    } = useSimulationStore();

    const [attritionMultiplier, setAttritionMultiplier] = React.useState(1.0);

    const loadPredictions = async () => {
        setPredictiveLoading(true);
        try {
            const [attrRes, trajRes] = await Promise.all([
                fetchAttritionPrediction(seed),
                predictTrajectory({ months: 12, attrition_multiplier: attritionMultiplier, seed })
            ]);
            setPredictiveData({
                attritionPredictions: attrRes.employees,
                trajectoryData: trajRes.months
            });
        } catch (err) {
            toast.error("Predictive Engine failure", {
                description: "Consistency check failed on stochastic metrics."
            });
        } finally {
            setPredictiveLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadPredictions();
    }, [seed, attritionMultiplier]);

    const riskStats = useMemo(() => {
        const critical = attritionPredictions.filter(p => p.risk_band === "CRITICAL").length;
        const high = attritionPredictions.filter(p => p.risk_band === "HIGH").length;
        const avgProb = attritionPredictions.reduce((acc, p) => acc + p.probability, 0) / (attritionPredictions.length || 1);
        return { critical, high, avgProb };
    }, [attritionPredictions]);

    return (
        <Shell>
            <div className="p-8 max-w-[1600px] mx-auto space-y-10 pb-32">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight uppercase">Predictive Intelligence</h1>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium max-w-lg">
                            Deterministic attrition forecasting and multi-month risk trajectory modeling for strategic workforce planning.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-secondary/20 p-4 rounded-2xl border border-border/40">
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Attrition Multiplier</span>
                                <span className="text-[10px] font-black font-mono text-primary">{attritionMultiplier.toFixed(1)}x</span>
                            </div>
                            <Slider
                                value={[attritionMultiplier]}
                                min={0.5}
                                max={2.5}
                                step={0.1}
                                onValueChange={(v) => setAttritionMultiplier(v[0])}
                                className="w-full"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={loadPredictions}
                            disabled={predictiveLoading}
                            className="rounded-xl h-12 w-12 border-border/60 bg-background/50"
                        >
                            <RefreshCw className={cn("h-5 w-5", predictiveLoading && "animate-spin")} />
                        </Button>
                    </div>
                </div>

                {/* Top KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="h-12 w-12" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Avg Attrition Prob</CardDescription>
                            <CardTitle className="text-3xl font-black">{(riskStats.avgProb * 100).toFixed(1)}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={riskStats.avgProb * 100} className="h-1.5" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden relative">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-red-500">Critical Exposure</CardDescription>
                            <CardTitle className="text-3xl font-black text-red-500">{riskStats.critical}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[10px] text-muted-foreground font-medium">Nodes with p(attrition) &gt; 0.70</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-amber-500">High Risk Count</CardDescription>
                            <CardTitle className="text-3xl font-black text-amber-500">{riskStats.high}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[10px] text-muted-foreground font-medium">Nodes in the 0.50 - 0.70 prob band</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm border-l-4 border-l-primary/40">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Revenue at Risk</CardDescription>
                            <CardTitle className="text-3xl font-black">
                                ${((trajectoryData[0]?.revenue - trajectoryData[11]?.revenue) || 0).toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">12-Month Projected Loss</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Trajectory Chart */}
                    <Card className="xl:col-span-2 border-border/60 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    12-Month Risk Trajectory
                                </CardTitle>
                                <CardDescription>Deterministic forecast based on structural fragility and attrition multiplier</CardDescription>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-1 bg-primary rounded-full" /> Revenue Impact
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-1 bg-red-500 rounded-full" /> Stability Index
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trajectoryData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                        <XAxis
                                            dataKey="month"
                                            tickFormatter={(v) => `M${v}`}
                                            axisLine={false}
                                            tickLine={false}
                                            fontSize={10}
                                            fontWeight="bold"
                                        />
                                        <YAxis yAxisId="left" hide />
                                        <YAxis yAxisId="right" hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ fontWeight: 'bold' }}
                                        />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="stability"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attrition Rankings Card */}
                    <Card className="border-border/60 shadow-md flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Attrition Probability Ranking
                            </CardTitle>
                            <CardDescription>Top exposure nodes categorized by stochastic risk band</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[480px]">
                            <div className="space-y-4 pt-2">
                                {attritionPredictions.slice(0, 8).map((emp) => (
                                    <div
                                        key={emp.employee_id}
                                        className="flex flex-col gap-2 p-3 rounded-xl border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black tracking-tight">{emp.name}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{emp.employee_id}</span>
                                            </div>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                                                emp.risk_band === "CRITICAL" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                                    emp.risk_band === "HIGH" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                                        "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                            )}>
                                                {emp.risk_band}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Progress value={emp.probability * 100} className="h-1 flex-1" />
                                            <span className="text-[10px] font-mono font-bold">{(emp.probability * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="p-4 border-t border-border/40 bg-muted/20">
                            <Button variant="ghost" className="w-full h-8 text-[10px] uppercase font-bold group" size="sm">
                                View Full Risk Registry <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Informational Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Info className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold">Stochastic Modeling Method</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                The attrition probability is computed using a weighted deterministic formula: <br />
                                <code className="bg-background/50 px-1.5 py-0.5 rounded mt-1 inline-block">0.3*Fragility + 0.2*Utilization + 0.2*Centrality + 0.2*Burnout</code>
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <ShieldAlert className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold">Executive Risk Thresholds</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Critical band (p &gt; 0.7) triggers automated mitigation scenarios. High risk (p &gt; 0.5) requires immediate succession planning audit. Simulation reflects cumulative revenue decay per month.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
