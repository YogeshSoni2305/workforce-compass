"use client"

import { motion } from "framer-motion";
import { FlaskConical, GitCompareArrows, BrainCircuit } from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Simulate Scenarios",
    description:
      "Run Monte Carlo simulations on workforce risk with configurable strategies, seeds, and shock tests.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare Strategies",
    description:
      "Evaluate baseline vs. aggressive vs. conservative approaches with side-by-side KPI breakdowns.",
  },
  {
    icon: BrainCircuit,
    title: "AI Explanations",
    description:
      "Get natural-language strategic recommendations powered by decision intelligence models.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          How it works
        </h2>
        <p className="mb-16 text-center text-muted-foreground">
          Three pillars of workforce decision intelligence.
        </p>
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary">
                <f.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
