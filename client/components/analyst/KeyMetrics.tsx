"use client";

import React from "react";
import { MetricsTab, MetricItem } from "@/types/dashboard";

export interface KeyMetricsProps {
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

export const KeyMetrics: React.FC<KeyMetricsProps> = ({
  activeTab,
  onTabChange,
  metrics = DEFAULT_METRICS,
  aboutText = DEFAULT_ABOUT
}) => {
  return (
    <div
      className="fin-panel-box col-span-4 rounded-[8px] bg-[#101A23] border border-[#26333D] p-2.5 flex flex-col justify-between h-[215px] transition-all duration-300 hover:border-[#D6B75E]/30"
      style={{ height: 215, padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      {/* Header Tabs: Key Metrics & About */}
      <div
        className="flex items-center gap-2 border-b border-[#26333D] pb-1 text-[10px] font-medium"
        style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #26333D", paddingBottom: 4 }}
      >
        <button
          onClick={() => onTabChange("metrics")}
          className={`h-[18px] px-2 rounded-[3px] font-semibold text-[9.5px] transition-all duration-200 active:scale-95 ${
            activeTab === "metrics"
              ? "active bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E] shadow-xs"
              : "text-[#929CA7] hover:text-[#E7E9EC] hover:bg-[#131F29]"
          }`}
          style={{
            height: 18,
            padding: "0 8px",
            borderRadius: 3,
            fontSize: "9.5px",
            backgroundColor: activeTab === "metrics" ? "#1E1A11" : "transparent",
            border: activeTab === "metrics" ? "1px solid #D6B75E" : "1px solid transparent",
            color: activeTab === "metrics" ? "#D6B75E" : "#929CA7"
          }}
        >
          Key Metrics
        </button>
        <button
          onClick={() => onTabChange("about")}
          className={`h-[18px] px-2 rounded-[3px] font-semibold text-[9.5px] transition-all duration-200 active:scale-95 ${
            activeTab === "about"
              ? "active bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E] shadow-xs"
              : "text-[#929CA7] hover:text-[#E7E9EC] hover:bg-[#131F29]"
          }`}
          style={{
            height: 18,
            padding: "0 8px",
            borderRadius: 3,
            fontSize: "9.5px",
            backgroundColor: activeTab === "about" ? "#1E1A11" : "transparent",
            border: activeTab === "about" ? "1px solid #D6B75E" : "1px solid transparent",
            color: activeTab === "about" ? "#D6B75E" : "#929CA7"
          }}
        >
          About
        </button>
      </div>

      {/* Exact Metrics Table Matching Screenshot */}
      {activeTab === "metrics" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "2px 0" }}>
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center group py-0.5 px-1 rounded transition-colors hover:bg-[#131F29]/60"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1px 4px" }}
            >
              <span style={{ color: "#929CA7", fontSize: "10px" }}>{m.label}</span>
              <span style={{ fontFamily: "var(--fin-font-mono)", fontWeight: 600, color: "#E7E9EC", fontSize: "10.5px" }}>
                {m.val}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-1 text-[9.5px] text-[#929CA7] leading-relaxed">
          {aboutText}
        </div>
      )}

      {/* Spacer */}
      <div className="h-[1px]" />
    </div>
  );
};

export default KeyMetrics;
