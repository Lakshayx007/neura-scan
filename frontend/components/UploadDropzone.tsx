"use client";

import { DragEvent, InputHTMLAttributes, ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { FileImage, UploadCloud } from "lucide-react";

type UploadDropzoneProps = {
  onFileSelect: (file: File) => void;
  children?: ReactNode;
  accept?: InputHTMLAttributes<HTMLInputElement>["accept"];
};

export function UploadDropzone({
  onFileSelect,
  children,
  accept = ".jpg,.jpeg,.png,.dcm,image/jpeg,image/png,application/dicom",
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <motion.label
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className="group relative flex min-h-[360px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-accent/45 bg-surface/70 p-6 text-center backdrop-blur-xl transition hover:border-accent-glow hover:bg-accent/8"
      animate={{
        boxShadow: isDragging
          ? "0 0 60px rgba(129,140,248,0.42)"
          : "0 0 34px rgba(99,102,241,0.12)",
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 bg-grid-subtle opacity-20"
        animate={{ opacity: isDragging ? 0.45 : 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-8 rounded-[28px] border border-accent/20"
        animate={{ scale: isDragging ? 1.02 : [1, 1.01, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {children ?? (
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            className="flex h-24 w-24 items-center justify-center rounded-3xl border border-accent/35 bg-accent/12 text-accent-glow shadow-[0_0_50px_rgba(99,102,241,0.35)]"
            animate={{ y: [0, -8, 0], rotate: [0, -2, 2, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FileImage className="h-10 w-10" />
          </motion.div>
          <div className="mt-6 flex items-center gap-2 text-lg font-semibold text-white">
            <UploadCloud className="h-5 w-5 text-accent-glow" />
            Drop MRI scan here
          </div>
          <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
            Drag and drop a JPG, PNG, or DICOM export, or click to browse.
          </p>
        </div>
      )}
      <input
        className="sr-only"
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </motion.label>
  );
}
