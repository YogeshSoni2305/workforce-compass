export const API_BASE = "http://localhost:8000";

export async function fetchOrgData() {
  const res = await fetch(`${API_BASE}/`);
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
