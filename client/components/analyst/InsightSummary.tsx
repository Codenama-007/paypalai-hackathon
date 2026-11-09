"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export interface InsightSummaryProps {
  summaryText?: string;
  badgeLabel?: string;
}

const DEFAULT_SUMMARY =
  "RELIANCE shows short-term strength with a +0.41% intraday gain, supported by positive news flow and stable fundamentals. Long-term outlook remains favorable on the back of energy transition and retail growth.";

export const InsightSummary: React.FC<InsightSummaryProps> = ({
  summaryText = DEFAULT_SUMMARY,
  badgeLabel = "AI Analyst"
}) => {
  return (
    <div
      className="fin-panel-box col-span-5 rounded-[8px] bg-[#101A23] border border-[#26333D] p-2.5 flex flex-col justify-between transition-all duration-300 hover:border-[#D6B75E]/30"
      style={{ padding: "8px 10px", backgroundColor: "#101A23", border: "1px solid #26333D", borderRadius: 8, height: 180, minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <div>
        <div
          className="flex items-center justify-between border-b border-[#26333D] pb-1"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #26333D", paddingBottom: 4 }}
        >
          <div className="flex items-center gap-1.5" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles className="w-3.5 h-3.5 text-[#D6B75E]" style={{ width: 14, height: 14, color: "#D6B75E" }} />
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
              Insight Summary
            </h3>
          </div>
          <span
            className="text-[8.5px] font-semibold px-2 py-0.5 rounded-full bg-[#231A2D] text-[#C084FC] border border-[#402B56] shadow-xs"
            style={{ fontSize: "8.5px", fontWeight: 600, padding: "2px 8px", borderRadius: 9999, backgroundColor: "#231A2D", color: "#C084FC", border: "1px solid #402B56" }}
          >
            {badgeLabel}
          </span>
        </div>

        <p className="text-[10px] text-[#E7E9EC] leading-relaxed pt-2" style={{ fontSize: "10px", color: "#E7E9EC", lineHeight: 1.5, margin: "6px 0 0 0" }}>
          {summaryText}
        </p>
      </div>

      {/* Spacer */}
      <div className="h-0.5" />
    </div>
  );
};

export default InsightSummary;
