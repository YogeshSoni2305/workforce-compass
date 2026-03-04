import React, { useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useSimulationStore } from "@/store/simulationStore";
import { simulatePortfolio } from "@/lib/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import {
    Layers,
    AlertCircle,
    Clock,
    TrendingDown,
    LayoutGrid,
    Zap,
    RefreshCw,
    Search,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const projectsList = [
    { id: "PRJ-001", name: "Cloud Migration Alpha", owner: "Engineering" },
    { id: "PRJ-002", name: "GenAI Customer Support", owner: "Product" },
    { id: "PRJ-003", name: "Core Infrastructure v2", owner: "SRE" },
    { id: "PRJ-004", name: "Strategic Payroll Rework", owner: "HR" },
    { id: "PRJ-005", name: "Market Expansion EU", owner: "Sales" },
    { id: "PRJ-006", name: "Security Audit Hardening", owner: "Security" },
];

export default function PortfolioSimulation() {
    const {
        portfolioResults,
        expansionLoading,
        seed,
        setExpansionData,
        setExpansionLoading
    } = useSimulationStore();

    const [selectedProjectIds, setSelectedProjectIds] = React.useState<string[]>(["PRJ-001", "PRJ-002"]);

    const toggleProject = (id: string) => {
        setSelectedProjectIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const runSimulation = async () => {
        if (selectedProjectIds.length === 0) {
            toast.warning("Select at least one project for portfolio analysis.");
            return;
        }
        setExpansionLoading(true);
        try {
            const res = await simulatePortfolio({
                project_ids: selectedProjectIds,
                priorities: selectedProjectIds.reduce((acc, id) => ({ ...acc, [id]: 3 }), {}),
                seed
            });
            setExpansionData({ portfolioResults: res });
            toast.success("Portfolio Simulation Compiled");
        } catch (err) {
            toast.error("Simulation engine timeout");
        } finally {
            setExpansionLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        runSimulation();
    }, [seed, selectedProjectIds]);

    return (
        <Shell>
            <div className="p-8 max-w-[1600px] mx-auto space-y-10 pb-32">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                <Layers className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight uppercase">Portfolio Simulation</h1>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium max-w-lg">
                            Analyze multi-project interactions, verify resource availability, and identify scheduling conflicts across the strategic portfolio.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={runSimulation}
                            disabled={expansionLoading}
                            className="rounded-xl h-11 px-6 border-border/60 hover:bg-secondary active:scale-95 transition-all"
                        >
                            <RefreshCw className={cn("h-4 w-4 mr-2", expansionLoading && "animate-spin")} />
                            Sync Model
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Project Selection Sidebar */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Portfolio Selection</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {projectsList.map((prj) => (
                                    <div
                                        key={prj.id}
                                        onClick={() => toggleProject(prj.id)}
                                        className={cn(
                                            "p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between",
                                            selectedProjectIds.includes(prj.id)
                                                ? "bg-primary/5 border-primary/40 shadow-sm"
                                                : "bg-background border-border/50 hover:bg-secondary/50"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <p className="text-xs font-black tracking-tight">{prj.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{prj.owner}</p>
                                        </div>
                                        {selectedProjectIds.includes(prj.id) && (
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="xl:col-span-3 space-y-8">
                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-background/50 border-border/50 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Portfolio Revenue</CardDescription>
                                    <CardTitle className="text-2xl font-black">${(portfolioResults?.portfolio_revenue || 0).toLocaleString()}</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="bg-background/50 border-border/50 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Delay Exposure</CardDescription>
                                    <CardTitle className="text-2xl font-black text-amber-500">{(portfolioResults?.delay_exposure || 0)} Units</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="bg-background/50 border-border/50 shadow-sm border-l-4 border-l-red-500/40">
                                <CardHeader className="pb-2">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Active Constraints</CardDescription>
                                    <CardTitle className="text-2xl font-black">{selectedProjectIds.length * 2}</CardTitle>
                                </CardHeader>
                            </Card>
                        </div>

                        {/* Heatmap Section */}
                        <Card className="border-border/60 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Resource Conflict Heatmap
                                </CardTitle>
                                <CardDescription>Probabilistic density of resource contention over a 12-week execution horizon</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px] w-full pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={portfolioResults?.conflict_heatmap || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                            <XAxis
                                                dataKey="week"
                                                tickFormatter={(v) => `W${v}`}
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize={10}
                                                fontWeight="bold"
                                            />
                                            <YAxis hide domain={[0, 1]} />
                                            <Tooltip
                                                cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.2 }}
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="density" radius={[6, 6, 0, 0]}>
                                                {(portfolioResults?.conflict_heatmap || []).map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.density > 0.7 ? '#ef4444' : entry.density > 0.4 ? '#fbbf24' : 'hsl(var(--primary))'}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Insights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-secondary/20 rounded-3xl p-6 border border-border/40 flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold">Detected Constraint: Engineering</h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                        Core Infrastructure v2 and Cloud Migration Alpha exhibit a 82% overlap in SRE requirements between Week 4 and Week 7. Consider staggered start.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-green-500/5 rounded-3xl p-6 border border-green-500/10 flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-inner">
                                    <Zap className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold">Optimization Identified</h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                        GenAI Customer Support has minimal overlap with strategic payroll rework. These can be executed in parallel with 0% conflict probability.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
