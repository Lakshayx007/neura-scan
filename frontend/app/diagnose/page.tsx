"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileImage, TriangleAlert } from "lucide-react";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { LoadingBrain } from "@/components/LoadingBrain";
import { UploadDropzone } from "@/components/UploadDropzone";
import { WorkflowStepper } from "@/components/WorkflowStepper";
import { DEMO_MODE, DiagnosisApiResponse, diagnoseImage } from "@/lib/api";
import { sampleMriFile } from "@/lib/sample-mri";

const doctorOptions = [
  "Likely Glioma",
  "Likely Meningioma",
  "Pituitary Tumor",
  "Appears Healthy",
  "Uncertain",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function normalize(value: string) {
  return value.toLowerCase().replace("likely ", "").replace("appears healthy", "no_tumor").replaceAll(" ", "_");
}

export default function DiagnosePage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [doctorDiagnosis, setDoctorDiagnosis] = useState("Uncertain");
  const [doctorConfidence, setDoctorConfidence] = useState(60);
  const [result, setResult] = useState<DiagnosisApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState("");

  const canContinue = Boolean(file);
  const canSubmit = Boolean(doctorNotes.trim() && doctorDiagnosis && !isLoading);

  const agreement = useMemo(() => {
    if (!result) return false;
    return normalize(doctorDiagnosis) === normalize(result.prediction);
  }, [doctorDiagnosis, result]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("sample")) return;

    sampleMriFile().then((sample) => {
      setFile(sample);
      setPreviewUrl(URL.createObjectURL(sample));
      setDoctorNotes("Demo case: focal T2/FLAIR hyperintensity with mild surrounding edema. No midline shift observed.");
      setDoctorDiagnosis("Likely Glioma");
      setDoctorConfidence(72);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileSelect(nextFile: File) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setResult(null);
    setToast("");
  }

  async function runAnalysis() {
    if (!file) return;
    setIsLoading(true);
    setToast("");

    const response = await diagnoseImage(
      file,
      `${doctorNotes}\nDoctor confidence: ${doctorConfidence}%`,
      doctorDiagnosis,
    );

    setIsLoading(false);

    if (!response) {
      setToast("AI analysis failed. Check backend connection or try Demo Mode.");
      return;
    }

    setResult(response);
    setStep(3);
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {DEMO_MODE ? (
          <div className="mb-5 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-glow">
            Running in Demo Mode — connect backend for live inference
          </div>
        ) : null}

        {toast ? (
          <div className="mb-5 rounded-xl border border-danger/35 bg-danger/12 px-4 py-3 text-sm text-red-200">
            {toast}
          </div>
        ) : null}

        <WorkflowStepper currentStep={step} />

        <div className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.section
                key="step-1"
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.36, ease: "easeOut" }}
                className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-glow">
                    Step 1 — Upload Scan
                  </p>
                  <h1 className="mt-4 text-4xl font-semibold text-white">Upload the MRI scan</h1>
                  <p className="mt-4 max-w-xl text-zinc-400">
                    Drag-and-drop accepts .jpg, .png, and .dcm files. The app keeps the visual review and metadata visible before moving forward.
                  </p>
                </div>

                <div className="grid gap-5">
                  <UploadDropzone onFileSelect={handleFileSelect}>
                    {previewUrl ? (
                      <div className="relative z-10 w-full">
                        <div className="glass-card mx-auto max-w-lg overflow-hidden p-3 shadow-[0_0_70px_rgba(129,140,248,0.24)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewUrl}
                            alt="Uploaded MRI preview"
                            className="h-80 w-full rounded-xl bg-black object-contain shadow-[0_0_48px_rgba(129,140,248,0.35)]"
                          />
                        </div>
                      </div>
                    ) : undefined}
                  </UploadDropzone>

                  {file ? (
                    <div className="glass-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <FileImage className="h-5 w-5 text-accent-glow" />
                        <div>
                          <p className="text-sm font-semibold text-white">{file.name}</p>
                          <p className="text-xs text-zinc-400">{formatBytes(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={!canContinue}
                        onClick={() => setStep(2)}
                        className="h-11 rounded-lg bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-glow disabled:cursor-not-allowed disabled:bg-zinc-700"
                      >
                        Continue
                      </button>
                    </div>
                  ) : null}
                </div>
              </motion.section>
            ) : null}

            {step === 2 ? (
              <motion.section
                key="step-2"
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.36, ease: "easeOut" }}
                className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-glow">
                    Step 2 — Doctor&apos;s Assessment
                  </p>
                  <h1 className="mt-4 text-4xl font-semibold text-white">
                    Record your clinical assessment before AI analysis
                  </h1>
                  <p className="mt-4 max-w-xl text-warning">
                    Your notes are saved before AI runs — ensuring independent judgment
                  </p>
                  {previewUrl ? (
                    <motion.div
                      className="mt-8 overflow-hidden rounded-2xl border border-accent/25 bg-surface/70 p-3"
                      animate={
                        isLoading
                          ? { boxShadow: ["0 0 28px rgba(99,102,241,0.2)", "0 0 70px rgba(129,140,248,0.62)", "0 0 28px rgba(99,102,241,0.2)"] }
                          : {}
                      }
                      transition={{ duration: 1.4, repeat: isLoading ? Infinity : 0, ease: "easeInOut" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="MRI preview" className="h-64 w-full rounded-xl object-contain" />
                    </motion.div>
                  ) : null}
                </div>

                <div className="glass-card p-5">
                  {isLoading ? (
                    <LoadingBrain />
                  ) : (
                    <div className="grid gap-6">
                      <label className="grid gap-3">
                        <span className="text-sm font-semibold text-white">What do you observe in this scan?</span>
                        <textarea
                          value={doctorNotes}
                          onChange={(event) => setDoctorNotes(event.target.value)}
                          className="min-h-44 resize-none rounded-xl border border-border bg-background/70 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-accent focus:ring-4 focus:ring-accent/10"
                          placeholder="What do you observe in this scan?"
                        />
                      </label>

                      <fieldset>
                        <legend className="text-sm font-semibold text-white">Preliminary diagnosis</legend>
                        <div className="mt-3 grid gap-2">
                          {doctorOptions.map((option) => (
                            <label
                              key={option}
                              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-zinc-300 transition hover:border-accent/40"
                            >
                              <input
                                type="radio"
                                name="doctorDiagnosis"
                                value={option}
                                checked={doctorDiagnosis === option}
                                onChange={(event) => setDoctorDiagnosis(event.target.value)}
                                className="h-4 w-4 accent-indigo-500"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </fieldset>

                      <label className="grid gap-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-white">Doctor confidence</span>
                          <span className="text-accent-glow">{doctorConfidence}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={doctorConfidence}
                          onChange={(event) => setDoctorConfidence(Number(event.target.value))}
                          className="w-full accent-indigo-500"
                        />
                      </label>

                      <button
                        type="button"
                        disabled={!canSubmit}
                        onClick={runAnalysis}
                        className="h-12 rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(99,102,241,0.42)] transition hover:bg-accent-glow disabled:cursor-not-allowed disabled:bg-zinc-700"
                      >
                        Submit & Run AI Analysis
                      </button>
                    </div>
                  )}
                </div>
              </motion.section>
            ) : null}

            {step === 3 && result ? (
              <motion.section
                key="step-3"
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.36, ease: "easeOut" }}
                className="grid gap-6"
              >
                <div
                  className={`glass-card flex items-center gap-3 p-4 ${
                    agreement ? "text-success" : "text-warning"
                  }`}
                >
                  {agreement ? <CheckCircle2 className="h-5 w-5" /> : <TriangleAlert className="h-5 w-5" />}
                  <span className="text-sm font-semibold">
                    Agreement Indicator: {agreement ? "Doctor and AI agree" : "Doctor and AI differ"}
                  </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="glass-card p-5">
                    <h2 className="text-2xl font-semibold text-white">Doctor&apos;s assessment</h2>
                    <div className="mt-5 grid gap-4 text-sm leading-6 text-zinc-300">
                      <p>
                        Preliminary diagnosis: <span className="font-semibold text-white">{doctorDiagnosis}</span>
                      </p>
                      <p>
                        Confidence: <span className="font-semibold text-white">{doctorConfidence}%</span>
                      </p>
                      <p className="rounded-xl border border-border bg-background/55 p-4">{doctorNotes}</p>
                    </div>
                    {previewUrl ? (
                      <div className="mt-8 overflow-hidden rounded-2xl border border-accent/20 bg-black/35 p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Submitted MRI preview"
                          className="h-72 w-full rounded-xl object-contain"
                        />
                      </div>
                    ) : null}
                    <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-zinc-400">
                      <div className="rounded-xl border border-border bg-white/[0.03] p-3">
                        <p>Case mode</p>
                        <p className="mt-1 font-semibold text-accent-glow">Doctor-first</p>
                      </div>
                      <div className="rounded-xl border border-border bg-white/[0.03] p-3">
                        <p>AI release</p>
                        <p className="mt-1 font-semibold text-accent-glow">After notes</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <DiagnosisResult
                      prediction={result.prediction}
                      confidence={result.confidence}
                      all_scores={result.all_scores}
                      doctorNotes={doctorNotes}
                      doctorDiagnosis={doctorDiagnosis}
                      scanPreviewUrl={previewUrl ?? undefined}
                    />
                  </div>
                </div>

                <p className="rounded-xl border border-warning/25 bg-warning/10 p-4 text-sm leading-6 text-amber-100">
                  This tool assists clinical decision-making and does not replace professional medical judgment
                </p>
              </motion.section>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
