import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Command } from "lucide-react";

interface QueryBarProps {
    onSend: (query: string) => void;
    loading?: boolean;
}

export function CopilotQueryBar({ onSend, loading }: QueryBarProps) {
    const [query, setQuery] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !loading) {
            onSend(query);
            setQuery("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-[2.5rem] blur opacity-40 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
            <div className="relative flex items-center bg-background border-2 border-border/40 hover:border-primary/40 focus-within:border-primary rounded-[2.2rem] p-2 pr-4 shadow-2xl transition-all duration-300">
                <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center ml-2 border border-border/40">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about critical engineering risks or strategy benchmarks..."
                    disabled={loading}
                    className="flex-1 border-none bg-transparent h-14 text-base focus-visible:ring-0 placeholder:text-muted-foreground/50 font-medium"
                />
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 border border-border/40 text-[10px] font-bold text-muted-foreground">
                        <Command className="h-3 w-3" />
                        <span>Enter</span>
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!query.trim() || loading}
                        className="h-11 w-11 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2 px-4">
                {[
                    "Who is most critical in Engineering?",
                    "What happens if Elena Rodriguez leaves?",
                    "Show me structurally fragile departments",
                    "Optimal strategy for Sales leadership"
                ].map((example) => (
                    <button
                        key={example}
                        type="button"
                        onClick={() => setQuery(example)}
                        className="px-3 py-1.5 rounded-xl border border-border/40 bg-secondary/10 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all active:scale-95"
                    >
                        {example}
                    </button>
                ))}
            </div>
        </form>
    );
}
