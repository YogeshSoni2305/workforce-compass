import React from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Search, Filter, Calendar } from "lucide-react";
import { Strategy } from "@/store/simulationStore";

interface FilterProps {
    onSearch: (term: string) => void;
    onStrategyFilter: (strategy: Strategy | "all") => void;
    onRiskFilter: (range: string) => void;
}

export function DecisionFilters({ onSearch, onStrategyFilter, onRiskFilter }: FilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-4 bg-secondary/10 p-4 rounded-2xl border border-border/40">
            <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search employee name..."
                    className="pl-10 h-10 border-border/60 bg-background/50 rounded-xl"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <Select onValueChange={(v) => onStrategyFilter(v as Strategy | "all")}>
                    <SelectTrigger className="w-[160px] h-10 border-border/60 bg-background/50 rounded-xl">
                        <SelectValue placeholder="All Strategies" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                        <SelectItem value="all">All Strategies</SelectItem>
                        <SelectItem value="baseline">Baseline</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                        <SelectItem value="no_replace">No Replace</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={onRiskFilter}>
                    <SelectTrigger className="w-[160px] h-10 border-border/60 bg-background/50 rounded-xl">
                        <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        <SelectItem value="high">Critical (0.6+)</SelectItem>
                        <SelectItem value="medium">Elevated (0.3-0.6)</SelectItem>
                        <SelectItem value="low">Stable (0-0.3)</SelectItem>
                    </SelectContent>
                </Select>

                <div className="h-10 px-3 flex items-center gap-2 border border-border/60 bg-background/50 rounded-xl text-xs font-medium text-muted-foreground cursor-pointer hover:bg-secondary/20 transition-colors">
                    <Calendar className="h-4 w-4" />
                    <span>Date Range</span>
                </div>
            </div>
        </div>
    );
}
