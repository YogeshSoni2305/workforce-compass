import { useState } from "react";
import { useSimulationStore } from "@/store/simulationStore";
import { compareStrategies, explainDecision } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompareArrows, BrainCircuit, Loader2 } from "lucide-react";

export function DecisionPanel() {
  const { selectedEmployee, seed, decision, explanation, setDecision, setExplanation } =
    useSimulationStore();
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [loadingExplain, setLoadingExplain] = useState(false);

  async function compare() {
    setLoadingCompare(true);
    try {
      const res = await compareStrategies({ employee_id: selectedEmployee, seed });
      setDecision(res);
    } catch {
      setDecision(null);
    } finally {
      setLoadingCompare(false);
    }
  }

  async function explain() {
    setLoadingExplain(true);
    try {
      const res = await explainDecision({ employee_id: selectedEmployee, seed });
      setExplanation(res.explanation || JSON.stringify(res));
    } catch {
      setExplanation("Failed to get explanation.");
    } finally {
      setLoadingExplain(false);
    }
  }

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Decision Intelligence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button onClick={compare} disabled={loadingCompare} variant="outline" size="sm" className="flex-1">
            {loadingCompare ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompareArrows className="h-4 w-4" />}
            <span className="ml-2">Compare</span>
          </Button>
          <Button onClick={explain} disabled={loadingExplain} variant="outline" size="sm" className="flex-1">
            {loadingExplain ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            <span className="ml-2">Explain</span>
          </Button>
        </div>

        <AnimatePresence>
          {decision && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {Object.entries(decision).map(([strategyName, metrics]) => (
                <div key={strategyName} className="rounded-lg border border-border bg-secondary/50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                    {String(strategyName).replace(/_/g, " ")}
                  </p>
                  {typeof metrics === "object" && metrics !== null ? (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(metrics as Record<string, any>).map(([k, v]) => (
                        <div key={k}>
                          <p className="text-[10px] uppercase text-muted-foreground">{k.replace(/_/g, " ")}</p>
                          <p className="text-sm font-bold tabular-nums text-foreground">
                            {typeof v === "number" ? v.toFixed(2) : String(v)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground">{String(metrics)}</p>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-border bg-secondary/30 p-4"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                AI Recommendation
              </p>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
