"use client"
import dynamic from "next/dynamic";
const OrgGraph = dynamic(() => import("@/components/simulation/OrgGraph").then(m => m.OrgGraph), { ssr: false });
import { SimulationPanel } from "@/components/simulation/SimulationPanel";
import { DecisionPanel } from "@/components/simulation/DecisionPanel";
import { Shell } from "@/components/layout/Shell";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Dashboard() {
  return (
    <Shell>
      <div className="flex h-full overflow-hidden">
        {/* Left — Org Tree (65%) */}
        <div className="w-[65%] border-r border-border bg-muted/20 relative">
          <ErrorBoundary>
            <OrgGraph />
          </ErrorBoundary>
        </div>

        {/* Right — Decision Panel (35%) */}
        <aside className="w-[35%] overflow-y-auto p-6 space-y-6 bg-background">
          <ErrorBoundary>
            <SimulationPanel />
            <DecisionPanel />
          </ErrorBoundary>
        </aside>
      </div>
    </Shell>
  );
}
