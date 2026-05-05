"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Preprocessing image...",
  "Running inference...",
  "Generating confidence scores...",
];

export function LoadingBrain() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 1050);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="glass-card flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <motion.svg
        width="180"
        height="150"
        viewBox="0 0 180 150"
        fill="none"
        className="drop-shadow-[0_0_34px_rgba(129,140,248,0.7)]"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          d="M58 123C36 118 23 101 25 80C11 64 18 38 39 34C45 16 73 13 85 29C102 9 136 19 138 45C159 51 166 76 153 94C153 117 133 132 112 123C99 136 74 137 58 123Z"
          stroke="#818cf8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse", ease: "easeOut" }}
        />
        <motion.path
          d="M84 31V123M55 58C68 61 77 69 84 82M115 53C102 60 92 70 84 88M51 91C63 88 74 92 84 102M123 88C107 88 94 94 84 108"
          stroke="#c7d2fe"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
      <h2 className="mt-8 text-2xl font-semibold text-white">Running EfficientNet analysis...</h2>
      <div className="mt-3 h-7 overflow-hidden text-sm text-accent-glow">
        <AnimatePresence mode="wait">
          <motion.p
            key={messages[index]}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
