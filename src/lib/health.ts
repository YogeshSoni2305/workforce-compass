"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export type BackendStatus = "connected" | "offline" | "checking";

export async function checkBackendHealth(): Promise<BackendStatus> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(`${API_BASE}/org/state`, {
            method: "GET",
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return res.ok ? "connected" : "offline";
    } catch {
        return "offline";
    }
}
