import { OrgGraph } from "@/components/graph/OrgGraph";
import { SimulationPanel } from "@/components/panels/SimulationPanel";
import { DecisionPanel } from "@/components/panels/DecisionPanel";
import { Link } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-foreground" />
            <span className="text-sm font-bold tracking-tight text-foreground">Command Center</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Org Graph */}
        <div className="flex-1 border-r border-border">
          <OrgGraph />
        </div>

        {/* Right — Panels */}
        <aside className="w-[420px] shrink-0 overflow-y-auto p-5 space-y-5">
          <SimulationPanel />
          <DecisionPanel />
        </aside>
      </div>
    </div>
  );
}
