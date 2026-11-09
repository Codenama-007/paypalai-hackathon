/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Scale, Play, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Users } from "lucide-react";

interface WarRoomTabProps {
  selectedTicker: string;
  warEvents: any[];
  warPendingGate: any | null;
  warRunning: boolean;
  startWarRoom: () => Promise<void>;
  resumeWarRoom: (decision: string) => Promise<void>;
}

export default function WarRoomTab({
  selectedTicker,
  warEvents,
  warPendingGate,
  warRunning,
  startWarRoom,
  resumeWarRoom,
}: WarRoomTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            War Room Multi-Agent Debate Desk
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Planner assigns 4 domain specialists (Quant, Fundamental, News, Risk) in parallel, triggers Bull vs Bear arguments, and Judge rules with human approval gate.
          </p>
        </div>
        <button
          onClick={startWarRoom}
          disabled={warRunning}
          className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow transition-colors flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5" />
          {warRunning ? "Debating..." : `Convene War Room on ${selectedTicker}`}
        </button>
      </div>

      {/* Approval Gate */}
      {warPendingGate && (
        <div className="bg-amber-950/40 border-2 border-amber-500/80 rounded-lg p-5 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="flex-1 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {warPendingGate.title}
              </h3>
              <p className="text-xs text-zinc-200">{warPendingGate.message}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => resumeWarRoom("approve")}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Verdict &amp; Deploy ₹1,00,000 Paper Tranche
                </button>
                <button
                  onClick={() => resumeWarRoom("reject")}
                  className="px-4 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debate Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warEvents.map((evt, idx) => {
          if (evt.type === "specialist") {
            return (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-1.5">
                <div className="text-blue-400 font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {evt.role}
                </div>
                <p className="text-zinc-300 leading-relaxed font-sans">{evt.text}</p>
              </div>
            );
          }
          if (evt.type === "debate") {
            const isBull = evt.stance === "BULL";
            return (
              <div
                key={idx}
                className={`md:col-span-1 rounded p-4 text-xs space-y-1.5 border ${
                  isBull
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                    : "bg-rose-950/20 border-rose-500/40 text-rose-200"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {isBull ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  )}
                  {evt.advocate} ({evt.stance})
                </div>
                <p className="leading-relaxed font-sans">{evt.argument}</p>
              </div>
            );
          }
          if (evt.type === "verdict") {
            return (
              <div key={idx} className="md:col-span-2 bg-zinc-900 border-2 border-blue-500/60 rounded p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Judge Ruling ({evt.ticker})
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Confidence: {evt.confidence}%
                  </span>
                </div>
                <div className="text-xl font-bold text-white flex items-center gap-3">
                  <span>Recommendation: {evt.recommendation}</span>
                  <span className="text-emerald-400 text-sm font-semibold">Target Upside: +{evt.target_upside_pct}%</span>
                  <span className="text-zinc-400 text-sm font-semibold">Stop Loss: ₹{evt.stop_loss}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{evt.text}</p>
              </div>
            );
          }
          if (evt.type === "final") {
            return (
              <div key={idx} className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded p-4 text-xs whitespace-pre-line text-zinc-300">
                {evt.text}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
