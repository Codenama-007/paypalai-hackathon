"use client";

import React from "react";
import { Newspaper, BarChart2, Activity, Sparkles } from "lucide-react";
import { StreamItem } from "@/types/dashboard";

export interface AnalysisStreamProps {
  events?: StreamItem[];
}

const DEFAULT_EVENTS: StreamItem[] = [
  {
    time: "10:02 AM",
    icon: Newspaper,
    iconBg: "#152E22",
    iconColor: "#26C88A",
    title: "News Ingested",
    badge: "News",
    badgeColor: "#152E22",
    badgeText: "#26C88A",
    desc: "Reliance to expand clean energy capacity by 10 GW by FY28."
  },
  {
    time: "10:05 AM",
    icon: BarChart2,
    iconBg: "#1A2A22",
    iconColor: "#35C98A",
    title: "Fundamental Scan Completed",
    badge: "Analysis",
    badgeColor: "#2A2312",
    badgeText: "#D6B75E",
    desc: "Revenue outlook upgraded; margin stability intact."
  },
  {
    time: "10:08 AM",
    icon: Activity,
    iconBg: "#1B2230",
    iconColor: "#45B6A3",
    title: "Sentiment Update",
    badge: "Sentiment",
    badgeColor: "#322510",
    badgeText: "#E5A93C",
    desc: "Overall sentiment: Positive (78% bullish) across news & social sources."
  },
  {
    time: "10:12 AM",
    icon: Sparkles,
    iconBg: "#2B1B2A",
    iconColor: "#D6B75E",
    title: "AI Insight Generated",
    badge: "AI",
    badgeColor: "#25182B",
    badgeText: "#C084FC",
    desc: "Long-term outlook remains constructive on energy & retail expansion."
  }
];

export const AnalysisStream: React.FC<AnalysisStreamProps> = ({
  events = DEFAULT_EVENTS
}) => {
  return (
    <div
      className="fin-stream-box col-span-7 rounded-[8px] bg-[#101A23] border border-[#26333D] p-2.5"
      style={{ padding: "8px 10px", backgroundColor: "#101A23", border: "1px solid #26333D", borderRadius: 8, height: 180, minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", margin: "0 0 2px 0" }}>
        Analysis Stream
      </h3>

      {/* Vertical Timeline Items with Connecting Line */}
      <div className="relative pl-5 pt-0.5" style={{ position: "relative", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Vertical Connector Line */}
        <div className="fin-timeline-connector absolute left-1.5 top-2 bottom-2 w-[1px] bg-[#26333D]" style={{ position: "absolute", left: 6, top: 4, bottom: 4, width: 1, backgroundColor: "#26333D" }} />

        {events.map((item, idx) => {
          const ItemIcon = item.icon;
          return (
            <div key={idx} className="relative">
              {/* Timeline Green Dot */}
              <span className="fin-timeline-node absolute -left-5 top-1 w-1.5 h-1.5 rounded-full bg-[#26C88A]" style={{ position: "absolute", left: -14, top: 4, width: 5, height: 5, borderRadius: "50%", backgroundColor: "#26C88A" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="text-[9px] font-mono text-[#929CA7]" style={{ fontSize: "9px", fontFamily: "var(--fin-font-mono)", color: "#929CA7" }}>{item.time}</span>
                  <div
                    className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.iconBg, width: 14, height: 14, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <ItemIcon className="w-2.5 h-2.5" style={{ color: item.iconColor, width: 10, height: 10 }} />
                  </div>
                  <span className="text-[10px] font-bold text-[#E7E9EC]" style={{ fontSize: "10px", fontWeight: 700, color: "#E7E9EC" }}>{item.title}</span>
                  <span
                    className="text-[8px] font-semibold px-1 py-0.2 rounded"
                    style={{ backgroundColor: item.badgeColor, color: item.badgeText, fontSize: "8px", fontWeight: 600, padding: "1px 5px", borderRadius: 3 }}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[9px] text-[#929CA7] pl-[46px] leading-tight" style={{ margin: "0 0 0 46px", fontSize: "9px", color: "#929CA7", lineHeight: 1.2 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisStream;

