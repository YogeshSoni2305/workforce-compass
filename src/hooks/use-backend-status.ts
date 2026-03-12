"use client"

import { useEffect, useState } from "react"
import { checkBackendHealth, type BackendStatus } from "@/lib/health"

export function useBackendStatus() {
    const [status, setStatus] = useState<BackendStatus>("checking")

    useEffect(() => {
        let cancelled = false

        async function poll() {
            const result = await checkBackendHealth()
            if (!cancelled) setStatus(result)
        }

        poll()
        const interval = setInterval(poll, 15000) // re-check every 15s

        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [])

    return status
}
