import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import ScenarioLab from "@/pages/ScenarioLab";
import OrgAnalytics from "@/pages/OrgAnalytics";
import DecisionHistory from "@/pages/DecisionHistory";
import Copilot from "@/pages/Copilot";
import NotFound from "@/pages/NotFound";
import PredictiveIntelligence from "@/pages/PredictiveIntelligence";
import PortfolioSimulation from "@/pages/PortfolioSimulation";
import BudgetStrategy from "@/pages/BudgetStrategy";
import MAModeling from "@/pages/MAModeling";
import { DemoOne } from "@/components/DemoOne";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scenario-lab" element={<ScenarioLab />} />
            <Route path="/org-analytics" element={<OrgAnalytics />} />
            <Route path="/decision-history" element={<DecisionHistory />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/predictive-intelligence" element={<PredictiveIntelligence />} />
            <Route path="/portfolio-simulation" element={<PortfolioSimulation />} />
            <Route path="/budget-strategy" element={<BudgetStrategy />} />
            <Route path="/ma-modeling" element={<MAModeling />} />
            <Route path="/demo" element={<DemoOne />} />
            {/* Redirects */}
            <Route path="/analytics" element={<Navigate to="/org-analytics" replace />} />
            <Route path="/history" element={<Navigate to="/decision-history" replace />} />
            <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
