import { create } from "zustand";

interface SimulationState {
  selectedEmployee: string | null;
  strategy: string;
  seed: number;
  shock: boolean;
  result: Record<string, any> | null;
  decision: Record<string, any> | null;
  explanation: string;
  loading: boolean;
  setConfig: (data: Partial<SimulationState>) => void;
  setResult: (data: Record<string, any> | null) => void;
  setDecision: (data: Record<string, any> | null) => void;
  setExplanation: (data: string) => void;
  setLoading: (v: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  selectedEmployee: null,
  strategy: "baseline",
  seed: 42,
  shock: false,
  result: null,
  decision: null,
  explanation: "",
  loading: false,
  setConfig: (data) => set(data),
  setResult: (data) => set({ result: data }),
  setDecision: (data) => set({ decision: data }),
  setExplanation: (data) => set({ explanation: data }),
  setLoading: (v) => set({ loading: v }),
}));
