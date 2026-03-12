"use client"

import React, { useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useSimulationStore } from "@/store/simulationStore";
import { allocateBudget } from "@/lib/api";
import {
    PieChart,
    Pie,
    Cell as ReCell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import {
    Wallet,
    TrendingDown,
    TrendingUp,
    ShieldCheck,
    Zap,
    RefreshCw,
    Snowflake,
    GraduationCap,
    CalendarDays,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function BudgetStrategy() {
    const {
        budgetImpact,
        expansionLoading,
        seed,
        setExpansionData,
        setExpansionLoading
    } = useSimulationStore();

    const [adjustment, setAdjustment] = React.useState(0);
    const [hiringFreeze, setHiringFreeze] = React.useState(false);
    const [trainingInvestment, setTrainingInvestment] = React.useState(0.2);

    const runSimulation = async () => {
        setExpansionLoading(true);
        try {
            const res = await allocateBudget({
                adjustment_percent: adjustment,
                hiring_freeze: hiringFreeze,
                training_investment: trainingInvestment,
                seed
            });
            setExpansionData({ budgetImpact: res });
        } catch (err) {
            toast.error("Budget simulation engine failure");
        } finally {
            setExpansionLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        runSimulation();
    }, [seed, adjustment, hiringFreeze, trainingInvestment]);

    const pieData = [
        { name: "Allocated", value: 100 + adjustment },
        { name: "Reserve", value: Math.max(0, 20 - adjustment) }
    ];

    const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))"];

    return (
        <Shell>
            <div className="p-8 max-w-[1600px] mx-auto space-y-10 pb-32">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                <Wallet className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight uppercase">Budget Strategy</h1>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium max-w-lg">
                            Macro-level financial simulation to model the impact of budget reallocation, resource freezes, and strategic capital investment.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/20 rounded-xl px-4 py-2 border border-border/40 flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Scenario Mode</span>
                                <span className="text-xs font-bold uppercase tracking-tighter">Budget Optimization</span>
                            </div>
                            <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-[10px] uppercase font-bold text-primary"
                                onClick={() => { setAdjustment(0); setHiringFreeze(false); setTrainingInvestment(0.2); }}
                            >
                                Reset Baseline
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Simulation Controls */}
                    <div className="xl:col-span-4 space-y-8">
                        <Card className="border-border/60 shadow-md bg-background/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-bold uppercase tracking-tight">Financial Levers</CardTitle>
                                <CardDescription>Adjust strategic parameters to calculate organizational impact</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-10">
                                {/* Lever 1: Adjustment */}
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-black uppercase flex items-center gap-2">
                                            Total Budget Adjustment
                                        </Label>
                                        <span className={cn(
                                            "text-xs font-mono font-bold px-2 py-0.5 rounded",
                                            adjustment >= 0 ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                                        )}>
                                            {adjustment > 0 ? "+" : ""}{adjustment}%
                                        </span>
                                    </div>
                                    <Slider
                                        value={[adjustment]}
                                        min={-20}
                                        max={20}
                                        step={1}
                                        onValueChange={(v) => setAdjustment(v[0])}
                                    />
                                    <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase">
                                        <span>-20% (Cut)</span>
                                        <span>+20% (Expansion)</span>
                                    </div>
                                </div>

                                {/* Lever 2: Training */}
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-black uppercase flex items-center gap-2">
                                            <GraduationCap className="h-3 w-3" /> Training Investment
                                        </Label>
                                        <span className="text-xs font-mono font-bold text-primary">{(trainingInvestment * 100).toFixed(0)}%</span>
                                    </div>
                                    <Slider
                                        value={[trainingInvestment]}
                                        min={0}
                                        max={1}
                                        step={0.05}
                                        onValueChange={(v) => setTrainingInvestment(v[0])}
                                    />
                                </div>

                                {/* Lever 3: Hiring Freeze */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/40">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-black uppercase flex items-center gap-2">
                                            <Snowflake className="h-3.3 text-blue-500" /> Hiring Freeze
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground font-medium">Suspend all active and future reqs</p>
                                    </div>
                                    <Switch checked={hiringFreeze} onCheckedChange={setHiringFreeze} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex items-start gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold">Optimization Advisory</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                    Based on current fragility index, a 5% budget increase allocated specifically to <strong>Training Investment</strong> yields a 2.4x higher stability gain than broad headcount expansion.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Visualization */}
                    <div className="xl:col-span-8 space-y-8">
                        {/* Real-time KPI Delta Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-background border-border/50 shadow-sm relative overflow-hidden h-28">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    {(budgetImpact?.revenue_delta_percent ?? 0) >= 0 ? <TrendingUp className="h-10 w-10" /> : <TrendingDown className="h-10 w-10" />}
                                </div>
                                <CardHeader className="p-4">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Revenue Forecast Delta</CardDescription>
                                    <CardTitle className={cn(
                                        "text-3xl font-black",
                                        (budgetImpact?.revenue_delta_percent ?? 0) >= 0 ? "text-green-500" : "text-red-500"
                                    )}>
                                        {(budgetImpact?.revenue_delta_percent ?? 0) > 0 ? "+" : ""}{budgetImpact?.revenue_delta_percent}%
                                    </CardTitle>
                                </CardHeader>
                            </Card>

                            <Card className="bg-background border-border/50 shadow-sm relative overflow-hidden h-28">
                                <CardHeader className="p-4">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Org Stability Impact</CardDescription>
                                    <CardTitle className={cn(
                                        "text-3xl font-black",
                                        (budgetImpact?.stability_delta ?? 0) >= 0 ? "text-primary" : "text-amber-500"
                                    )}>
                                        {(budgetImpact?.stability_delta ?? 0) > 0 ? "+" : ""}{budgetImpact?.stability_delta?.toFixed(2)}
                                    </CardTitle>
                                </CardHeader>
                            </Card>

                            <Card className="bg-background border-border/50 shadow-sm relative overflow-hidden h-28">
                                <CardHeader className="p-4">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attrition Sensitivity</CardDescription>
                                    <CardTitle className="text-3xl font-black">
                                        {(budgetImpact?.attrition_delta ?? 0) > 0 ? "+" : ""}{budgetImpact?.attrition_delta?.toFixed(2)}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </div>

                        {/* Primary Chart Area */}
                        <Card className="border-border/60 shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-tight">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        Project Run-Rate Trajectory
                                    </CardTitle>
                                    <CardDescription>Simulated revenue trajectory based on budget and efficiency adjustments</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: "Baseline", value: 500000 },
                                        { name: "Optimized", value: budgetImpact?.financial_summary.new_run_rate || 500000 }
                                    ]}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={120}>
                                            <ReCell fill="hsl(var(--secondary))" />
                                            <ReCell fill="hsl(var(--primary))" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                            <div className="p-6 border-t border-border/40 bg-muted/20 flex items-center justify-between">
                                <div className="flex gap-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground">New Monthly OpEx</span>
                                        <span className="text-base font-black">$412,000</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground text-primary">Efficiency Multiplier</span>
                                        <span className="text-base font-black text-primary">{budgetImpact?.financial_summary.efficiency_gain.toFixed(1)}x</span>
                                    </div>
                                </div>
                                <Button className="h-10 px-6 rounded-xl font-bold uppercase tracking-tight gap-2">
                                    Review Full Allocation <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
