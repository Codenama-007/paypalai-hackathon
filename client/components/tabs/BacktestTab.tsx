"use client";

import { TrendingUp } from "lucide-react";

interface BacktestTabProps {
  backtestMode: string;
  setBacktestMode: (v: string) => void;
  backtestAmount: number;
  setBacktestAmount: (v: number) => void;
  backtestYears: number;
  setBacktestYears: (v: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backtestData: any | null;
  runBacktest: () => Promise<void>;
}

export default function BacktestTab({
  backtestMode,
  setBacktestMode,
  backtestAmount,
  setBacktestAmount,
  backtestYears,
  setBacktestYears,
  backtestData,
  runBacktest,
}: BacktestTabProps) {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Deterministic SIP / Lumpsum Backtest Engine
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] text-zinc-400">Mode</label>
            <select
              value={backtestMode}
              onChange={(e) => setBacktestMode(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
            >
              <option value="sip">Monthly SIP</option>
              <option value="lumpsum">One-time Lumpsum</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-zinc-400">Amount (₹)</label>
            <input
              type="number"
              value={backtestAmount}
              onChange={(e) => setBacktestAmount(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400">Horizon (Years)</label>
            <input
              type="number"
              value={backtestYears}
              onChange={(e) => setBacktestYears(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={runBacktest}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
            >
              Run Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {backtestData && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
              <span className="text-[11px] text-zinc-400 font-sans">Total Invested</span>
              <div className="text-xl font-bold text-white mt-1">₹{backtestData.total_invested?.toLocaleString()}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
              <span className="text-[11px] text-zinc-400 font-sans">Final Portfolio Corpus</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">₹{backtestData.final_value?.toLocaleString()}</div>
              <span className="text-xs text-emerald-400 font-semibold font-sans">+{backtestData.portfolio_cagr_pct}% CAGR</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
              <span className="text-[11px] text-zinc-400 font-sans">NIFTY 50 Corpus</span>
              <div className="text-xl font-bold text-zinc-300 mt-1">₹{backtestData.nifty_final_value?.toLocaleString()}</div>
              <span className="text-xs text-zinc-400 font-sans">+{backtestData.nifty_cagr_pct}% CAGR</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
              <span className="text-[11px] text-zinc-400 font-sans">Alpha vs NIFTY</span>
              <div className="text-xl font-bold text-blue-400 mt-1">+{backtestData.alpha_generated_pct}%</div>
              <span className="text-[11px] text-zinc-500 font-sans">Sharpe: {backtestData.sharpe_ratio}</span>
            </div>
          </div>

          {/* Timeline Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-800 text-zinc-400 border-b border-zinc-700">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Invested</th>
                  <th className="p-3">Portfolio Value</th>
                  <th className="p-3">Nifty Benchmark</th>
                  <th className="p-3">Alpha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {backtestData.timeline?.map((row: { month: number; invested: number; portfolio_value: number; nifty_value: number; alpha: number }, i: number) => (
                  <tr key={i} className="hover:bg-zinc-800/50">
                    <td className="p-3">Month {row.month}</td>
                    <td className="p-3">₹{row.invested.toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-400">₹{row.portfolio_value.toLocaleString()}</td>
                    <td className="p-3 text-zinc-400">₹{row.nifty_value.toLocaleString()}</td>
                    <td className="p-3 text-blue-400">+₹{row.alpha.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
