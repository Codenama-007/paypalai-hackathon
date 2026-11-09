"use client";

import React from "react";
import { ResearchTab } from "@/types/dashboard";
import { StockData } from "@/lib/marketData";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  FileText,
  Activity,
  Sparkles,
  BarChart2,
  Scale
} from "lucide-react";

export interface ResearchTabsContentProps {
  activeTab: ResearchTab;
  stock: StockData;
}

export const ResearchTabsContent: React.FC<ResearchTabsContentProps> = ({
  activeTab,
  stock
}) => {
  if (activeTab === "overview") return null;

  if (activeTab === "financials") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3.5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="text-[12px] font-bold text-[#E7E9EC]">
              {stock.ticker} Financial Statements & Capital Efficiency
            </h3>
          </div>
          <span className="text-[9px] text-[#A98B45] font-mono">Consolidated (FY24 / TTM)</span>
        </div>

        <div className="grid grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">Gross Revenue</span>
            <span className="text-[13px] font-bold font-mono text-[#E7E9EC]">{stock.financials.revenue}</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">EBITDA</span>
            <span className="text-[13px] font-bold font-mono text-[#26C88A]">{stock.financials.ebitda}</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">Net Profit</span>
            <span className="text-[13px] font-bold font-mono text-[#E7E9EC]">{stock.financials.netProfit}</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">Debt / Equity</span>
            <span className="text-[13px] font-bold font-mono text-[#D6B75E]">{stock.financials.deRatio}</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">ROCE</span>
            <span className="text-[13px] font-bold font-mono text-[#45B6A3]">{stock.financials.roce}</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "valuation") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="text-[12px] font-bold text-[#E7E9EC]">
              {stock.ticker} Relative Valuation & Fair Value Band
            </h3>
          </div>
          <span className="text-[9.5px] text-[#26C88A] font-semibold">DCF Model: Intrinsic Fair Value ~ ₹3,240</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D] space-y-1">
            <span className="text-[9.5px] text-[#929CA7] block">P/E vs 5-Year Historical</span>
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[13px] font-bold text-[#E7E9EC]">{stock.peTTM}x</span>
              <span className="text-[10px] text-[#D6B75E]">Median: 27.2x</span>
            </div>
            <span className="text-[9px] text-[#26C88A]">Trading at 3% discount to historical median</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D] space-y-1">
            <span className="text-[9.5px] text-[#929CA7] block">EV / EBITDA</span>
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[13px] font-bold text-[#E7E9EC]">13.8x</span>
              <span className="text-[10px] text-[#929CA7]">Sector: 14.5x</span>
            </div>
            <span className="text-[9px] text-[#26C88A]">Favorable risk/reward on operating cash</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D] space-y-1">
            <span className="text-[9.5px] text-[#929CA7] block">Price to Book (P/B)</span>
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[13px] font-bold text-[#E7E9EC]">2.34x</span>
              <span className="text-[10px] text-[#929CA7]">RoE: 14.2%</span>
            </div>
            <span className="text-[9px] text-[#D6B75E]">Supported by retail tangible book value</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "ownership") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="text-[12px] font-bold text-[#E7E9EC]">
              {stock.ticker} Institutional Shareholding Pattern
            </h3>
          </div>
          <span className="text-[9px] text-[#929CA7]">SEBI Shareholding Filing Q2</span>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">Promoters</span>
            <span className="text-[14px] font-bold font-mono text-[#D6B75E]">{stock.ownership.promoter}</span>
            <span className="text-[8.5px] text-[#26C88A] block mt-0.5">0.0% Pledged</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">FII Holdings</span>
            <span className="text-[14px] font-bold font-mono text-[#45B6A3]">{stock.ownership.fii}</span>
            <span className="text-[8.5px] text-[#26C88A] block mt-0.5">+42 bps QoQ</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">DII Holdings</span>
            <span className="text-[14px] font-bold font-mono text-[#C084FC]">{stock.ownership.dii}</span>
            <span className="text-[8.5px] text-[#26C88A] block mt-0.5">+65 bps QoQ</span>
          </div>
          <div className="p-3 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[9.5px] text-[#929CA7] block">Public & Retail</span>
            <span className="text-[14px] font-bold font-mono text-[#929CA7]">{stock.ownership.public}</span>
            <span className="text-[8.5px] text-[#929CA7] block mt-0.5">Stable</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "news") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="text-[12px] font-bold text-[#E7E9EC]">
              {stock.ticker} Live NSE Filings & Exchange Catalysts
            </h3>
          </div>
          <span className="text-[9px] text-[#26C88A] font-mono">Verified Exchange Feed</span>
        </div>

        <div className="space-y-2">
          {stock.news.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded bg-[#0B1219] border border-[#26333D] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-[#5F6D7E]">{item.time}</span>
                  <span className="text-[8.5px] font-semibold px-1.5 py-0.2 rounded bg-[#131F29] text-[#D6B75E]">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#E7E9EC]">{item.title}</p>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#18221B] text-[#26C88A] shrink-0">
                {item.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "sentiment") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="text-[12px] font-bold text-[#E7E9EC]">
              {stock.ticker} Institutional Sentiment Barometer
            </h3>
          </div>
          <span className="text-[11px] font-bold font-mono text-[#26C88A]">{stock.sentiment}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-[#929CA7]">
            <span>Bearish (0%)</span>
            <span>Neutral (50%)</span>
            <span>Bullish (100%)</span>
          </div>
          <div className="h-2 rounded-full bg-[#1C2731] overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#D6B75E] to-[#26C88A] rounded-full transition-all duration-500"
              style={{ width: `${stock.sentimentScore}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1 text-[10px]">
          <div className="p-2.5 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[#929CA7] block">News Sentiment</span>
            <span className="font-bold text-[#26C88A] text-[11px]">84% Positive</span>
          </div>
          <div className="p-2.5 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[#929CA7] block">FII Capital Flows</span>
            <span className="font-bold text-[#D6B75E] text-[11px]">Net Buyer (₹840 Cr)</span>
          </div>
          <div className="p-2.5 rounded bg-[#0B1219] border border-[#26333D]">
            <span className="text-[#929CA7] block">Analyst Consensus</span>
            <span className="font-bold text-[#26C88A] text-[11px]">28 Buy / 4 Hold</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "thesis") {
    return (
      <div className="rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3.5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="text-[12px] font-bold text-[#E7E9EC]">
              {stock.ticker} Multi-Agent Institutional Investment Thesis
            </h3>
          </div>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[#231A2D] text-[#C084FC] border border-[#402B56]">
            FinAnalyst Multi-Agent Synthesis
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10.5px]">
          {/* Bull Points */}
          <div className="p-3 rounded bg-[#18221B] border border-[#26C88A]/30 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#26C88A]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Key Growth Catalysts (Bull Case)</span>
            </div>
            <ul className="space-y-1.5 text-[#E7E9EC]">
              {stock.bullPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-[#26C88A] shrink-0 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bear Points */}
          <div className="p-3 rounded bg-[#2B1417] border border-[#E36B73]/30 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#E36B73]">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Risk Factors & Headwinds (Bear Case)</span>
            </div>
            <ul className="space-y-1.5 text-[#E7E9EC]">
              {stock.bearPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-[#E36B73] shrink-0 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
