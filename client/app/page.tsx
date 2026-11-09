"use client";

import Link from "next/link";
import { Shield, ArrowRight, CheckCircle2, Cpu, BarChart3, Lock } from "lucide-react";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Marketing Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/20">
              FI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">FinIntel</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Agentic Equity Desk
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-600/20"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 sm:py-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" /> Institutional Indian Equity Intelligence
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Agentic Equity Research for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">NSE Markets</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Autonomous AI multi-agent workflows designed specifically for institutional and professional research on Indian equities, backed by human-in-the-loop approval gates and mandatory compliance pipelines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 text-base"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 font-medium px-6 py-3 rounded-xl transition-colors border border-zinc-700/60 text-base"
              >
                Sign In to Desk
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 border-t border-zinc-800/60 bg-zinc-900/20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-white mb-12">
              Engineered for Precision &amp; Regulatory Compliance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Multi-Agent Architecture</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Specialised agent nodes autonomously evaluate fundamentals, technical indicators, and qualitative news streams with strict Python-computed arithmetic.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Human Approval Gates</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Autonomous agents pause execution before committing decisions or issuing final institutional opinions, ensuring complete oversight and compliance.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Deterministic Metrics</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Sharpe, beta, volatility, and stress testing are strictly calculated in the backend numerical engine—eliminating LLM hallucination in financial calculations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
