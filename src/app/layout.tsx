import * as React from "react"
import Providers from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import "./../tw-animate.css"
import "./../index.css"

export const metadata = {
    title: "Workforce Compass",
    description: "Workforce Digital Twin Platform",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased font-sans flex min-h-screen flex-col">
                <Providers>
                    {children}
                    <Toaster />
                    <Sonner position="top-right" closeButton richColors />
                </Providers>
            </body>
        </html>
    )
}
