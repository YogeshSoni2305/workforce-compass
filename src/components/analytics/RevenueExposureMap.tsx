"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { TrendingDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueExposureProps {
    data: { name: string; loss: number; dept: string }[];
    loading?: boolean;
}

export function RevenueExposureMap({ data, loading }: RevenueExposureProps) {
    return (
        <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="bg-secondary/5 border-b border-border/30 pb-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground/80">
                        Revenue Exposure Map
                    </CardTitle>
                </div>
                <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
            </CardHeader>
            <CardContent className="p-6 h-[400px]">
                {loading ? (
                    <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
                        <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Calculating Systematic Exposure...</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                fontSize={10}
                                fontWeight="bold"
                                width={100}
                                tick={{ fill: "hsl(var(--muted-foreground))" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "20px",
                                    border: "1px solid hsl(var(--border))",
                                    backgroundColor: "hsl(var(--card))",
                                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                    padding: "12px",
                                }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue Loss"]}
                                cursor={{ fill: "hsl(var(--secondary))", opacity: 0.1 }}
                            />
                            <Bar dataKey="loss" radius={[0, 10, 10, 0]} barSize={24}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.loss > 200000 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.3)"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
