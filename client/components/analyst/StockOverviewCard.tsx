"use client";

import React from "react";
import { ResearchTab } from "@/types/dashboard";
import { TickerSelector } from "@/components/layout/TickerSelector";

export interface StockOverviewCardProps {
  activeTab: ResearchTab;
  onTabChange: (tab: ResearchTab) => void;
  ticker?: string;
  companyName?: string;
  exchange?: string;
  price?: string;
  priceChange?: string;
  onOpenSearch?: () => void;
}

const RESEARCH_TABS: Array<{ id: ResearchTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "valuation", label: "Valuation" },
  { id: "ownership", label: "Ownership" },
  { id: "news", label: "News & Events" },
  { id: "sentiment", label: "Sentiment" },
  { id: "thesis", label: "AI Thesis" }
];

export const StockOverviewCard: React.FC<StockOverviewCardProps> = ({
  activeTab,
  onTabChange,
  ticker = "RELIANCE",
  companyName,
  exchange,
  price,
  priceChange,
  onOpenSearch
}) => {
  return (
    <div
      className="fin-stock-card rounded-[8px] bg-[#101A23] border border-[#26333D] p-2.5 space-y-2"
      style={{ padding: "10px", backgroundColor: "#101A23", border: "1px solid #26333D", borderRadius: 8, display: "flex", flexDirection: "column", gap: 6 }}
    >
      {/* Top Header Row with Ticker, Company and Price */}
      <TickerSelector
        ticker={ticker}
        companyName={companyName}
        exchange={exchange}
        price={price}
        priceChange={priceChange}
        onOpenSearch={onOpenSearch}
      />

      {/* Horizontal Tabs: Overview (Active with gold underline), Financials, etc. */}
      <div
        className="fin-tabs-row flex items-center gap-4 border-t border-[#26333D] pt-1.5 text-[10.5px] font-medium"
        style={{ display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid #26333D", paddingTop: 6 }}
      >
        {RESEARCH_TABS.map((t) => {
          const isTabActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`fin-tab-btn relative pb-1.5 transition-colors cursor-pointer ${
                isTabActive
                  ? "active text-[#D6B75E] font-semibold"
                  : "text-[#929CA7] hover:text-[#E7E9EC]"
              }`}
            >
              <span>{t.label}</span>
              {isTabActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D6B75E] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StockOverviewCard;
