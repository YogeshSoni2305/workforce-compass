"use client"

import React from "react"

interface Props {
    children: React.ReactNode
    fallback?: React.ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[ErrorBoundary]", error, info)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback

            return (
                <div className="flex min-h-[300px] items-center justify-center p-8">
                    <div className="text-center space-y-3 max-w-sm">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <h3 className="text-base font-bold">Simulation engine unavailable.</h3>
                        <p className="text-sm text-muted-foreground">
                            This module could not load. The backend may be offline or a component encountered an
                            unexpected error.
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
