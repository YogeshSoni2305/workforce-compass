import { useSimulationStore } from "@/store/simulationStore";
import { simulateScenario } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Loader2 } from "lucide-react";

function KPICard({ label, value }: { label: string; value: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-border bg-secondary/50 p-4"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
    </motion.div>
  );
}

export function SimulationPanel() {
  const { selectedEmployee, strategy, seed, shock, result, loading, setConfig, setResult, setLoading } =
    useSimulationStore();

  async function run() {
    setLoading(true);
    try {
      const res = await simulateScenario({
        employee_id: selectedEmployee,
        strategy,
        seed,
        shock_test: shock,
      });
      setResult(res);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Strategy</Label>
            <Select value={strategy} onValueChange={(v) => setConfig({ strategy: v })}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baseline">Baseline</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
                <SelectItem value="conservative">Conservative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Seed</Label>
            <Input
              type="number"
              value={seed}
              onChange={(e) => setConfig({ seed: Number(e.target.value) })}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Shock Test</Label>
          <Switch checked={shock} onCheckedChange={(v) => setConfig({ shock: v })} />
        </div>

        {selectedEmployee && (
          <p className="text-xs text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{selectedEmployee}</span>
          </p>
        )}

        <Button onClick={run} disabled={loading} className="w-full" size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          <span className="ml-2">{loading ? "Running…" : "Run Simulation"}</span>
        </Button>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3 pt-2"
            >
              {Object.entries(result).map(([key, val]) => (
                <KPICard
                  key={key}
                  label={key.replace(/_/g, " ")}
                  value={typeof val === "number" ? Number(val).toFixed(2) : String(val)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
