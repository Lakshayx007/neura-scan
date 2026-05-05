import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Brain } from "lucide-react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NeuraScan",
  description: "AI-assisted brain MRI diagnostic support for physicians.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full bg-background antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/78 backdrop-blur-xl">
          <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
            <Link href="/" className="flex items-center gap-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/35 bg-accent/15 shadow-[0_0_28px_rgba(99,102,241,0.35)]">
                <Brain aria-hidden="true" className="h-5 w-5 text-accent-glow" strokeWidth={2} />
              </span>
              <span className="text-base font-semibold tracking-normal">NeuraScan</span>
            </Link>

            <div className="hidden items-center gap-7 text-sm font-medium text-zinc-400 md:flex">
              <Link href="/#for-doctors" className="transition hover:text-white">
                For Doctors
              </Link>
              <Link href="/#how-it-works" className="transition hover:text-white">
                How It Works
              </Link>
            </div>

            <Link
              href="/diagnose"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white shadow-[0_0_26px_rgba(99,102,241,0.5)] transition hover:bg-accent-glow hover:shadow-[0_0_34px_rgba(129,140,248,0.62)]"
            >
              Launch App
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
