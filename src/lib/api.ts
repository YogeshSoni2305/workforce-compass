export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function safeFetch<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn(`[API] Failed: ${url}`, err);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export async function fetchOrgData() {
  return safeFetch(`${API_BASE}/org/state`, undefined, { nodes: [], edges: [] });
}

export async function simulateScenario(payload: {
  employee_id: string | null;
  strategy: string;
  seed: number;
  shock_test: boolean;
}) {
  return safeFetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function compareStrategies(payload: {
  employee_id: string | null;
  seed: number;
}) {
  return safeFetch(`${API_BASE}/decision/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function explainDecision(payload: {
  employee_id: string | null;
  seed: number;
}) {
  return safeFetch(`${API_BASE}/decision/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Phase 6: Predictive Intelligence
export async function fetchAttritionPrediction(seed: number = 42) {
  return safeFetch(`${API_BASE}/predict/attrition?seed=${seed}`, undefined, []);
}

export async function predictHiringImpact(payload: {
  target_roles: string[];
  hiring_delay_weeks: number;
  ramp_up_curve: number;
}) {
  return safeFetch(`${API_BASE}/predict/hiring-impact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function predictTrajectory(payload: {
  months: number;
  attrition_multiplier: number;
  seed: number;
}) {
  return safeFetch(`${API_BASE}/predict/trajectory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, []);
}

// Phase 8: Decision OS
export async function simulatePortfolio(payload: {
  project_ids: string[];
  priorities: Record<string, number>;
  seed: number;
}) {
  return safeFetch(`${API_BASE}/portfolio/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function allocateBudget(payload: {
  adjustment_percent: number;
  hiring_freeze: boolean;
  training_investment: number;
  seed: number;
}) {
  return safeFetch(`${API_BASE}/budget/allocate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function strategicInvestment(payload: {
  type: "training" | "automation" | "redundancy";
  amount: number;
  seed: number;
}) {
  return safeFetch(`${API_BASE}/strategy/investment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function mergeOrgs(payload: {
  other_org_data: Record<string, unknown>;
  merge_type: "aggressive" | "gradual" | "selective";
  seed: number;
}) {
  return safeFetch(`${API_BASE}/strategy/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
