export const API_BASE = "http://localhost:8000";

export async function fetchOrgData() {
  const res = await fetch(`${API_BASE}/org/state`);
  return res.json();
}

export async function simulateScenario(payload: {
  employee_id: string | null;
  strategy: string;
  seed: number;
  shock_test: boolean;
}) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function compareStrategies(payload: {
  employee_id: string | null;
  seed: number;
}) {
  const res = await fetch(`${API_BASE}/decision/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function explainDecision(payload: {
  employee_id: string | null;
  seed: number;
}) {
  const res = await fetch(`${API_BASE}/decision/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// Phase 6: Predictive Intelligence
export async function fetchAttritionPrediction(seed: number = 42) {
  const res = await fetch(`${API_BASE}/predict/attrition?seed=${seed}`);
  return res.json();
}

export async function predictHiringImpact(payload: {
  target_roles: string[];
  hiring_delay_weeks: number;
  ramp_up_curve: number;
}) {
  const res = await fetch(`${API_BASE}/predict/hiring-impact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function predictTrajectory(payload: {
  months: number;
  attrition_multiplier: number;
  seed: number;
}) {
  const res = await fetch(`${API_BASE}/predict/trajectory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// Phase 8: Decision OS
export async function simulatePortfolio(payload: {
  project_ids: string[];
  priorities: Record<string, number>;
  seed: number;
}) {
  const res = await fetch(`${API_BASE}/portfolio/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function allocateBudget(payload: {
  adjustment_percent: number;
  hiring_freeze: boolean;
  training_investment: number;
  seed: number;
}) {
  const res = await fetch(`${API_BASE}/budget/allocate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function strategicInvestment(payload: {
  type: "training" | "automation" | "redundancy";
  amount: number;
  seed: number;
}) {
  const res = await fetch(`${API_BASE}/strategy/investment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function mergeOrgs(payload: {
  other_org_data: Record<string, unknown>;
  merge_type: "aggressive" | "gradual" | "selective";
  seed: number;
}) {
  const res = await fetch(`${API_BASE}/strategy/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
