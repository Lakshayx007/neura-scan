"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Download,
  Gauge,
  GitCompareArrows,
  ScanSearch,
  TriangleAlert,
} from "lucide-react";
import { downloadDoctorReport, downloadPatientReport } from "@/lib/reports";

type DiagnosisResultProps = {
  prediction: string;
  confidence: number;
  all_scores: Record<string, number>;
  doctorNotes: string;
  doctorDiagnosis: string;
  scanPreviewUrl?: string;
};

const labelMap: Record<string, string> = {
  glioma: "Glioma",
  Glioma: "Glioma",
  meningioma: "Meningioma",
  Meningioma: "Meningioma",
  pituitary_tumor: "Pituitary Tumor",
  "Pituitary Tumor": "Pituitary Tumor",
  no_tumor: "No Tumor",
  "No Tumor": "No Tumor",
};

const toneMap: Record<string, { text: string; border: string; bg: string; glow: string }> = {
  glioma: {
    text: "text-rose-200",
    border: "border-rose-400/25",
    bg: "bg-rose-400/10",
    glow: "rgba(251,113,133,0.22)",
  },
  Glioma: {
    text: "text-rose-200",
    border: "border-rose-400/25",
    bg: "bg-rose-400/10",
    glow: "rgba(251,113,133,0.22)",
  },
  meningioma: {
    text: "text-amber-200",
    border: "border-amber-400/25",
    bg: "bg-amber-400/10",
    glow: "rgba(245,158,11,0.18)",
  },
  Meningioma: {
    text: "text-amber-200",
    border: "border-amber-400/25",
    bg: "bg-amber-400/10",
    glow: "rgba(245,158,11,0.18)",
  },
  pituitary_tumor: {
    text: "text-yellow-100",
    border: "border-yellow-300/20",
    bg: "bg-yellow-300/10",
    glow: "rgba(234,179,8,0.16)",
  },
  no_tumor: {
    text: "text-emerald-200",
    border: "border-emerald-400/25",
    bg: "bg-emerald-400/10",
    glow: "rgba(16,185,129,0.18)",
  },
};

const barGradients: Record<string, string> = {
  glioma: "linear-gradient(90deg, #fda4af, #818cf8)",
  Glioma: "linear-gradient(90deg, #fda4af, #818cf8)",
  meningioma: "linear-gradient(90deg, #fcd34d, #818cf8)",
  Meningioma: "linear-gradient(90deg, #fcd34d, #818cf8)",
  pituitary_tumor: "linear-gradient(90deg, #fde68a, #818cf8)",
  no_tumor: "linear-gradient(90deg, #6ee7b7, #818cf8)",
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace("likely ", "")
    .replace("appears healthy", "no_tumor")
    .replaceAll(" ", "_");
}

function rationaleFor(prediction: string, margin: number, nextBest: string) {
  const label = labelMap[prediction] ?? prediction;
  const shared = [
    `Dominant ${label} probability separates from ${nextBest} by ${Math.round(margin * 100)} percentage points.`,
    "Doctor assessment was locked before inference, preserving an independent clinical baseline.",
  ];

  if (normalize(prediction) === "glioma") {
    return [
      "Activation pattern concentrates around asymmetric high-signal tissue and edema-like boundaries.",
      "Texture contrast and lesion-contour features aligned most strongly with the glioma class.",
      ...shared,
    ];
  }

  if (normalize(prediction) === "meningioma") {
    return [
      "Peripheral mass-margin cues and compact enhancement-like texture increased meningioma likelihood.",
      "Class activation favors boundary structure over diffuse tissue patterning.",
      ...shared,
    ];
  }

  if (normalize(prediction) === "pituitary_tumor") {
    return [
      "Midline sellar-region patterning and compact localized signal increased pituitary likelihood.",
      "The model weighted focal central anatomy higher than broad hemispheric texture.",
      ...shared,
    ];
  }

  return [
    "No dominant tumor-class activation exceeded the healthy-reference pattern.",
    "Probability mass remained low across lesion classes after normalization.",
    ...shared,
  ];
}

export function DiagnosisResult({
  prediction,
  confidence,
  all_scores,
  doctorNotes,
  doctorDiagnosis,
  scanPreviewUrl,
}: DiagnosisResultProps) {
  const [isExporting, setIsExporting] = useState<"patient" | "doctor" | null>(null);
  const predictionLabel = labelMap[prediction] ?? prediction;
  const confidencePercent = Math.round(confidence * 100);
  const circumference = 2 * Math.PI * 44;
  const doctorMatches = normalize(doctorDiagnosis) === normalize(prediction);
  const tone = toneMap[prediction] ?? {
    text: "text-indigo-100",
    border: "border-accent/30",
    bg: "bg-accent/10",
    glow: "rgba(129,140,248,0.22)",
  };
  const rankedScores = Object.entries(all_scores).sort((a, b) => b[1] - a[1]);
  const secondBest = rankedScores[1] ?? rankedScores[0];
  const margin = Math.max(0, (rankedScores[0]?.[1] ?? confidence) - (secondBest?.[1] ?? 0));
  const nextBestLabel = labelMap[secondBest?.[0] ?? ""] ?? "next class";
  const rationale = rationaleFor(prediction, margin, nextBestLabel);
  const uncertainty = confidence >= 0.8 ? "Low" : confidence >= 0.62 ? "Moderate" : "High";
  const reportPayload = {
    prediction,
    confidence,
    allScores: all_scores,
    doctorNotes,
    doctorDiagnosis,
    scanPreviewUrl,
  };

  async function exportPatientReport() {
    setIsExporting("patient");
    await downloadPatientReport(reportPayload);
    setIsExporting(null);
  }

  async function exportDoctorReport() {
    setIsExporting("doctor");
    await downloadDoctorReport(reportPayload);
    setIsExporting(null);
  }

  return (
    <div className="grid gap-5">
      <div
        className="glass-card relative overflow-hidden p-5"
        style={{ boxShadow: `0 0 56px ${tone.glow}` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.16),transparent_42%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone.border} ${tone.bg} ${tone.text}`}
            >
              Suggested: {predictionLabel}
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-white">AI Evidence Summary</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              Model output is shown after the doctor&apos;s preliminary assessment has been recorded.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Metric icon={<Gauge className="h-4 w-4" />} label="Margin" value={`+${Math.round(margin * 100)} pts`} />
              <Metric icon={<GitCompareArrows className="h-4 w-4" />} label="Next best" value={nextBestLabel} />
              <Metric icon={<Activity className="h-4 w-4" />} label="Uncertainty" value={uncertainty} />
            </div>
          </div>

          <div className="relative h-32 w-32">
            <svg viewBox="0 0 110 110" className="h-32 w-32 -rotate-90">
              <circle cx="55" cy="55" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
              <motion.circle
                cx="55"
                cy="55"
                r="44"
                stroke="#818cf8"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - confidence) }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold text-white">{confidencePercent}%</span>
              <span className="text-xs text-zinc-400">AI Confidence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Why the model suggested this</h3>
            <p className="mt-1 text-sm text-zinc-500">Explainability cues from the demo inference pipeline</p>
          </div>
          <BrainCircuit className="h-5 w-5 text-accent-glow" />
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-64 overflow-hidden rounded-2xl border border-accent/20 bg-black">
            {scanPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={scanPreviewUrl} alt="Model evidence map" className="h-64 w-full object-contain opacity-80" />
            ) : null}
            <motion.div
              className="absolute left-[42%] top-[22%] h-28 w-28 rounded-full bg-rose-300/30 blur-2xl"
              animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.9, 1.12, 0.9] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute left-[30%] top-[52%] h-24 w-36 rounded-full bg-accent/30 blur-2xl"
              animate={{ opacity: [0.25, 0.65, 0.25], scale: [1, 1.08, 1] }}
              transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-xs text-zinc-300 backdrop-blur">
              <span className="flex items-center gap-2">
                <ScanSearch className="h-4 w-4 text-accent-glow" />
                Activation overlay
              </span>
              <span className="text-accent-glow">prototype view</span>
            </div>
          </div>

          <div className="grid gap-3">
            {rationale.map((item, index) => (
              <motion.div
                key={item}
                className="rounded-xl border border-border bg-white/[0.035] p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              >
                <p className="text-sm leading-6 text-zinc-300">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold text-white">Confidence Distribution</h3>
        <div className="mt-5 space-y-4">
          {rankedScores.map(([key, value], index) => {
            const label = labelMap[key] ?? key;
            const isPrediction = normalize(key) === normalize(prediction);
            return (
              <div key={key}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className={isPrediction ? "font-semibold text-white" : "text-zinc-400"}>{label}</span>
                  <span className={isPrediction ? "font-semibold text-white" : "text-zinc-400"}>
                    {Math.round(value * 100)}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: isPrediction
                        ? (barGradients[key] ?? "linear-gradient(90deg, #818cf8, #6366f1)")
                        : "linear-gradient(90deg, rgba(148,163,184,0.36), rgba(129,140,248,0.28))",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(value * 100)}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Human-AI Comparison</h3>
            <div className="mt-4 grid gap-3 text-sm text-zinc-300">
              <p>Doctor&apos;s preliminary: <span className="text-white">{doctorDiagnosis}</span></p>
              <p>AI says: <span className="text-white">{predictionLabel}</span></p>
              <p className="text-zinc-500">Notes: {doctorNotes}</p>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
              doctorMatches ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
            }`}
          >
            {doctorMatches ? <CheckCircle2 className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
            {doctorMatches ? "Match" : "Review difference"}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">PDF Reports</h3>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Generate a patient-facing approved diagnostic report or a physician-facing AI evidence report.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={exportPatientReport}
              disabled={isExporting !== null}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-background transition hover:bg-indigo-100 disabled:cursor-wait disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {isExporting === "patient" ? "Preparing..." : "Patient PDF"}
            </button>
            <button
              type="button"
              onClick={exportDoctorReport}
              disabled={isExporting !== null}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-accent/35 px-4 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent/10 disabled:cursor-wait disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {isExporting === "doctor" ? "Preparing..." : "Doctor AI PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-white/[0.035] p-3">
      <div className="text-accent-glow">{icon}</div>
      <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
