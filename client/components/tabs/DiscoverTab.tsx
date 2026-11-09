"use client";

import { Compass } from "lucide-react";

const PRESET_QUERIES = [
  "High ROE (>25%) and Low Debt (<0.5)",
  "Undervalued P/E (<20) with Strong Profit Growth",
  "High Dividend Yield (>2%) & Defensive",
  "Large Cap Infra & Capital Expenditure Play",
];

interface DiscoverTabProps {
  discoverQuery: string;
  setDiscoverQuery: (v: string) => void;
  discoverEvents: any[];
  setSelectedTicker: (t: string) => void;
  runDiscover: (q?: string) => Promise<void>;
}

export default function DiscoverTab({
  discoverQuery,
  setDiscoverQuery,
  discoverEvents,
  setSelectedTicker,
  runDiscover,
}: DiscoverTabProps) {
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400" />
          Natural Language Stock Screener
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={discoverQuery}
            onChange={(e) => setDiscoverQuery(e.target.value)}
            placeholder="e.g. High ROE with low debt, or Undervalued banking..."
            className="bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-xs text-white flex-1 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={() => runDiscover()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
          >
            Sweep Universe
          </button>
        </div>

        {/* Preset queries */}
        <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
          <span className="text-zinc-500">Presets:</span>
          {PRESET_QUERIES.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setDiscoverQuery(p);
                runDiscover(p);
              }}
              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {discoverEvents
          .filter((e) => e.type === "stock")
          .map((s, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTicker(s.ticker)}
              className="bg-zinc-900 border border-zinc-800 hover:border-blue-500/60 rounded-lg p-4 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{s.ticker}</span>
                <span className="text-xs font-bold text-zinc-200 font-mono">₹{s.price}</span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">{s.name}</p>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                <span>P/E: <strong className="text-zinc-200">{s.pe}x</strong></span>
                <span>ROE: <strong className="text-emerald-400">{s.roe}%</strong></span>
                <span>RSI: <strong className="text-zinc-200">{s.rsi}</strong></span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
