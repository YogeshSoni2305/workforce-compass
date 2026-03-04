import { create } from "zustand";

export type Strategy = "baseline" | "aggressive" | "conservative" | "immediate" | "delayed" | "no_replace";

export interface KPIResult {
  execution: {
    total_duration: number;
    critical_path_impact: number;
    task_completion_pct: number;
  };
  financial: {
    revenue_delta: number;
    profit_projection: number;
    cost_of_delay: number;
  };
  risk: {
    fragility_index: number;
    stability_score: number;
    bus_factor_impact: number;
  };
  organization: {
    headcount_change: number;
    replacement_delay: number;
    productivity_curve: number;
  };
  governance: {
    model_version: string;
    seed: number;
    shock_mode: boolean;
    timestamp: string;
  };
}

export interface DeptRisk {
  name: string;
  avgFragility: number;
  maxFragility: number;
  employeeCount: number;
  criticalCount: number;
  totalRevenueExposure: number;
  topFragileEmployees: string[];
}

export interface BusFactorEntry {
  id: string;
  name: string;
  role: string;
  dept: string;
  fragility: number;
  centrality: number;
  revenueImpact: number;
  compositeScore: number;
}

export interface BatchRunResult {
  employee_id: string;
  bestStrategy: Strategy;
  profitDelta: number;
  stability: number;
  risk: number;
}

export interface SimulationRun {
  id: string;
  employee_id: string;
  strategy: Strategy;
  result: KPIResult;
  timestamp: string;
}

export interface ComparisonResult {
  strategies: Record<Strategy, KPIResult>;
  best_strategy: Strategy;
  recommendation: {
    strategy: Strategy;
    confidence: number;
    summary: string;
    reasoning: string;
    risks: string[];
  };
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  employee_id: string;
  employee_name: string;
  strategy_tested: Strategy[];
  best_strategy: Strategy;
  comparison_matrix: Record<string, KPIResult>;
  profit_delta: number;
  stability_score: number;
  fragility_score: number;
  model_version: string;
  seed: number;
  shock_mode: boolean;
  llm_summary: {
    recommendation: string;
    confidence: number;
    latency_ms: number;
  };
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  structured?: {
    employees?: string[];
    profitDelta?: number;
    stabilityDelta?: number;
    riskDelta?: number;
    recommendedStrategy?: Strategy;
    confidence?: number;
  };
}

interface SimulationState {
  // Config
  selectedEmployee: string | null;
  strategy: Strategy;
  seed: number;
  shock: boolean;

  // Results
  result: KPIResult | null;
  history: Array<{
    id: string;
    employee_id: string;
    strategy: Strategy;
    result: KPIResult;
    timestamp: string;
  }>;
  comparisonResult: ComparisonResult | null;
  explanation: string | null;

  // UI State
  loading: boolean;

  // Analytics Phase 3
  departmentRiskData: DeptRisk[];
  busFactorRanking: BusFactorEntry[];
  revenueExposureData: Array<{ name: string; loss: number; dept: string }>;
  batchSimulationResults: BatchRunResult[];
  analyticsLoading: {
    heatmap: boolean;
    busFactor: boolean;
    revenue: boolean;
    batch: boolean;
  };

  // Governance Phase 4
  persistentHistory: HistoryRecord[];
  activeSnapshot: HistoryRecord | null;

  // Copilot Phase 5
  copilotHistory: CopilotMessage[];
  copilotLoading: boolean;

  // Predictive Intelligence Phase 6
  attritionPredictions: Array<{ employee_id: string; name: string; probability: number; risk_band: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }>;
  trajectoryData: Array<{ month: number; revenue: number; stability: number; fragility: number }>;
  predictiveLoading: boolean;

  // Platform Expansion Phase 8
  portfolioResults: { portfolio_revenue: number; delay_exposure: number; conflict_heatmap: Array<{ week: number; density: number }> } | null;
  budgetImpact: { revenue_delta_percent: number; stability_delta: number; attrition_delta: number; financial_summary: { new_run_rate: number; efficiency_gain: number } } | null;
  investmentMetrics: { type: string; metrics: { fragility_delta: number; stability_delta: number } } | null;
  mergeAnalysis: { combined_fragility: number; revenue_projection: number; stability_score: number; overlap_count: number } | null;
  expansionLoading: boolean;

  // Actions
  setConfig: (config: Partial<Pick<SimulationState, "selectedEmployee" | "strategy" | "seed" | "shock">>) => void;
  setResult: (result: KPIResult | null) => void;
  setComparisonResult: (result: ComparisonResult | null) => void;
  setExplanation: (explanation: string | null) => void;
  setLoading: (loading: boolean) => void;
  addHistoryEntry: (entry: SimulationState["history"][0]) => void;
  resetSimulation: () => void;

  // Analytics Actions
  setAnalyticsData: (data: Partial<Pick<SimulationState, "departmentRiskData" | "busFactorRanking" | "revenueExposureData" | "batchSimulationResults">>) => void;
  setAnalyticsLoading: (key: keyof SimulationState["analyticsLoading"], status: boolean) => void;

  // Governance Actions
  addPersistentRecord: (record: HistoryRecord) => void;
  setActiveSnapshot: (snapshot: HistoryRecord | null) => void;
  replayHistory: (id: string) => void;

  // Copilot Actions
  addCopilotMessage: (msg: CopilotMessage) => void;
  setCopilotLoading: (loading: boolean) => void;

  // Predictive Actions
  setPredictiveData: (data: Partial<Pick<SimulationState, "attritionPredictions" | "trajectoryData">>) => void;
  setPredictiveLoading: (loading: boolean) => void;

  // Expansion Actions
  setExpansionData: (data: Partial<Pick<SimulationState, "portfolioResults" | "budgetImpact" | "investmentMetrics" | "mergeAnalysis">>) => void;
  setExpansionLoading: (loading: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  selectedEmployee: null,
  strategy: "baseline",
  seed: 42,
  shock: false,
  result: null,
  history: [],
  comparisonResult: null,
  explanation: null,
  loading: false,

  // Analytics
  departmentRiskData: [],
  busFactorRanking: [],
  revenueExposureData: [],
  batchSimulationResults: [],
  analyticsLoading: {
    heatmap: false,
    busFactor: false,
    revenue: false,
    batch: false
  },

  // Governance
  persistentHistory: [],
  activeSnapshot: null,

  // Copilot
  copilotHistory: [],
  copilotLoading: false,

  // Predictive Intelligence
  attritionPredictions: [],
  trajectoryData: [],
  predictiveLoading: false,

  // Platform Expansion
  portfolioResults: null,
  budgetImpact: null,
  investmentMetrics: null,
  mergeAnalysis: null,
  expansionLoading: false,

  setConfig: (config) => set((state) => ({ ...state, ...config })),
  setResult: (result) => set({ result }),
  setComparisonResult: (comparisonResult) => set({ comparisonResult }),
  setExplanation: (explanation) => set({ explanation }),
  setLoading: (loading) => set({ loading }),
  addHistoryEntry: (entry) => set((state) => ({
    history: [entry, ...state.history].slice(0, 5)
  })),
  resetSimulation: () => set({
    result: null,
    explanation: null,
    comparisonResult: null,
    selectedEmployee: null
  }),

  setAnalyticsData: (data) => set((state) => ({ ...state, ...data })),
  setAnalyticsLoading: (key, status) => set((state) => ({
    analyticsLoading: { ...state.analyticsLoading, [key]: status }
  })),

  addPersistentRecord: (record) => set((state) => ({
    persistentHistory: [record, ...state.persistentHistory]
  })),
  setActiveSnapshot: (activeSnapshot) => set({ activeSnapshot }),
  replayHistory: (id) => {
    const record = get().persistentHistory.find(h => h.id === id);
    if (record) {
      set({
        selectedEmployee: record.employee_id,
        strategy: record.best_strategy,
        seed: record.seed,
        shock: record.shock_mode,
        result: record.comparison_matrix[record.best_strategy]
      });
    }
  },

  addCopilotMessage: (msg) => set((state) => ({
    copilotHistory: [...state.copilotHistory, msg]
  })),
  setCopilotLoading: (copilotLoading) => set({ copilotLoading }),

  setPredictiveData: (data) => set((state) => ({ ...state, ...data })),
  setPredictiveLoading: (predictiveLoading) => set({ predictiveLoading }),

  setExpansionData: (data) => set((state) => ({ ...state, ...data })),
  setExpansionLoading: (expansionLoading) => set({ expansionLoading }),
}));
