"use client";

import { motion } from "framer-motion";
import { Activity, Database, Layers3 } from "lucide-react";

const stats = [
  { label: "Accuracy", value: "97.3%", icon: Activity },
  { label: "Scans analyzed", value: "2,870", icon: Database },
  { label: "Tumor classes", value: "4", icon: Layers3 },
];

export function StatsCard() {
  return (
    <div className="glass-card relative overflow-hidden p-5 shadow-[0_0_52px_rgba(99,102,241,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.22),transparent_44%)]" />
      <div className="relative flex flex-col gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.035] p-3"
              initial={{ opacity: 1, y: 0 }}
              whileHover={{ borderColor: "rgba(99, 102, 241, 0.55)" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent-glow">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-zinc-400">{stat.label}</span>
              </div>
              <motion.span
                className="text-xl font-semibold text-white"
                initial={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
              >
                {stat.value}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
