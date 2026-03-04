import React, { useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useSimulationStore } from "@/store/simulationStore";
import { mergeOrgs } from "@/lib/api";
import {
    GitMerge,
    Users,
    TrendingUp,
    ShieldAlert,
    Zap,
    RefreshCw,
    Building2,
    Scale,
    Search,
    CheckCircle2,
    AlertTriangle,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    PieChart,
    Pie,
    Cell as ReCell,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const targetEntities = [
    { id: "ENT-A", name: "Starlight Digital", size: "120 Employees", focus: "AI/ML" },
    { id: "ENT-B", name: "Nexis Cloud Solutions", size: "85 Employees", focus: "SaaS/Ops" },
    { id: "ENT-C", name: "Blue Harbor Ops", size: "230 Employees", focus: "Backoffice" },
];

export default function MAModeling() {
    const {
        mergeAnalysis,
        expansionLoading,
        seed,
        setExpansionData,
        setExpansionLoading
    } = useSimulationStore();

    const [selectedEntity, setSelectedEntity] = React.useState(targetEntities[0]);
    const [mergeType, setMergeType] = React.useState<"aggressive" | "gradual" | "selective">("gradual");

    const runMergeSimulation = async () => {
        setExpansionLoading(true);
        try {
            // Mock other_org_data for simulation
            const mockOtherOrg = {
                employees: Array(100).fill({}),
                departments: ["Engineering", "Product", "Sales"]
            };

            const res = await mergeOrgs({
                other_org_data: mockOtherOrg,
                merge_type: mergeType,
                seed
            });
            setExpansionData({ mergeAnalysis: res });
            toast.success("M&A Scenario Unified", {
                description: `Analysis for ${selectedEntity.name} complete.`
            });
        } catch (err) {
            toast.error("M&A engine timeout");
        } finally {
            setExpansionLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        runMergeSimulation();
    }, [seed, selectedEntity, mergeType]);

    const pieData = mergeAnalysis ? [
        { name: "Synergies", value: 30 },
        { name: "Friction", value: mergeAnalysis.combined_fragility * 40 },
        { name: "Baseline", value: 50 }
    ] : [];

    const COLORS = ["hsl(var(--primary))", "#ef4444", "hsl(var(--secondary))"];

    return (
        <Shell>
            <div className="p-8 max-w-[1600px] mx-auto space-y-10 pb-32">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                <GitMerge className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight uppercase">M&A Scenario Modeling</h1>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium max-w-lg">
                            Simulate the impact of organizational mergers, identify structural overlaps, and predict synergy execution risk in potential acquisitions.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            disabled={expansionLoading}
                            onClick={runMergeSimulation}
                            className="rounded-xl h-11 px-6 border-border/60 hover:bg-secondary active:scale-95 transition-all"
                        >
                            <RefreshCw className={cn("h-4 w-4 mr-2", expansionLoading && "animate-spin")} />
                            Recalculate Synergies
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Target Selection */}
                    <div className="xl:col-span-1 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Acquisition Target</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {targetEntities.map((ent) => (
                                    <div
                                        key={ent.id}
                                        onClick={() => setSelectedEntity(ent)}
                                        className={cn(
                                            "p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col gap-2",
                                            selectedEntity.id === ent.id
                                                ? "bg-primary/5 border-primary/40 shadow-sm"
                                                : "bg-background border-border/50 hover:bg-secondary/50"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-black tracking-tight">{ent.name}</p>
                                            <Badge variant="outline" className="text-[9px] font-bold uppercase">{ent.size}</Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{ent.focus}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <Scale className="h-4 w-4 text-muted-foreground" />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Merge Strategy</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                {["aggressive", "gradual", "selective"].map((type) => (
                                    <Button
                                        key={type}
                                        variant={mergeType === type ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setMergeType(type as "aggressive" | "gradual" | "selective")}
                                        className="justify-start h-10 rounded-xl text-[10px] font-bold uppercase border-border/60"
                                    >
                                        {mergeType === type && <CheckCircle2 className="h-3 w-3 mr-2" />}
                                        {type} integration
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Merge Analysis */}
                    <div className="xl:col-span-3 space-y-10">
                        {/* Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-background/50 border-border/50 shadow-sm border-l-4 border-l-primary/40">
                                <CardHeader className="pb-2">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Synergy Run-Rate</CardDescription>
                                    <CardTitle className="text-2xl font-black">${(mergeAnalysis?.revenue_projection || 0).toLocaleString()}</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="bg-background/50 border-border/50 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Stability Score</CardDescription>
                                    <CardTitle className="text-2xl font-black text-amber-500">{(mergeAnalysis?.stability_score || 0).toFixed(2)}</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="bg-background/50 border-border/50 shadow-sm text-red-500 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Users className="h-10 w-10" />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-red-500">Overlap Redundancy</CardDescription>
                                    <CardTitle className="text-2xl font-black">{mergeAnalysis?.overlap_count} Roles</CardTitle>
                                </CardHeader>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Integration Friction Chart */}
                            <Card className="border-border/60 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-amber-500" />
                                        Integration Composition
                                    </CardTitle>
                                    <CardDescription>Breakdown of synergy potential vs organizational friction</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={4}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((_, index) => (
                                                    <ReCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                                <div className="px-6 pb-6 grid grid-cols-3 gap-2">
                                    {pieData.map((d, i) => (
                                        <div key={i} className="flex flex-col">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                                <span className="text-[9px] font-bold uppercase text-muted-foreground">{d.name}</span>
                                            </div>
                                            <span className="text-xs font-black">{d.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Risk Audit */}
                            <Card className="border-border/60 shadow-md flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <ShieldAlert className="h-5 w-5 text-primary" />
                                        Post-Merge Risk Audit
                                    </CardTitle>
                                    <CardDescription>Predicted stability index for unified organization</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-6 pt-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span>Cultural Friction</span>
                                                <span className="text-amber-500">32%</span>
                                            </div>
                                            <Progress value={32} className="h-1.5" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span>System Redundancy</span>
                                                <span className="text-primary">68%</span>
                                            </div>
                                            <Progress value={68} className="h-1.5" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span>Knowledge Leakage Risk</span>
                                                <span className="text-red-500">14%</span>
                                            </div>
                                            <Progress value={14} className="h-1.5" />
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                                        <div className="h-8 w-8 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                            Merging with {selectedEntity.name} using <strong>{mergeType} integration</strong> yields $240k synergy but increases structural fragility by {((mergeAnalysis?.combined_fragility || 0) * 100).toFixed(0)}%.
                                        </p>
                                    </div>
                                </CardContent>
                                <div className="p-4 border-t border-border/40 bg-muted/20">
                                    <Button variant="ghost" className="w-full h-8 text-[10px] uppercase font-bold group" size="sm">
                                        Full Synergies Report <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
