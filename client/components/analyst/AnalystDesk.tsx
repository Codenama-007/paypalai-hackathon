"use client";

import React, { useState } from "react";
import { BarChart2, BarChart3, Sliders, Compass, X } from "lucide-react";
import {
  SegmentMode,
  ResearchTab,
  Timeframe,
  MetricsTab,
  ApprovalStatus
} from "@/types/dashboard";
import { StockOverviewCard } from "./StockOverviewCard";
import { StockChart } from "./StockChart";
import { KeyMetrics } from "./KeyMetrics";
import { AnalysisStream } from "./AnalysisStream";
import { InsightSummary } from "./InsightSummary";
import { ApprovalGate } from "./ApprovalGate";
import { ComplianceDisclaimer } from "@/components/shared/ComplianceDisclaimer";
import { ResearchTabsContent } from "./ResearchTabsContent";
import { SidebarWorkspaceViews } from "./SidebarWorkspaceViews";
import { STOCKS } from "@/lib/marketData";

export interface AnalystDeskProps {
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  activeSegment: SegmentMode;
  onSegmentChange: (seg: SegmentMode) => void;
  activeTab: ResearchTab;
  onTabChange: (tab: ResearchTab) => void;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  metricsTab: MetricsTab;
  onMetricsTabChange: (tab: MetricsTab) => void;
  approvalStatus: ApprovalStatus;
  onApprove: () => void;
  onRedirect: () => void;
  onStop: () => void;
  ticker?: string;
  onSelectStock?: (t: string) => void;
  onOpenSearch?: () => void;
}

const SEGMENTS: Array<{ id: SegmentMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "single", label: "Single Stock", icon: BarChart2 },
  { id: "sector", label: "Sector", icon: BarChart3 },
  { id: "compare", label: "Compare", icon: Sliders },
  { id: "screener", label: "Screener", icon: Compass }
];

export const AnalystDesk: React.FC<AnalystDeskProps> = ({
  activeNav = "analyst",
  onNavChange,
  activeSegment,
  onSegmentChange,
  activeTab,
  onTabChange,
  timeframe,
  onTimeframeChange,
  metricsTab,
  onMetricsTabChange,
  approvalStatus,
  onApprove,
  onRedirect,
  onStop,
  ticker = "RELIANCE",
  onSelectStock,
  onOpenSearch
}) => {
  const stock = STOCKS[ticker] || STOCKS["RELIANCE"];
  const [compareModal, setCompareModal] = useState(false);

  return (
    <main
      className="fin-workspace flex-1 h-full overflow-y-auto p-2.5 space-y-2 bg-[#0B1219]"
      style={{
        flex: "1 1 0%",
        height: "100%",
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#0B1219",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}
    >
      {/* Header Row: Title & Subtitle + View Mode Switcher */}
      <div
        className="fin-workspace-header flex items-center justify-between"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="w-5 h-5 flex items-center justify-center text-[#D6B75E]" style={{ width: 20, height: 20, color: "#D6B75E" }}>
            <BarChart3 className="w-5 h-5" style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-[#E7E9EC] leading-tight" style={{ fontSize: "16px", fontWeight: 700, color: "#E7E9EC", margin: 0, lineHeight: 1.15 }}>
              Analyst
            </h1>
            <p className="text-[10px] text-[#929CA7]" style={{ fontSize: "10px", color: "#929CA7", margin: 0 }}>
              AI-powered equity research, deep analysis, and actionable insights.
            </p>
          </div>
        </div>

        {/* 4-Way Segmented View Controls */}
        <div
          className="fin-switcher-pill h-[28px] p-0.5 rounded-[6px] bg-[#101A23] border border-[#26333D] flex items-center gap-0.5 text-[10px] font-medium"
          style={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          {SEGMENTS.map((seg) => {
            const SegIcon = seg.icon;
            const isSegActive = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => {
                  onSegmentChange(seg.id);
                  if (seg.id === "compare") setCompareModal(true);
                  if (seg.id === "screener" && onNavChange) onNavChange("discover");
                }}
                className={`fin-switcher-btn h-full px-2.5 rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSegActive
                    ? "active bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E] font-semibold"
                    : "text-[#929CA7] hover:text-[#E7E9EC]"
                }`}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <SegIcon className="w-3 h-3" />
                <span>{seg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* If an alternate sidebar navigation item was selected, render its dedicated workspace */}
      {activeNav !== "analyst" ? (
        <SidebarWorkspaceViews
          viewId={activeNav}
          onSelectStock={(t) => {
            if (onSelectStock) onSelectStock(t);
            if (onNavChange) onNavChange("analyst");
          }}
          onBackToAnalyst={() => onNavChange && onNavChange("analyst")}
        />
      ) : (
        <>
          {/* Stock Search & Header Card with Tabs */}
          <StockOverviewCard
            activeTab={activeTab}
            onTabChange={onTabChange}
            ticker={stock.ticker}
            companyName={stock.name}
            exchange={stock.exchange}
            price={stock.price}
            priceChange={stock.priceChange}
            onOpenSearch={onOpenSearch}
          />

          {/* Conditional View: Overview Tab vs Alternate Research Tabs */}
          {activeTab === "overview" ? (
            <>
              {/* Candlestick Chart & Key Metrics Section (8:4 Grid) */}
              <div className="fin-chart-metrics-row grid grid-cols-12 gap-2.5" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10 }}>
                <StockChart
                  timeframe={timeframe}
                  onTimeframeChange={onTimeframeChange}
                  currentPrice={stock.price}
                  ticker={stock.ticker}
                />
                <KeyMetrics
                  activeTab={metricsTab}
                  onTabChange={onMetricsTabChange}
                  metrics={[
                    { label: "Market Cap", val: stock.marketCap },
                    { label: "P/E (TTM)", val: stock.peTTM },
                    { label: "EPS (TTM)", val: stock.epsTTM },
                    { label: "Dividend Yield", val: stock.yield },
                    { label: "52W High", val: stock.high52W },
                    { label: "52W Low", val: stock.low52W }
                  ]}
                  aboutText={stock.about}
                />
              </div>

              {/* Analysis Stream & Insight Summary Section (7:5 Grid) */}
              <div className="fin-stream-summary-row grid grid-cols-12 gap-2.5" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10 }}>
                <AnalysisStream />
                <InsightSummary
                  summaryText={`${stock.ticker} shows short-term strength with a ${stock.priceChange.split(" ")[1]} intraday gain, supported by positive news flow and stable fundamentals. Long-term outlook remains favorable on the back of energy transition and retail growth.`}
                />
              </div>
            </>
          ) : (
            <ResearchTabsContent activeTab={activeTab} stock={stock} />
          )}

          {/* Approval Gate Full-Width Card */}
          <ApprovalGate
            status={approvalStatus}
            onApprove={onApprove}
            onRedirect={onRedirect}
            onStop={onStop}
          />

          {/* SEBI Mandatory Compliance Disclaimer */}
          <ComplianceDisclaimer />
        </>
      )}

      {/* Compare Modal */}
      {compareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[650px] rounded-[10px] bg-[#101A23] border border-[#26333D] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#26333D] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D6B75E]" />
                <h3 className="text-[13px] font-bold text-[#E7E9EC]">
                  Peer Comparison: {stock.ticker} vs Sector Bellwethers
                </h3>
              </div>
              <button
                onClick={() => setCompareModal(false)}
                className="w-5 h-5 rounded flex items-center justify-center text-[#929CA7] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-[#26333D] text-[#929CA7]">
                    <th className="py-2">Stock</th>
                    <th>Price</th>
                    <th>P/E</th>
                    <th>Market Cap</th>
                    <th>ROCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26333D]/50 text-[#E7E9EC]">
                  {Object.values(STOCKS).map((s) => (
                    <tr
                      key={s.ticker}
                      onClick={() => {
                        if (onSelectStock) onSelectStock(s.ticker);
                        setCompareModal(false);
                      }}
                      className="hover:bg-[#131F29] cursor-pointer"
                    >
                      <td className="py-2.5 font-bold text-[#D6B75E]">{s.ticker}</td>
                      <td>{s.price}</td>
                      <td>{s.peTTM}x</td>
                      <td>{s.marketCap}</td>
                      <td className="text-[#26C88A]">{s.financials.roce}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#26333D]">
              <button
                onClick={() => setCompareModal(false)}
                className="px-3 py-1.5 rounded bg-[#131F29] border border-[#26333D] text-[#929CA7] hover:text-white text-[11px]"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AnalystDesk;
