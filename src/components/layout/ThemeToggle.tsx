"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Don't render until mounted — prevents hydration mismatch between
    // server (renders default theme) and client (reads actual stored theme)
    if (!mounted) {
        return (
            <Button
                variant="outline"
                size="icon"
                className="rounded-full w-9 h-9 border-border/60 hover:bg-secondary opacity-0"
                aria-hidden
                tabIndex={-1}
                disabled
            >
                <Moon className="h-4 w-4" />
            </Button>
        )
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-full w-9 h-9 border-border/60 hover:bg-secondary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    )
}
