"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Sparkles } from "lucide-react";

export function OpenUIHero() {
  return (
    <div className="relative mx-auto flex min-h-[520px] w-full max-w-4xl items-center justify-center overflow-hidden rounded-[32px] border border-accent/20 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.24),rgba(17,17,24,0.72)_46%,rgba(10,10,15,0.95)_72%)] p-6 shadow-[0_0_80px_rgba(99,102,241,0.18)]">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-subtle opacity-35"
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-6 top-10 z-10 glass-card p-4 shadow-[0_0_36px_rgba(129,140,248,0.2)]"
        initial={{ opacity: 0, x: -24, y: 18 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-success" />
          <div>
            <p className="text-xs text-zinc-400">Benchmark accuracy</p>
            <p className="text-lg font-semibold text-white">97.3%</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-6 z-10 glass-card p-4 shadow-[0_0_36px_rgba(129,140,248,0.2)]"
        initial={{ opacity: 0, x: 28, y: 22 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-accent-glow" />
          <div>
            <p className="text-xs text-zinc-400">Doctor-first mode</p>
            <p className="text-lg font-semibold text-white">Bias guarded</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute right-12 top-16 z-10 hidden glass-card p-4 shadow-[0_0_36px_rgba(129,140,248,0.2)] sm:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-warning" />
          <div>
            <p className="text-xs text-zinc-400">Tumor classes</p>
            <p className="text-lg font-semibold text-white">4-way analysis</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="relative z-0 h-72 w-72 rounded-full border border-accent-glow/35 bg-[radial-gradient(circle_at_48%_45%,#f6f7ff_0,#c7d2fe_12%,#818cf8_24%,#312e81_45%,#111118_68%,#050507_100%)] shadow-[0_0_80px_rgba(129,140,248,0.72)] sm:h-96 sm:w-96"
        animate={{
          scale: [1, 1.035, 1],
          boxShadow: [
            "0 0 70px rgba(129,140,248,0.52)",
            "0 0 105px rgba(129,140,248,0.78)",
            "0 0 70px rgba(129,140,248,0.52)",
          ],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-[14%] rounded-full border border-white/20 bg-[radial-gradient(ellipse_at_50%_48%,rgba(255,255,255,0.5),rgba(129,140,248,0.22)_32%,transparent_65%)]" />
        <div className="absolute left-[28%] top-[20%] h-[62%] w-[44%] rounded-[48%] border border-white/25 bg-black/15 blur-[0.2px]" />
      </motion.div>
    </div>
  );
}
