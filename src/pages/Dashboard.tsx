import { OrgGraph } from "@/components/simulation/OrgGraph";
import { SimulationPanel } from "@/components/simulation/SimulationPanel";
import { DecisionPanel } from "@/components/simulation/DecisionPanel";
import { Shell } from "@/components/layout/Shell";

export default function Dashboard() {
  return (
    <Shell>
      <div className="flex h-full overflow-hidden">
        {/* Left — Org Tree (65%) */}
        <div className="w-[65%] border-r border-border bg-muted/20 relative">
          <OrgGraph />
        </div>

        {/* Right — Decision Panel (35%) */}
        <aside className="w-[35%] overflow-y-auto p-6 space-y-6 bg-background">
          <SimulationPanel />
          <DecisionPanel />
        </aside>
      </div>
    </Shell>
  );
}
