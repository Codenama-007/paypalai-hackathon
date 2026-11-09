/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart } from "lucide-react";

interface TrackRecordTabProps {
  trackRecordData: any | null;
  ledgerData: any | null;
}

export default function TrackRecordTab({ trackRecordData, ledgerData }: TrackRecordTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-base font-bold text-white flex items-center gap-2">
        <PieChart className="w-4 h-4 text-blue-400" />
        Institutional Verdict Track Record &amp; Virtual Ledger
      </h2>

      {/* Ledger KPI Cards */}
      {ledgerData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <span className="text-[11px] text-zinc-400 font-sans">Paper Ledger Capital</span>
            <div className="text-xl font-bold text-white mt-1">₹{ledgerData.total_invested?.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <span className="text-[11px] text-zinc-400 font-sans">Current Ledger Value</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">₹{ledgerData.portfolio_value?.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <span className="text-[11px] text-zinc-400 font-sans">Total P&amp;L</span>
            <div className={`text-xl font-bold mt-1 ${ledgerData.total_pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {ledgerData.total_pnl >= 0 ? "+" : ""}₹{ledgerData.total_pnl?.toLocaleString()} ({ledgerData.pnl_pct}%)
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
            <span className="text-[11px] text-zinc-400 font-sans">Alpha vs NIFTY</span>
            <div className="text-xl font-bold text-blue-400 mt-1">+{ledgerData.alpha_vs_nifty_pct}%</div>
            <span className="text-xs text-zinc-500 font-sans">Win Rate: {trackRecordData?.win_rate_pct}%</span>
          </div>
        </div>
      )}

      {/* Active Verdicts Table */}
      {trackRecordData && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-800 text-zinc-400 font-medium border-b border-zinc-700">
              <tr>
                <th className="p-3">Ticker</th>
                <th className="p-3">Call</th>
                <th className="p-3">Entry CMP</th>
                <th className="p-3">Current CMP</th>
                <th className="p-3">Return</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Status</th>
                <th className="p-3">Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-200">
              {trackRecordData.active_verdicts?.map((v: any, i: number) => (
                <tr key={i} className="hover:bg-zinc-800/40">
                  <td className="p-3 font-bold">{v.ticker}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.verdict === "BUY"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : v.verdict === "SELL"
                          ? "bg-rose-500/20 text-rose-400"
                          : "bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {v.verdict}
                    </span>
                  </td>
                  <td className="p-3 font-mono">₹{v.entry_price}</td>
                  <td className="p-3 font-mono font-bold text-white">₹{v.current_price}</td>
                  <td className={`p-3 font-mono font-semibold ${v.return_pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {v.return_pct >= 0 ? "+" : ""}{v.return_pct}%
                  </td>
                  <td className="p-3 font-mono">{v.confidence}%</td>
                  <td className="p-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        v.outcome === "WIN"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : v.outcome === "LOSS"
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {v.outcome}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400 truncate max-w-xs">{v.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
