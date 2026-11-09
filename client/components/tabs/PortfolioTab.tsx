"use client";

import { CheckCircle2 } from "lucide-react";

interface PortfolioTabProps {
  portfolioData: any | null;
  portfolioEvents: any[];
  portfolioGate: any | null;
  auditPortfolio: () => Promise<void>;
  resumePortfolio: (decision: string) => Promise<void>;
}

export default function PortfolioTab({
  portfolioData,
  portfolioGate,
  auditPortfolio,
  resumePortfolio,
}: PortfolioTabProps) {
  if (!portfolioData) return null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <span className="text-[11px] text-zinc-400">Total Portfolio Value</span>
          <div className="text-xl font-bold text-white mt-1">₹{portfolioData.total_value?.toLocaleString()}</div>
          <span
            className={`text-xs font-semibold ${portfolioData.total_pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}
          >
            {portfolioData.total_pnl >= 0 ? "+" : ""}₹{portfolioData.total_pnl?.toLocaleString()} ({portfolioData.total_pnl_pct}%)
          </span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <span className="text-[11px] text-zinc-400">Portfolio Weighted Beta</span>
          <div className="text-xl font-bold text-zinc-200 mt-1">{portfolioData.portfolio_beta}</div>
          <span className="text-[11px] text-zinc-500">Systematic Market Risk</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <span className="text-[11px] text-zinc-400">Weighted P/E Multiple</span>
          <div className="text-xl font-bold text-zinc-200 mt-1">{portfolioData.portfolio_pe}x</div>
          <span className="text-[11px] text-zinc-500">Valuation Benchmark</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-zinc-400">Risk Score</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{portfolioData.risk_score} / 10</div>
          </div>
          <button
            onClick={auditPortfolio}
            className="mt-2 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium"
          >
            Run Risk Audit
          </button>
        </div>
      </div>

      {/* Rebalance Gate */}
      {portfolioGate && (
        <div className="bg-amber-950/40 border border-amber-500/80 rounded-lg p-4 space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase">{portfolioGate.title}</div>
          <div className="text-xs text-zinc-200">{portfolioGate.proposed_action}</div>
          <div className="flex gap-3">
            <button
              onClick={() => resumePortfolio("approve")}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve Rebalance
            </button>
            <button
              onClick={() => resumePortfolio("reject")}
              className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-800/80 text-zinc-400 font-medium border-b border-zinc-700/60">
            <tr>
              <th className="p-3">Stock</th>
              <th className="p-3">Sector</th>
              <th className="p-3">Shares</th>
              <th className="p-3">Avg Buy</th>
              <th className="p-3">CMP</th>
              <th className="p-3">Value</th>
              <th className="p-3">P&amp;L</th>
              <th className="p-3">Weight</th>
              <th className="p-3">Beta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-200 font-mono">
            {portfolioData.holdings?.map((h: any, i: number) => (
              <tr key={i} className="hover:bg-zinc-800/40">
                <td className="p-3 font-bold font-sans">{h.ticker}</td>
                <td className="p-3 font-sans text-zinc-400">{h.sector}</td>
                <td className="p-3">{h.shares}</td>
                <td className="p-3">₹{h.buy_price}</td>
                <td className="p-3 font-bold text-white">₹{h.current_price}</td>
                <td className="p-3">₹{h.value.toLocaleString()}</td>
                <td className={`p-3 font-semibold ${h.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {h.pnl >= 0 ? "+" : ""}₹{h.pnl} ({h.pnl_pct}%)
                </td>
                <td className="p-3">{h.weight_pct}%</td>
                <td className="p-3">{h.beta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
