"use client";

import React, { useState } from "react";
import {
  Crosshair,
  Compass,
  FileText,
  Layers,
  FlaskConical,
  Download,
  Play,
  CheckCircle2
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/marketData";

export interface SidebarWorkspaceViewsProps {
  viewId: string;
  onSelectStock: (ticker: string) => void;
  onBackToAnalyst: () => void;
}

export const SidebarWorkspaceViews: React.FC<SidebarWorkspaceViewsProps> = ({
  viewId,
  onSelectStock,
  onBackToAnalyst
}) => {
  const [backtestRunning, setBacktestRunning] = useState(false);
  const [backtestDone, setBacktestDone] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // 1. War Room View
  if (viewId === "war_room") {
    return (
      <div className="space-y-3 animate-in fade-in duration-200">
        <div className="p-3 rounded-[8px] bg-[#18221B] border border-[#26C88A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#26C88A]/20 flex items-center justify-center text-[#26C88A]">
              <Crosshair className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[13px] text-[#E7E9EC]">Institutional War Room</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E36B73] text-white text-[8.5px] font-bold uppercase tracking-wider">
                  Live Crisis Monitor
                </span>
              </div>
              <p className="text-[10px] text-[#929CA7]">
                Multi-agent macro risk telemetry, crude oil volatility & interest rate sensitivity
              </p>
            </div>
          </div>
          <button
            onClick={onBackToAnalyst}
            className="px-3 py-1.5 rounded bg-[#101A23] border border-[#26333D] text-[#D6B75E] text-[10.5px] font-semibold hover:border-[#D6B75E]"
          >
            ← Back to Analyst Desk
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-[11px]">
          <div className="p-3.5 rounded-[8px] bg-[#101A23] border border-[#26333D] space-y-2">
            <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider block">
              Macro Risk Factor #1
            </span>
            <p className="font-bold text-[#E7E9EC]">Brent Crude Volatility ($76.4/bbl)</p>
            <p className="text-[10px] text-[#929CA7] leading-relaxed">
              O2C refining cracks sensitive to Red Sea tanker insurance premiums. Reliance margin impact estimated at ±$0.65/bbl.
            </p>
          </div>
          <div className="p-3.5 rounded-[8px] bg-[#101A23] border border-[#26333D] space-y-2">
            <span className="text-[10px] font-bold text-[#26C88A] uppercase tracking-wider block">
              Macro Catalyst #2
            </span>
            <p className="font-bold text-[#E7E9EC]">RBI Monetary Policy Stance</p>
            <p className="text-[10px] text-[#929CA7] leading-relaxed">
              Repo rate neutral shift anticipated in upcoming policy meeting, boosting private capex appetite across heavy industry.
            </p>
          </div>
          <div className="p-3.5 rounded-[8px] bg-[#101A23] border border-[#26333D] space-y-2">
            <span className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wider block">
              Autonomous Agent Debate
            </span>
            <p className="font-bold text-[#E7E9EC]">Valuation vs Earnings Growth</p>
            <p className="text-[10px] text-[#929CA7] leading-relaxed">
              Bull Agent: Retail EBITDA expansion + 5G ARPU.<br />Bear Agent: High capital expenditure drag. Consensus: 78% Bullish.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Portfolio View
  if (viewId === "portfolio") {
    return (
      <div className="space-y-3 animate-in fade-in duration-200">
        <div className="p-3 rounded-[8px] bg-[#101A23] border border-[#26333D] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#929CA7] uppercase tracking-wider block">
              Total Institutional Portfolio AUM
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-bold font-mono text-[#E7E9EC]">{PORTFOLIO_DATA.totalAUM}</span>
              <span className="text-[11px] font-bold font-mono text-[#26C88A]">{PORTFOLIO_DATA.dailyPnL}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-[10px] font-mono text-[#929CA7]">
              <span>Sharpe: {PORTFOLIO_DATA.sharpeRatio}</span> · <span>Beta: {PORTFOLIO_DATA.beta}</span>
            </div>
            <button
              onClick={onBackToAnalyst}
              className="px-3 py-1.5 rounded bg-[#131F29] border border-[#26333D] text-[#D6B75E] text-[10.5px] font-semibold hover:border-[#D6B75E]"
            >
              ← Back to Analyst
            </button>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] overflow-hidden">
          <div className="p-2.5 bg-[#0B1219] border-b border-[#26333D] text-[10px] font-bold uppercase tracking-wider text-[#929CA7] flex justify-between">
            <span>Core Holdings</span>
            <span>Weight & Unrealized Return</span>
          </div>
          <div className="divide-y divide-[#26333D]/60 text-[11px]">
            {PORTFOLIO_DATA.holdings.map((h) => (
              <div
                key={h.ticker}
                onClick={() => onSelectStock(h.ticker)}
                className="p-3 hover:bg-[#131F29] flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold font-mono text-[#E7E9EC] group-hover:text-[#D6B75E]">
                    {h.ticker}
                  </span>
                  <span className="text-[10px] text-[#929CA7] font-mono">
                    {h.shares.toLocaleString()} shares @ ₹{h.avgCost}
                  </span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="font-bold text-[#26C88A]">{h.pnl}</span>
                  <span className="text-[10px] text-[#D6B75E] px-2 py-0.5 rounded bg-[#1E1A11] border border-[#D6B75E]/40">
                    {h.weight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Discover Screener
  if (viewId === "discover") {
    return (
      <div className="space-y-3 animate-in fade-in duration-200">
        <div className="p-3 rounded-[8px] bg-[#101A23] border border-[#26333D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D6B75E]" />
            <span className="font-bold text-[13px] text-[#E7E9EC]">NSE Equity Screener & Discover</span>
          </div>
          <button
            onClick={onBackToAnalyst}
            className="px-3 py-1.5 rounded bg-[#131F29] border border-[#26333D] text-[#D6B75E] text-[10.5px] font-semibold hover:border-[#D6B75E]"
          >
            ← Back to Analyst
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5 text-[10.5px]">
          {["Large Cap Breakouts", "High ROCE (>25%)", "P/E Discount to Peers", "FII Accumulation"].map((pill, idx) => (
            <div key={idx} className="p-3 rounded-[6px] bg-[#0B1219] border border-[#26333D] text-center space-y-1 hover:border-[#D6B75E] cursor-pointer transition-colors">
              <span className="font-bold text-[#E7E9EC] block">{pill}</span>
              <span className="text-[9px] text-[#26C88A]">12 Stocks Qualified</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Brief
  if (viewId === "brief") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="font-bold text-[13px] text-[#E7E9EC]">Daily Morning Institutional Intelligence Brief</h3>
          </div>
          <button
            onClick={onBackToAnalyst}
            className="px-2.5 py-1 rounded bg-[#131F29] border border-[#26333D] text-[#D6B75E] text-[10px]"
          >
            ← Return
          </button>
        </div>
        <p className="text-[11px] text-[#E7E9EC] leading-relaxed">
          Indian equities opened resilient, supported by healthy IT earnings guidance from TCS and robust banking deposit accretion at HDFC Bank. Reliance Industries commands key attention ahead of clean energy project updates. FII flows turned net positive with ₹1,420 Cr pumped into index bellwethers.
        </p>
      </div>
    );
  }

  // 5. Ecosystem
  if (viewId === "ecosystem") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="font-bold text-[13px] text-[#E7E9EC]">Conglomerate Supplier & Competitor Ecosystem</h3>
          </div>
          <button
            onClick={onBackToAnalyst}
            className="px-2.5 py-1 rounded bg-[#131F29] border border-[#26333D] text-[#D6B75E] text-[10px]"
          >
            ← Return
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-[10.5px]">
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D] space-y-1">
            <span className="font-bold text-[#D6B75E] block">Telecom Peers</span>
            <p className="text-[#929CA7]">Jio Infocomm vs Bharti Airtel vs Vodafone Idea</p>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D] space-y-1">
            <span className="font-bold text-[#26C88A] block">Retail Footprint</span>
            <p className="text-[#929CA7]">Reliance Retail vs DMart vs Trent</p>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D] space-y-1">
            <span className="font-bold text-[#45B6A3] block">New Energy Supply</span>
            <p className="text-[#929CA7]">Gigafactory vs Adani Green vs Tata Power</p>
          </div>
        </div>
      </div>
    );
  }

  // 6. Report Generator
  if (viewId === "report") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3.5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="font-bold text-[13px] text-[#E7E9EC]">Institutional Research Report Generator</h3>
          </div>
          <button
            onClick={onBackToAnalyst}
            className="px-2.5 py-1 rounded bg-[#131F29] border border-[#26333D] text-[#D6B75E] text-[10px]"
          >
            ← Return
          </button>
        </div>

        <div className="p-4 rounded bg-[#0B1219] border border-[#26333D] flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-bold text-[12px] text-[#E7E9EC] block">
              Comprehensive 12-Page Equity Initiation Note (PDF)
            </span>
            <p className="text-[10px] text-[#929CA7]">
              Includes discounted cash flow valuation, DCF sensitivity matrix, financial statements, and multi-agent thesis.
            </p>
          </div>
          <button
            onClick={() => setReportGenerated(true)}
            className="px-3.5 py-2 rounded-[5px] bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E] font-bold text-[11px] flex items-center gap-2 hover:bg-[#D6B75E] hover:text-[#080D12] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate PDF Note</span>
          </button>
        </div>

        {reportGenerated && (
          <div className="p-3 rounded bg-[#18221B] border border-[#26C88A] flex items-center justify-between text-[11px] text-[#26C88A] animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Institutional Research Note Compiled Successfully (FinIntel_Equity_Research.pdf)</span>
            </div>
            <button
              onClick={() => {
                const blob = new Blob(["FinIntel Institutional Equity Research Report\n\nStock: RELIANCE INDUSTRIES LTD.\nPrice: Rs. 2,987.40\nTarget: Rs. 3,340\nConsensus: BUY (78% Bullish)\nSEBI Compliance: Educational Research Telemetry"], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "FinIntel_Equity_Report.txt";
                a.click();
              }}
              className="text-[#D6B75E] underline text-[10px] hover:text-white"
            >
              Download Note File
            </button>
          </div>
        )}
      </div>
    );
  }

  // 7. Backtest Engine
  if (viewId === "backtest") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3.5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="font-bold text-[13px] text-[#E7E9EC]">Quantitative Alpha Strategy Backtesting Desk</h3>
          </div>
          <button
            onClick={onBackToAnalyst}
            className="px-2.5 py-1 rounded bg-[#131F29] border border-[#26333D] text-[#D6B75E] text-[10px]"
          >
            ← Return
          </button>
        </div>

        <div className="p-3 rounded bg-[#0B1219] border border-[#26333D] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-[11.5px] text-[#E7E9EC]">Strategy: Multi-Agent Momentum & Valuation Filter</span>
            <p className="text-[10px] text-[#929CA7]">Lookback: 3 Years (2021 - 2024) · Universe: NIFTY 50</p>
          </div>
          <button
            onClick={() => {
              setBacktestRunning(true);
              setTimeout(() => {
                setBacktestRunning(false);
                setBacktestDone(true);
              }, 1200);
            }}
            disabled={backtestRunning}
            className="px-3.5 py-1.5 rounded-[5px] bg-[#26C88A] text-[#080D12] font-bold text-[11px] flex items-center gap-1.5 hover:bg-[#35C98A] transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{backtestRunning ? "Computing Telemetry..." : "Run Quantitative Backtest"}</span>
          </button>
        </div>

        {backtestDone && (
          <div className="grid grid-cols-4 gap-3 text-center animate-in fade-in">
            <div className="p-3 rounded bg-[#18221B] border border-[#26C88A]">
              <span className="text-[9.5px] text-[#929CA7] block">CAGR Alpha</span>
              <span className="text-[14px] font-bold font-mono text-[#26C88A]">+24.8%</span>
            </div>
            <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
              <span className="text-[9.5px] text-[#929CA7] block">Sharpe Ratio</span>
              <span className="text-[14px] font-bold font-mono text-[#D6B75E]">2.32</span>
            </div>
            <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
              <span className="text-[9.5px] text-[#929CA7] block">Max Drawdown</span>
              <span className="text-[14px] font-bold font-mono text-[#E36B73]">-8.4%</span>
            </div>
            <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
              <span className="text-[9.5px] text-[#929CA7] block">Win Rate</span>
              <span className="text-[14px] font-bold font-mono text-[#45B6A3]">68.4%</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
