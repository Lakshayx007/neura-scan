"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, FileScan, Microscope, ShieldCheck } from "lucide-react";
import { OpenUIHero } from "@/components/OpenUIHero";
import { StatsCard } from "@/components/StatsCard";

const features = [
  {
    title: "Doctor First",
    description: "Doctor records assessment before seeing AI output",
    icon: ShieldCheck,
  },
  {
    title: "4-Class Detection",
    description: "Glioma, Meningioma, Pituitary Tumor, or Healthy",
    icon: Microscope,
  },
  {
    title: "EfficientNet Backbone",
    description: "Deep CNN feature extraction for structured MRI triage",
    icon: BrainCircuit,
  },
];

const steps = [
  "Upload MRI",
  "Record your assessment",
  "See AI analysis",
];

export default function Home() {
  return (
    <main className="bg-transparent text-foreground">
      <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-glow">
              NeuraScan
            </p>
            <h1 className="mt-5 max-w-4xl bg-gradient-to-br from-white via-white to-accent-glow bg-clip-text text-5xl font-semibold tracking-normal text-transparent sm:text-7xl">
              AI-Assisted Brain MRI Diagnosis
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-zinc-300">
              Built to support, not replace, clinical judgment
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/diagnose"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-[0_0_32px_rgba(99,102,241,0.48)] transition hover:bg-accent-glow"
              >
                Upload a Scan
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-accent/60 hover:bg-accent/10"
              >
                See How It Works
              </Link>
              <Link
                href="/diagnose?sample=1"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-accent/45 px-6 text-sm font-semibold text-accent-glow transition hover:bg-accent/10"
              >
                Try Demo
              </Link>
            </div>
          </motion.div>

          <div className="relative">
            <OpenUIHero />
            <motion.div
              className="absolute bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-white/12 bg-[#08080d]/85 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            >
              <div className="flex h-9 items-center gap-2 border-b border-white/10 px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-danger" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-[0.85fr_1fr]">
                <div className="rounded-xl border border-dashed border-accent/35 bg-accent/8 p-4">
                  <FileScan className="h-7 w-7 text-accent-glow" />
                  <p className="mt-4 text-sm font-semibold text-white">Upload MRI scan</p>
                  <p className="mt-1 text-xs text-zinc-400">doctor_notes saved before AI run</p>
                </div>
                <div className="relative min-h-40 overflow-hidden rounded-xl border border-accent/20 bg-[radial-gradient(circle_at_center,#f8fafc_0,#c7d2fe_15%,#818cf8_30%,#312e81_55%,#050507_100%)] shadow-[0_0_42px_rgba(129,140,248,0.46)]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="for-doctors" className="px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="glass-card p-6"
                  initial={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.55)" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                >
                  <Icon className="h-7 w-7 text-accent-glow" />
                  <h2 className="mt-6 text-xl font-semibold text-white">{feature.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
          <StatsCard />
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-glow">
              How It Works
            </p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Three steps, no shortcut around judgment</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                className="glass-card relative min-h-44 p-6"
                initial={{ opacity: 1, x: 0 }}
                whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.55)" }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white shadow-[0_0_28px_rgba(99,102,241,0.55)]">
                  {index + 1}
                </div>
                <h3 className="mt-8 text-xl font-semibold text-white">Step {index + 1}</h3>
                <p className="mt-2 text-zinc-300">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-white">NeuraScan</p>
          <p>Built for i3 Digital Demo</p>
          <Link href="#" className="transition hover:text-white">
            GitHub
          </Link>
        </div>
      </footer>
    </main>
  );
}
