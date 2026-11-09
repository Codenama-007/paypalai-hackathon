"use client";

import React from "react";
import {
  Database,
  BarChart2,
  Newspaper,
  Scale,
  TrendingUp,
  Activity
} from "lucide-react";
import { ToolItem } from "@/types/dashboard";

export interface ToolExecutionFeedProps {
  onSelectTool: (query: string) => void;
  tools?: ToolItem[];
}

const DEFAULT_TOOLS: ToolItem[] = [
  {
    name: "Company Data",
    icon: Database,
    query: "Summarize key business segments and company data for RELIANCE"
  },
  {
    name: "Financials",
    icon: BarChart2,
    query: "Analyze revenue growth and EBITDA margins for RELIANCE"
  },
  {
    name: "News & Events",
    icon: Newspaper,
    query: "Surface the latest news catalysts for RELIANCE"
  },
  {
    name: "Valuation",
    icon: Scale,
    query: "Compare P/E multiple of RELIANCE against industry median"
  },
  {
    name: "Technical",
    icon: TrendingUp,
    query: "Review 14-day RSI and 200 DMA support for RELIANCE"
  },
  {
    name: "Sentiment",
    icon: Activity,
    query: "Audit institutional FII sentiment for RELIANCE"
  }
];

export const ToolExecutionFeed: React.FC<ToolExecutionFeedProps> = ({
  onSelectTool,
  tools = DEFAULT_TOOLS
}) => {
  return (
    <div className="fin-tools-grid grid grid-cols-3 gap-1 text-[8.5px] font-medium" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
      {tools.map((tool, idx) => {
        const ToolIcon = tool.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectTool(tool.query)}
            className="fin-tool-card tool-grid-item h-[40px] rounded-[4px] bg-[#0B1219] border border-[#26333D] hover:border-[#D6B75E]/60 flex flex-col items-center justify-center gap-0.5 text-center text-[#929CA7] hover:text-[#E7E9EC] transition-colors p-1"
            style={{ height: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: 4 }}
          >
            <ToolIcon className="w-2.5 h-2.5 text-[#D6B75E]" style={{ width: 12, height: 12, color: "#D6B75E" }} />
            <span className="truncate w-full leading-tight text-[8px]" style={{ fontSize: "8px", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {tool.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ToolExecutionFeed;

