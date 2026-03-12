"use client"

// import { useState } from "react";
// import { useSimulationStore, KPIResult, ComparisonResult } from "@/store/simulationStore";
// import { compareStrategies, explainDecision } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   GitCompareArrows,
//   BrainCircuit,
//   Loader2,
//   AlertCircle,
//   TrendingUp,
//   DollarSign,
//   ShieldAlert,
//   Users,
//   Info,
//   ChevronRight,
//   ClipboardCheck,
//   Zap,
//   Clock,
//   Layout,
//   History as HistoryIcon
// } from "lucide-react";
// import { toast } from "sonner";
// import { KPIGrid } from "@/components/ui/KPIGrid";
// import { cn } from "@/lib/utils";

// export function DecisionPanel() {
//   const {
//     selectedEmployee,
//     seed,
//     result,
//     comparisonResult,
//     explanation,
//     history,
//     setComparisonResult,
//     setExplanation,
//     setConfig
//   } = useSimulationStore();

//   const [loadingCompare, setLoadingCompare] = useState(false);
//   const [loadingExplain, setLoadingExplain] = useState(false);

//   async function compare() {
//     if (!selectedEmployee) return;
//     setLoadingCompare(true);
//     try {
//       const res = await compareStrategies({ employee_id: selectedEmployee, seed });
//       setComparisonResult(res);
//       toast.success("Comparative Analysis Refreshed");
//     } catch (err) {
//       toast.error("Comparison analysis failed");
//     } finally {
//       setLoadingCompare(false);
//     }
//   }

//   async function explain() {
//     if (!selectedEmployee) return;
//     setLoadingExplain(true);
//     try {
//       const res = await explainDecision({ employee_id: selectedEmployee, seed });
//       setExplanation(res.explanation || "No explanation returned");
//       toast.success("AI Interpretation Generated");
//     } catch (err) {
//       toast.error("Explanation failed");
//     } finally {
//       setLoadingExplain(false);
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     toast.info("Copied to clipboard");
//   };

//   return (
//     <div className="space-y-6 pb-20">
//       {/* 1. Decision Intelligence Toolbar */}
//       <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
//         <CardHeader className="pb-4 bg-secondary/10 border-b border-border/50">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Zap className="h-4 w-4 text-primary" />
//               <CardTitle className="text-sm font-bold uppercase tracking-wider">Intelligence tools</CardTitle>
//             </div>
//             {selectedEmployee && (
//               <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded uppercase">Active</span>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent className="p-4 flex gap-3">
//           <Button
//             onClick={compare}
//             disabled={loadingCompare || !selectedEmployee}
//             variant="outline"
//             className="flex-1 rounded-xl h-10 border-border/60 hover:bg-secondary"
//           >
//             {loadingCompare ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <GitCompareArrows className="h-4 w-4 mr-2" />}
//             <span className="text-xs font-bold uppercase tracking-tight">Compare</span>
//           </Button>
//           <Button
//             onClick={explain}
//             disabled={loadingExplain || !selectedEmployee}
//             variant="outline"
//             className="flex-1 rounded-xl h-10 border-border/60 hover:bg-secondary"
//           >
//             {loadingExplain ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
//             <span className="text-xs font-bold uppercase tracking-tight">Explain</span>
//           </Button>
//         </CardContent>
//       </Card>

//       {/* 2. Structured KPI Grid (Only if result exists) */}
//       <AnimatePresence mode="wait">
//         {result ? (
//           <motion.div
//             key="kpi-grid"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             className="space-y-6"
//           >
//             <KPIGrid
//               title="Execution metrics"
//               metrics={[
//                 { label: "Total Duration", value: `${result.execution.total_duration} days`, icon: Clock, trend: "neutral" },
//                 { label: "Critical Path", value: `${result.execution.critical_path_impact}%`, icon: Layout, trend: result.execution.critical_path_impact > 50 ? "down" : "up" },
//                 { label: "Completion", value: `${result.execution.task_completion_pct}%`, icon: Info, trend: "up" },
//               ]}
//             />

//             <KPIGrid
//               title="Financial Impact"
//               metrics={[
//                 { label: "Revenue Delta", value: `${result.financial.revenue_delta > 0 ? '+' : ''}${result.financial.revenue_delta.toLocaleString()}`, icon: TrendingUp, trend: result.financial.revenue_delta > 0 ? "up" : "down" },
//                 { label: "Profit Proj.", value: `${result.financial.profit_projection.toLocaleString()}`, icon: DollarSign, trend: "neutral" },
//                 { label: "Cost of Delay", value: `${result.financial.cost_of_delay.toLocaleString()}`, icon: Info, trend: "down" },
//               ]}
//             />

//             <KPIGrid
//               title="Risk & Stability"
//               metrics={[
//                 { label: "Fragility", value: result.risk.fragility_index.toFixed(2), icon: ShieldAlert, trend: result.risk.fragility_index > 0.5 ? "down" : "up" },
//                 { label: "Stability", value: `${result.risk.stability_score}%`, icon: Info, trend: "up" },
//                 { label: "Bus Factor", value: result.risk.bus_factor_impact, icon: Users, trend: "neutral" },
//               ]}
//             />
//           </motion.div>
//         ) : !selectedEmployee ? (
//           <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-border/40 bg-muted/10">
//             <Layout className="h-10 w-10 text-muted-foreground/30 mb-4" />
//             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Awaiting Input</p>
//             <p className="text-[11px] text-muted-foreground/60 mt-1 max-w-[200px]">Select a node to begin strategic workforce simulation.</p>
//           </div>
//         ) : null}
//       </AnimatePresence>

//       {/* 3. AI Executive Summary */}
//       <AnimatePresence>
//         {explanation && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="rounded-2xl border border-primary/20 bg-primary/5 p-5 relative group"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center gap-2">
//                 <BrainCircuit className="h-4 w-4 text-primary" />
//                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Executive Summary</span>
//               </div>
//               <button
//                 onClick={() => copyToClipboard(explanation)}
//                 className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-primary/10 rounded-lg"
//               >
//                 <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
//               </button>
//             </div>
//             <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium decoration-primary/20">
//               {explanation}
//             </p>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 4. History Strip (Bottom Fixed or Scrollable) */}
//       {history.length > 0 && (
//         <div className="pt-4 border-t border-border">
//           <div className="flex items-center gap-2 mb-3 px-1">
//             <HistoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
//             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent scenario history</span>
//           </div>
//           <div className="space-y-2">
//             {history.map((run) => (
//               <button
//                 key={run.id}
//                 onClick={() => setConfig({ selectedEmployee: run.employee_id, strategy: run.strategy })}
//                 className="flex items-center justify-between w-full p-3 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-border/40 transition-all text-left group"
//               >
//                 <div className="flex flex-col">
//                   <span className="text-[11px] font-bold truncate max-w-[120px]">{run.employee_id}</span>
//                   <span className="text-[10px] text-muted-foreground uppercase tracking-tight font-semibold italic">{run.strategy}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="text-right">
//                     <span className="block text-[11px] font-bold text-foreground">${run.result.financial.profit_projection.toLocaleString()}</span>
//                   </div>
//                   <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }












import { useState } from "react";
import { useSimulationStore } from "@/store/simulationStore";
import { compareStrategies, explainDecision } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompareArrows,
  BrainCircuit,
  Loader2,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  Users,
  Info,
  ChevronRight,
  ClipboardCheck,
  Zap,
  Clock,
  Layout,
  History as HistoryIcon,
} from "lucide-react";
import { toast } from "sonner";
import { KPIGrid } from "@/components/ui/KPIGrid";

/* ---------------- SAFE FORMATTERS ---------------- */

function formatNumber(value?: number) {
  return typeof value === "number" ? value.toLocaleString() : "—";
}

function formatSigned(value?: number) {
  if (typeof value !== "number") return "—";
  return `${value > 0 ? "+" : ""}${value.toLocaleString()}`;
}

function formatPercent(value?: number) {
  return typeof value === "number" ? `${value}%` : "—";
}

function formatFixed(value?: number, digits = 2) {
  return typeof value === "number" ? value.toFixed(digits) : "—";
}

/* ---------------- COMPONENT ---------------- */

export function DecisionPanel() {
  const {
    selectedEmployee,
    seed,
    result,
    explanation,
    history,
    setComparisonResult,
    setExplanation,
    setConfig,
  } = useSimulationStore();

  const [loadingCompare, setLoadingCompare] = useState(false);
  const [loadingExplain, setLoadingExplain] = useState(false);

  /* ---------------- ACTIONS ---------------- */

  async function compare() {
    if (!selectedEmployee) {
      toast.error("Select an employee first");
      return;
    }

    setLoadingCompare(true);
    try {
      const res = await compareStrategies({
        employee_id: selectedEmployee,
        seed,
      });
      setComparisonResult(res);
      toast.success("Comparative Analysis Refreshed");
    } catch {
      toast.error("Comparison analysis failed");
    } finally {
      setLoadingCompare(false);
    }
  }

  async function explain() {
    if (!selectedEmployee) {
      toast.error("Select an employee first");
      return;
    }

    setLoadingExplain(true);
    try {
      const res = await explainDecision({
        employee_id: selectedEmployee,
        seed,
      });
      setExplanation(res?.explanation ?? "No explanation returned");
      toast.success("AI Interpretation Generated");
    } catch {
      toast.error("Explanation failed");
    } finally {
      setLoadingExplain(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  };

  /* ---------------- SAFE DATA EXTRACTION ---------------- */

  const execution = result?.execution;
  const financial = result?.financial;
  const risk = result?.risk;

  const revenueDelta = financial?.revenue_delta;
  const profitProjection = financial?.profit_projection;
  const costOfDelay = financial?.cost_of_delay;

  const fragilityIndex = risk?.fragility_index;
  const stabilityScore = risk?.stability_score;
  const busFactor = risk?.bus_factor_impact;

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-6 pb-20">

      {/* Toolbar */}
      <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-secondary/10 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">
                Intelligence Tools
              </CardTitle>
            </div>
            {selectedEmployee && (
              <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded uppercase">
                Active
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 flex gap-3">
          <Button
            onClick={compare}
            disabled={loadingCompare || !selectedEmployee}
            variant="outline"
            className="flex-1 rounded-xl h-10"
          >
            {loadingCompare ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <GitCompareArrows className="h-4 w-4 mr-2" />
            )}
            <span className="text-xs font-bold uppercase">Compare</span>
          </Button>

          <Button
            onClick={explain}
            disabled={loadingExplain || !selectedEmployee}
            variant="outline"
            className="flex-1 rounded-xl h-10"
          >
            {loadingExplain ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <BrainCircuit className="h-4 w-4 mr-2" />
            )}
            <span className="text-xs font-bold uppercase">Explain</span>
          </Button>
        </CardContent>
      </Card>

      {/* KPI SECTION */}
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="kpi-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Execution */}
            <KPIGrid
              title="Execution Metrics"
              metrics={[
                {
                  label: "Total Duration",
                  value: execution
                    ? `${execution.total_duration ?? "—"} days`
                    : "—",
                  icon: Clock,
                  trend: "neutral",
                },
                {
                  label: "Critical Path",
                  value: execution
                    ? formatPercent(execution.critical_path_impact)
                    : "—",
                  icon: Layout,
                  trend:
                    typeof execution?.critical_path_impact === "number"
                      ? execution.critical_path_impact > 50
                        ? "down"
                        : "up"
                      : "neutral",
                },
                {
                  label: "Completion",
                  value: execution
                    ? formatPercent(execution.task_completion_pct)
                    : "—",
                  icon: Info,
                  trend: "up",
                },
              ]}
            />

            {/* Financial */}
            <KPIGrid
              title="Financial Impact"
              metrics={[
                {
                  label: "Revenue Delta",
                  value: formatSigned(revenueDelta),
                  icon: TrendingUp,
                  trend:
                    typeof revenueDelta === "number"
                      ? revenueDelta > 0
                        ? "up"
                        : "down"
                      : "neutral",
                },
                {
                  label: "Profit Projection",
                  value: formatNumber(profitProjection),
                  icon: DollarSign,
                  trend: "neutral",
                },
                {
                  label: "Cost of Delay",
                  value: formatNumber(costOfDelay),
                  icon: Info,
                  trend: "down",
                },
              ]}
            />

            {/* Risk */}
            <KPIGrid
              title="Risk & Stability"
              metrics={[
                {
                  label: "Fragility",
                  value: formatFixed(fragilityIndex),
                  icon: ShieldAlert,
                  trend:
                    typeof fragilityIndex === "number"
                      ? fragilityIndex > 0.5
                        ? "down"
                        : "up"
                      : "neutral",
                },
                {
                  label: "Stability",
                  value: formatPercent(stabilityScore),
                  icon: Info,
                  trend: "up",
                },
                {
                  label: "Bus Factor",
                  value: busFactor ?? "—",
                  icon: Users,
                  trend: "neutral",
                },
              ]}
            />
          </motion.div>
        ) : !selectedEmployee ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-border/40 bg-muted/10">
            <Layout className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Awaiting Input
            </p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">
              Select a node to begin strategic simulation.
            </p>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-6">
            Run a simulation to generate metrics.
          </div>
        )}
      </AnimatePresence>

      {/* AI SUMMARY */}
      <AnimatePresence>
        {explanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-5"
          >
            <div className="flex justify-between mb-3">
              <span className="text-xs font-bold uppercase text-primary">
                Executive Summary
              </span>
              <button onClick={() => copyToClipboard(explanation)}>
                <ClipboardCheck className="h-4 w-4 text-primary" />
              </button>
            </div>
            <p className="text-sm whitespace-pre-wrap">{explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HISTORY */}
      {history?.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3 px-1">
            <HistoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              Recent Scenario History
            </span>
          </div>

          <div className="space-y-2">
            {history.map((run) => (
              <button
                key={run.id}
                onClick={() =>
                  setConfig({
                    selectedEmployee: run.employee_id,
                    strategy: run.strategy,
                  })
                }
                className="flex justify-between w-full p-3 rounded-xl bg-secondary/30 hover:bg-secondary/60"
              >
                <div>
                  <span className="text-[11px] font-bold">
                    {run.employee_id}
                  </span>
                  <div className="text-[10px] text-muted-foreground uppercase">
                    {run.strategy}
                  </div>
                </div>

                <div className="text-[11px] font-bold">
                  ${formatNumber(run?.result?.financial?.profit_projection)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}