"use client";

import React from "react";
import { Info } from "lucide-react";

export interface ComplianceDisclaimerProps {
  customText?: string;
}

export const ComplianceDisclaimer: React.FC<ComplianceDisclaimerProps> = ({
  customText
}) => {
  return (
    <div className="fin-disclaimer-card rounded-[8px] bg-[#101A23] border border-[#26333D] p-2 flex items-start gap-2.5">
      <Info className="w-3.5 h-3.5 text-[#929CA7] shrink-0 mt-0.5" />
      <p className="text-[9px] text-[#929CA7] leading-relaxed">
        <strong className="text-[#E7E9EC]">SEBI Mandatory Disclaimer:</strong>{" "}
        {customText ||
          "The analysis, insights, and information provided by FinAnalyst AI are for educational and research purposes only and do not constitute investment advice, buy/sell recommendations, or an offer to trade. Investments in the securities market are subject to market risks. Please read all related documents carefully before investing. FinAnalyst AI is not a SEBI-registered investment adviser or research analyst."}
      </p>
    </div>
  );
};

export default ComplianceDisclaimer;

