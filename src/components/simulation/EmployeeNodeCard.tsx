import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { cn } from "@/lib/utils";
import { useSimulationStore } from "@/store/simulationStore";
import {
    Building2,
    UserCircle,
    Briefcase,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Zap,
    ShieldAlert,
    Target
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const EmployeeNodeCard = memo(({ data, selected }: NodeProps) => {
    const isSelected = selected;
    const { name, role, department, risk, isCollapsed, onToggleCollapse, salary, skills, fragility, centrality } = data;

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "group relative flex flex-col w-[240px] bg-card border rounded-xl shadow-sm transition-all duration-300",
                        isSelected
                            ? "border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]"
                            : "border-border hover:border-border/80 hover:shadow-md"
                    )}>
                        {/* Header with Icon and Risk */}
                        <div className="flex items-center justify-between p-3 border-b border-border/50 bg-secondary/10">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center border border-border/50">
                                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <RiskBadge risk={risk} />
                            </div>
                            {onToggleCollapse && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleCollapse();
                                    }}
                                    className="p-1 hover:bg-secondary rounded-md transition-colors"
                                >
                                    {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-3 space-y-2.5">
                            <div>
                                <h3 className="text-sm font-bold leading-none tracking-tight text-foreground truncate">{name}</h3>
                                <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                                    <Briefcase className="h-3 w-3" />
                                    <span className="text-[11px] font-medium truncate uppercase tracking-tight">{role}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span className="text-[11px] font-medium truncate">{department}</span>
                            </div>
                        </div>

                        {/* Handles */}
                        <Handle
                            type="target"
                            position={Position.Top}
                            className="!bg-border !w-3 !h-1 !rounded-full !border-none"
                        />
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            className="!bg-border !w-3 !h-1 !rounded-full !border-none"
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-0 border-none bg-transparent shadow-none" sideOffset={12}>
                    <div className="w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-secondary/20 p-4 border-b border-border">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Subject Analytics</p>
                            <p className="text-sm font-bold">{name}</p>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <DollarSign className="h-3 w-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-tighter">Salary</span>
                                    </div>
                                    <p className="text-xs font-bold font-mono">${(salary || 120000).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <ShieldAlert className="h-3 w-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-tighter">Fragility</span>
                                    </div>
                                    <p className="text-xs font-bold">{(fragility || risk || 0.4).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Zap className="h-3 w-3" />
                                    <span className="text-[9px] font-bold uppercase tracking-tighter">Skills</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {(skills || ["Leadership", "Eng", "Strategic"]).map((s: string) => (
                                        <span key={s} className="px-1.5 py-0.5 bg-primary/5 text-primary text-[9px] font-bold rounded border border-primary/10">{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                <div className="flex items-center gap-1.5">
                                    <Target className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Centrality</span>
                                </div>
                                <span className="text-xs font-bold">{(centrality || 0.85).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
});

EmployeeNodeCard.displayName = "EmployeeNodeCard";
