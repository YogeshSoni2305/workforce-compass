import React, { useState, useEffect } from "react";
import { Search, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSimulationStore } from "@/store/simulationStore";
import { fetchOrgData } from "@/lib/api";
import { cn } from "@/lib/utils";

export function EmployeeSearchInput() {
    const { selectedEmployee, setConfig } = useSimulationStore();
    const [query, setQuery] = useState("");
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [results, setResults] = useState<{ id: string; name: string }[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchOrgData().then(data => {
            const list = data.nodes.map((n: any) => ({
                id: n.id,
                name: n.data?.label || n.id
            }));
            setEmployees(list);
        });
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = employees.filter(e =>
                e.name.toLowerCase().includes(query.toLowerCase()) ||
                e.id.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setResults(filtered);
            setShowDropdown(true);
        } else {
            setResults([]);
            setShowDropdown(false);
        }
    }, [query, employees]);

    return (
        <div className="relative w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search workforce subject..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 h-10 rounded-xl bg-secondary/30 border-border/50 transition-all focus:ring-primary/20"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
                    >
                        <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                )}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {results.map((e) => (
                        <button
                            key={e.id}
                            onClick={() => {
                                setConfig({ selectedEmployee: e.id });
                                setQuery("");
                                setShowDropdown(false);
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/80 transition-colors text-left border-b border-border/40 last:border-0",
                                selectedEmployee === e.id && "bg-primary/5"
                            )}
                        >
                            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-bold truncate">{e.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{e.id}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
