"use client";

import React from "react";
import { MetricsTab, MetricItem } from "@/types/dashboard";

export interface KeyMetricsCardProps {
  activeTab: MetricsTab;
  onTabChange: (tab: MetricsTab) => void;
  metrics?: MetricItem[];
  aboutText?: string;
}

const DEFAULT_METRICS: MetricItem[] = [
  { label: "Market Cap", val: "₹20.24 L Cr" },
  { label: "P/E (TTM)", val: "26.4" },
  { label: "EPS (TTM)", val: "₹113.2" },
  { label: "Dividend Yield", val: "0.34%" },
  { label: "52W High", val: "₹3,024.90" },
  { label: "52W Low", val: "₹2,222.00" }
];

const DEFAULT_ABOUT =
  "Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai, with market leadership across energy, petrochemicals, telecommunications, retail, and media.";

export const KeyMetricsCard: React.FC<KeyMetricsCardProps> = ({
  activeTab,
  onTabChange,
  metrics = DEFAULT_METRICS,
  aboutText = DEFAULT_ABOUT
}) => {
  return (
    <div className="fin-panel-box col-span-4 rounded-[8px] bg-[#101A23] border border-[#26333D] p-3 flex flex-col justify-between h-[255px]">
      {/* Header Tabs: Key Metrics & About */}
      <div className="flex items-center gap-2 border-b border-[#26333D] pb-1 text-[10.5px] font-medium">
        <button
          onClick={() => onTabChange("metrics")}
          className={`fin-timeframe-btn h-[20px] px-2 rounded-[4px] font-semibold transition-colors ${
            activeTab === "metrics"
              ? "active bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E]"
              : "text-[#929CA7] hover:text-[#E7E9EC]"
          }`}
        >
          Key Metrics
        </button>
        <button
          onClick={() => onTabChange("about")}
          className={`fin-timeframe-btn h-[20px] px-2 rounded-[4px] font-semibold transition-colors ${
            activeTab === "about"
              ? "active bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E]"
              : "text-[#929CA7] hover:text-[#E7E9EC]"
          }`}
        >
          About
        </button>
      </div>

      {/* Exact Metrics Table Matching Screenshot */}
      {activeTab === "metrics" ? (
        <div className="space-y-2 py-1 text-[11px]">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-[#929CA7] text-[10.5px]">{m.label}</span>
              <span className="font-mono font-semibold text-[#E7E9EC] text-[10.5px]">
                {m.val}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-2 text-[10px] text-[#929CA7] leading-relaxed">
          {aboutText}
        </div>
      )}

      {/* Spacer */}
      <div className="h-[1px]" />
    </div>
  );
};

export default KeyMetricsCard;

