import { useSimulationStore, Strategy, KPIResult } from "@/store/simulationStore";
import { simulateScenario } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Loader2,
  Settings2,
  UserPlus,
  Dna,
  History
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SimulationPanel() {
  const {
    selectedEmployee,
    strategy,
    seed,
    shock,
    loading,
    setConfig,
    setResult,
    setLoading,
    addHistoryEntry
  } = useSimulationStore();

  async function run() {
    if (!selectedEmployee) {
      toast.warning("Please select an employee on the org map.");
      return;
    }
    setLoading(true);
    try {
      const res = await simulateScenario({
        employee_id: selectedEmployee,
        strategy,
        seed,
        shock_test: shock,
      });

      if (res.error || res.detail) throw new Error(res.error || res.detail);

      // Map API response to our rich type if necessary, 
      // or assume backend matches our desired executive structure.
      // For this demo, we'll ensure it conforms to KPIResult.
      const formattedResult: KPIResult = res.kpis || res;

      setResult(formattedResult);
      addHistoryEntry({
        id: Math.random().toString(36).substr(2, 9),
        employee_id: selectedEmployee,
        strategy,
        result: formattedResult,
        timestamp: new Date().toISOString()
      });

      toast.success("Simulation Complete", {
        description: `Strategy: ${strategy.replace('_', ' ')}`
      });
    } catch (err: any) {
      setResult(null);
      toast.error("Simulation Failed", {
        description: err.message || "Engine timeout"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 bg-secondary/10 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Simulation Config</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Selected Context */}
        <div className={cn(
          "p-4 rounded-xl border transition-all duration-300 flex items-center gap-3",
          selectedEmployee
            ? "bg-primary/5 border-primary/20"
            : "bg-muted/30 border-dashed border-muted-foreground/30"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
            selectedEmployee ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Subject</p>
            <p className="text-sm font-bold truncate max-w-[180px]">
              {selectedEmployee || "Unassigned"}
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Strategic Intent</Label>
            <Select value={strategy} onValueChange={(v) => setConfig({ strategy: v as Strategy })}>
              <SelectTrigger className="h-10 rounded-lg bg-secondary/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baseline">Baseline (Current)</SelectItem>
                <SelectItem value="aggressive">Aggressive Growth</SelectItem>
                <SelectItem value="conservative">Conservative Stability</SelectItem>
                <SelectItem value="immediate">Immediate Pivot</SelectItem>
                <SelectItem value="delayed">Gradual Change</SelectItem>
                <SelectItem value="no_replace">Attrition (No Replace)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Engine Seed</Label>
            <div className="relative">
              <Dna className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="number"
                value={seed}
                onChange={(e) => setConfig({ seed: Number(e.target.value) })}
                className="h-10 rounded-lg bg-secondary/30 border-border/50 pl-9 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold">Shock Test Resistance</Label>
            <p className="text-[10px] text-muted-foreground">Apply extreme market volatility</p>
          </div>
          <Switch checked={shock} onCheckedChange={(v) => setConfig({ shock: v })} />
        </div>

        <Button
          onClick={run}
          disabled={loading || !selectedEmployee}
          className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Play className="h-4 w-4 mr-2 fill-current" />
          )}
          {loading ? "Initializing Engine..." : "Execute Simulation"}
        </Button>
      </CardContent>
    </Card>
  );
}
