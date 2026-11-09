"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export interface InsightSummaryCardProps {
  summaryText?: string;
  badgeLabel?: string;
}

const DEFAULT_SUMMARY =
  "RELIANCE shows short-term strength with a +0.41% intraday gain, supported by positive news flow and stable fundamentals. Long-term outlook remains favorable on the back of energy transition and retail growth.";

export const InsightSummaryCard: React.FC<InsightSummaryCardProps> = ({
  summaryText = DEFAULT_SUMMARY,
  badgeLabel = "AI Analyst"
}) => {
  return (
    <div className="fin-panel-box col-span-5 rounded-[8px] bg-[#101A23] border border-[#26333D] p-3 flex flex-col justify-between space-y-2">
      <div>
        <div className="flex items-center justify-between border-b border-[#26333D] pb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B75E]" />
            <span className="text-[11px] font-bold text-[#E7E9EC] uppercase tracking-wider">
              Insight Summary
            </span>
          </div>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#231A2D] text-[#C084FC] border border-[#402B56]">
            {badgeLabel}
          </span>
        </div>

        <p className="text-[10.5px] text-[#E7E9EC] leading-relaxed pt-2">
          {summaryText}
        </p>
      </div>

      {/* Spacer */}
      <div className="h-1" />
    </div>
  );
};

export default InsightSummaryCard;

