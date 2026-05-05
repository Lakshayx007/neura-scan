"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const labels = ["Upload Scan", "Your Assessment", "AI Analysis"];

type WorkflowStepperProps = {
  currentStep: number;
};

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  return (
    <div className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      {labels.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isComplete = step < currentStep;

        return (
          <div key={label} className="flex flex-1 items-center gap-3">
            <motion.div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                isComplete
                  ? "border-success bg-success text-white"
                  : isActive
                    ? "border-accent bg-accent text-white shadow-[0_0_28px_rgba(99,102,241,0.55)]"
                    : "border-border bg-white/5 text-zinc-500"
              }`}
              animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 1.8, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
            >
              {isComplete ? <Check className="h-4 w-4" /> : step}
            </motion.div>
            <span className={`text-sm font-medium ${isActive ? "text-white" : "text-zinc-400"}`}>
              {label}
            </span>
            {index < labels.length - 1 ? (
              <div className="hidden h-px flex-1 bg-gradient-to-r from-accent/50 to-border sm:block" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
