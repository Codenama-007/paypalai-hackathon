"use client";

import React from "react";
import {
  BarChart3,
  Crosshair,
  Briefcase,
  Compass,
  FileText,
  Layers,
  FlaskConical
} from "lucide-react";
import { NavItem } from "@/types/dashboard";

export interface NavigationProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: "analyst", label: "Analyst", icon: BarChart3, active: true },
  { id: "war_room", label: "War Room", icon: Crosshair, badge: "Live" },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "brief", label: "Brief", icon: FileText },
  { id: "ecosystem", label: "Ecosystem", icon: Layers },
  { id: "report", label: "Report", icon: FileText },
  { id: "backtest", label: "Backtest", icon: FlaskConical }
];

export const Navigation: React.FC<NavigationProps> = ({
  activeNav,
  onNavChange
}) => {
  return (
    <aside
      className="fin-sidebar w-[195px] h-full shrink-0 bg-[#070C11] border-r border-[#26333D] flex flex-col justify-between py-2 overflow-hidden"
      style={{ width: 195, height: "100%", flexShrink: 0, backgroundColor: "#070C11", borderRight: "1px solid #26333D", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "8px 0" }}
    >
      {/* Top: Nav Items */}
      <div className="space-y-0.5 px-2" style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 8px" }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`fin-nav-btn w-full h-[30px] flex items-center justify-between px-2.5 rounded-[5px] text-[11px] font-medium transition-all ${
                isActive
                  ? "active bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E] shadow-sm"
                  : "text-[#929CA7] hover:text-[#E7E9EC] hover:bg-[#101A23]"
              }`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 30,
                padding: "0 10px",
                borderRadius: 5,
                fontSize: "11px",
                width: "100%"
              }}
            >
              <div className="flex items-center gap-2.5" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-[#D6B75E]" : "text-[#929CA7]"
                  }`}
                  style={{ width: 14, height: 14 }}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className="fin-nav-badge-live text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#E36B73] text-white uppercase tracking-wider"
                  style={{ fontSize: "8px", fontWeight: 700, padding: "1px 6px", borderRadius: 9999, backgroundColor: "#E36B73", color: "#FFFFFF" }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom: 3D Topographic Wireframe Mesh + Quote */}
      <div className="fin-sidebar-footer px-3 space-y-1.5" style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Topographic 3D Wireframe Landscape Artwork Matching Screenshot */}
        <div className="fin-contour-container h-[60px] w-full overflow-hidden flex items-end justify-center" style={{ height: 60, width: "100%", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <svg viewBox="0 0 160 65" className="w-full h-full" fill="none">
            <path
              d="M0 54 Q 25 36, 55 42 T 100 15 T 135 30 T 160 22"
              stroke="#D6B75E"
              strokeWidth="1.2"
              opacity="0.9"
            />
            <path
              d="M0 57 Q 20 40, 50 48 T 95 24 T 130 38 T 160 30"
              stroke="#C5A44E"
              strokeWidth="1"
              opacity="0.65"
            />
            <path
              d="M0 61 Q 30 50, 60 55 T 105 34 T 140 46 T 160 40"
              stroke="#A98B45"
              strokeWidth="0.8"
              opacity="0.45"
            />
            <path
              d="M0 64 Q 35 56, 70 60 T 115 44 T 150 54 T 160 50"
              stroke="#7A632E"
              strokeWidth="0.6"
              opacity="0.3"
            />
            {[15, 35, 55, 75, 95, 115, 135, 155].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1={24 + Math.sin(i) * 12}
                x2={x - 5}
                y2={62}
                stroke="#D6B75E"
                strokeWidth="0.4"
                opacity="0.25"
              />
            ))}
          </svg>
        </div>

        {/* Bottom Quote in exact 3 lines */}
        <div
          className="fin-sidebar-quote text-[8.5px] text-[#929CA7] leading-relaxed pt-1 border-t border-[#26333D]/60 font-sans"
          style={{ fontSize: "8.5px", color: "#929CA7", lineHeight: 1.4, borderTop: "1px solid rgba(38, 51, 61, 0.6)", paddingTop: 4 }}
        >
          <p style={{ margin: 0 }}>&ldquo;Data for insight,</p>
          <p style={{ margin: 0 }}>AI for depth,</p>
          <p style={{ margin: 0 }}>You for the decision.&rdquo;</p>
        </div>
      </div>
    </aside>
  );
};

export default Navigation;

