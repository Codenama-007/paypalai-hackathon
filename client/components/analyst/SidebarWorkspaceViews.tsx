"use client";

import React, { useState } from "react";
import {
  Crosshair,
  Compass,
  FileText,
  Layers,
  FlaskConical,
  Download,
  Play,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  Activity,
  Globe,
  Briefcase
} from "lucide-react";
import { PORTFOLIO_DATA, STOCKS } from "@/lib/marketData";

export interface SidebarWorkspaceViewsProps {
  viewId: string;
  onSelectStock: (ticker: string) => void;
  onBackToAnalyst: () => void;
}

export const SidebarWorkspaceViews: React.FC<SidebarWorkspaceViewsProps> = ({
  viewId,
  onSelectStock,
  onBackToAnalyst
}) => {
  const [backtestRunning, setBacktestRunning] = useState(false);
  const [backtestDone, setBacktestDone] = useState(true);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [activeScreenerFilter, setActiveScreenerFilter] = useState("Large Cap Breakouts");

  // 1. War Room View
  if (viewId === "war_room") {
    return (
      <div className="fin-view-wrapper" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Banner */}
        <div
          className="fin-view-banner war-room-banner"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid rgba(38, 200, 138, 0.5)",
            borderRadius: "8px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #18221B 0%, #101A23 60%, #152219 100%)",
            boxShadow: "0 0 16px rgba(38, 200, 138, 0.12)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "rgba(38, 200, 138, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#26C88A"
              }}
            >
              <Crosshair style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#E7E9EC" }}>
                  Autonomous Crisis Telemetry & Stress Engine
                </span>
                <span
                  style={{
                    fontSize: "8.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    backgroundColor: "#E36B73",
                    color: "#FFFFFF"
                  }}
                >
                  LIVE CRISIS MONITOR
                </span>
              </div>
              <p style={{ fontSize: "10.5px", color: "#929CA7", margin: "2px 0 0 0" }}>
                Multi-agent geopolitical risk telemetry, Brent crude volatility & interest rate sensitivity matrix.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                textAlign: "right",
                fontSize: "10px",
                fontFamily: "ui-monospace, monospace",
                color: "#929CA7"
              }}
            >
              <div>Multi-Agent Consensus</div>
              <span style={{ color: "#26C88A", fontWeight: 700, fontSize: "12px" }}>78% Bullish</span>
            </div>
          </div>
        </div>

        {/* 3 Macro Cards */}
        <div
          className="fin-view-grid-3"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}
        >
          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <span
              className="fin-view-tag-amber"
              style={{
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: "rgba(229, 169, 60, 0.15)",
                border: "1px solid #E5A93C",
                color: "#E5A93C",
                width: "fit-content"
              }}
            >
              Macro Risk Factor #1
            </span>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
              Brent Crude Volatility ($76.4/bbl)
            </p>
            <p style={{ fontSize: "10.5px", color: "#929CA7", margin: 0, lineHeight: 1.5 }}>
              O2C refining cracks sensitive to Red Sea tanker freight rates. Reliance margin impact modeled at ±$0.65/bbl per $10 swing.
            </p>
          </div>

          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <span
              className="fin-view-tag-green"
              style={{
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: "rgba(38, 200, 138, 0.15)",
                border: "1px solid #26C88A",
                color: "#26C88A",
                width: "fit-content"
              }}
            >
              Macro Catalyst #2
            </span>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
              RBI Monetary Policy Stance
            </p>
            <p style={{ fontSize: "10.5px", color: "#929CA7", margin: 0, lineHeight: 1.5 }}>
              Repo rate neutral stance shift anticipated in upcoming MPC policy meeting, boosting private capex appetite across heavy industry.
            </p>
          </div>

          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <span
              className="fin-view-tag-purple"
              style={{
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: "rgba(192, 132, 252, 0.15)",
                border: "1px solid #7C3AED",
                color: "#C084FC",
                width: "fit-content"
              }}
            >
              Autonomous Agent Debate
            </span>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
              Valuation Multiple vs EBITDA Growth
            </p>
            <p style={{ fontSize: "10.5px", color: "#929CA7", margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: "#26C88A" }}>Bull Agent:</strong> Retail EBITDA expansion + 5G ARPU.<br />
              <strong style={{ color: "#E36B73" }}>Bear Agent:</strong> Capex drag on Free Cash Flow.
            </p>
          </div>
        </div>

        {/* Live Multi-Agent Stream */}
        <div
          className="fin-view-card"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid #26333D",
            borderRadius: "8px",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #26333D", paddingBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#E7E9EC", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Autonomous War Room Agent Debate Transcript
            </span>
            <span style={{ fontSize: "9.5px", fontFamily: "ui-monospace, monospace", color: "#D6B75E" }}>
              Live Telemetry Active · Cycle #1,402
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px" }}>
            <div style={{ padding: "8px 12px", borderRadius: "6px", backgroundColor: "#0B1219", border: "1px solid #26333D", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "#26C88A", fontWeight: 700, flexShrink: 0, width: "100px" }}>[BULL AGENT]</span>
              <span style={{ color: "#E7E9EC" }}>
                Consumer retail footfalls hit 2.8x seasonal average. Telecom ARPU lifted to ₹182/sub. Valuation multiple rerating justifiable.
              </span>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: "6px", backgroundColor: "#0B1219", border: "1px solid #26333D", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "#E36B73", fontWeight: 700, flexShrink: 0, width: "100px" }}>[BEAR AGENT]</span>
              <span style={{ color: "#E7E9EC" }}>
                Refinery cracks compressed 40 bps Q/Q due to Russian discounted crude influx to regional competitors. FCF conversion delayed.
              </span>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: "6px", backgroundColor: "#0B1219", border: "1px solid #26333D", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "#D6B75E", fontWeight: 700, flexShrink: 0, width: "100px" }}>[MACRO AGENT]</span>
              <span style={{ color: "#E7E9EC" }}>
                Consensus synthesis established: Net favorable risk/reward. Recommended action: Maintain Long Exposure with stop at ₹2,840.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Portfolio View
  if (viewId === "portfolio") {
    return (
      <div className="fin-view-wrapper" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Total AUM Header */}
        <div
          className="fin-view-banner"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid #26333D",
            borderRadius: "8px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#929CA7", display: "block" }}>
              Total Institutional Portfolio AUM
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginTop: "4px" }}>
              <span style={{ fontSize: "20px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#E7E9EC" }}>
                {PORTFOLIO_DATA.totalAUM}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#26C88A" }}>
                {PORTFOLIO_DATA.dailyPnL}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontFamily: "ui-monospace, monospace", fontSize: "11px" }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#929CA7" }}>Sharpe Ratio:</span>{" "}
              <strong style={{ color: "#D6B75E" }}>{PORTFOLIO_DATA.sharpeRatio}</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#929CA7" }}>Beta:</span>{" "}
              <strong style={{ color: "#E7E9EC" }}>{PORTFOLIO_DATA.beta}</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#929CA7" }}>Active Risk (VaR 95%):</span>{" "}
              <strong style={{ color: "#E36B73" }}>-1.42%</strong>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div
          className="fin-table-box"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid #26333D",
            borderRadius: "8px",
            overflow: "hidden"
          }}
        >
          <div
            className="fin-table-head"
            style={{
              backgroundColor: "#0B1219",
              borderBottom: "1px solid #26333D",
              padding: "10px 16px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#929CA7"
            }}
          >
            <span>Core Institutional Holding & Position</span>
            <div style={{ display: "flex", gap: "32px" }}>
              <span>Weight</span>
              <span style={{ width: "120px", textAlign: "right" }}>Unrealized Return</span>
              <span style={{ width: "60px", textAlign: "right" }}>Action</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {PORTFOLIO_DATA.holdings.map((h) => (
              <div
                key={h.ticker}
                onClick={() => onSelectStock(h.ticker)}
                className="fin-table-row-item"
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(38, 51, 61, 0.5)",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "4px",
                      backgroundColor: "#1E1A11",
                      border: "1px solid #D6B75E",
                      color: "#D6B75E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontFamily: "ui-monospace, monospace",
                      fontSize: "11px"
                    }}
                  >
                    {h.ticker.charAt(0)}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#E7E9EC", fontSize: "12px", display: "block" }}>
                      {h.ticker}
                    </span>
                    <span style={{ fontSize: "10px", color: "#929CA7", fontFamily: "ui-monospace, monospace" }}>
                      {h.shares.toLocaleString()} shares · Avg ₹{h.avgCost}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "32px", fontFamily: "ui-monospace, monospace" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#D6B75E",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      backgroundColor: "#1E1A11",
                      border: "1px solid rgba(214, 183, 94, 0.4)",
                      fontWeight: 600
                    }}
                  >
                    {h.weight}
                  </span>
                  <span style={{ width: "120px", textAlign: "right", fontWeight: 700, color: "#26C88A", fontSize: "12px" }}>
                    {h.pnl}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStock(h.ticker);
                    }}
                    style={{
                      width: "60px",
                      textAlign: "right",
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: "#D6B75E",
                      cursor: "pointer"
                    }}
                  >
                    Inspect →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Discover Screener
  if (viewId === "discover") {
    const filters = [
      { id: "Large Cap Breakouts", count: 12, desc: "Trading within 3% of 52-week highs with 1.8x volume" },
      { id: "High ROCE (>25%)", count: 18, desc: "Return on capital employed above 25% with zero debt" },
      { id: "P/E Discount to Peers", count: 9, desc: "Forward P/E >15% below 3-year historical average" },
      { id: "FII Accumulation", count: 15, desc: "Net institutional inflow positive for 5 consecutive days" }
    ];

    return (
      <div className="fin-view-wrapper" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* 4 Screener Cards */}
        <div
          className="fin-view-grid-4"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}
        >
          {filters.map((f) => {
            const isSelected = activeScreenerFilter === f.id;
            return (
              <div
                key={f.id}
                onClick={() => setActiveScreenerFilter(f.id)}
                className="fin-view-card"
                style={{
                  backgroundColor: isSelected ? "#1E1A11" : "#101A23",
                  border: isSelected ? "1px solid #D6B75E" : "1px solid #26333D",
                  borderRadius: "8px",
                  padding: "12px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: isSelected ? "#D6B75E" : "#E7E9EC" }}>
                    {f.id}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 4,
                      backgroundColor: "rgba(38, 200, 138, 0.15)",
                      color: "#26C88A"
                    }}
                  >
                    {f.count} Hits
                  </span>
                </div>
                <p style={{ fontSize: "9.5px", color: "#929CA7", margin: 0, lineHeight: 1.4 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Qualified Stocks Table */}
        <div
          className="fin-table-box"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid #26333D",
            borderRadius: "8px",
            overflow: "hidden"
          }}
        >
          <div
            className="fin-table-head"
            style={{
              backgroundColor: "#0B1219",
              borderBottom: "1px solid #26333D",
              padding: "10px 16px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#929CA7"
            }}
          >
            <span>Screened Equities matching &ldquo;{activeScreenerFilter}&rdquo;</span>
            <div style={{ display: "flex", gap: "28px" }}>
              <span>Sector</span>
              <span style={{ width: "90px", textAlign: "right" }}>Current Price</span>
              <span style={{ width: "80px", textAlign: "right" }}>1D Change</span>
              <span style={{ width: "80px", textAlign: "right" }}>Action</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {Object.values(STOCKS).map((stk) => (
              <div
                key={stk.ticker}
                onClick={() => onSelectStock(stk.ticker)}
                className="fin-table-row-item"
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(38, 51, 61, 0.5)",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "4px",
                      backgroundColor: "#1E1A11",
                      border: "1px solid #D6B75E",
                      color: "#D6B75E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontFamily: "ui-monospace, monospace",
                      fontSize: "11px"
                    }}
                  >
                    {stk.ticker.charAt(0)}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#E7E9EC", fontSize: "12px", display: "block" }}>
                      {stk.ticker}
                    </span>
                    <span style={{ fontSize: "10px", color: "#929CA7" }}>
                      {stk.name}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "28px", fontFamily: "ui-monospace, monospace" }}>
                  <span style={{ fontSize: "10px", color: "#929CA7", textTransform: "uppercase" }}>
                    {stk.sector}
                  </span>
                  <span style={{ width: "90px", textAlign: "right", fontWeight: 700, color: "#E7E9EC", fontSize: "11.5px" }}>
                    {stk.price}
                  </span>
                  <span
                    style={{
                      width: "80px",
                      textAlign: "right",
                      fontWeight: 700,
                      color: stk.priceChange.startsWith("+") ? "#26C88A" : "#E36B73",
                      fontSize: "11.5px"
                    }}
                  >
                    {stk.priceChange}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStock(stk.ticker);
                    }}
                    className="fin-btn-gold"
                    style={{
                      width: "80px",
                      justifyContent: "center",
                      padding: "4px 8px",
                      fontSize: "10px"
                    }}
                  >
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. Brief
  if (viewId === "brief") {
    return (
      <div className="fin-view-wrapper" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          className="fin-view-card"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid #26333D",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #26333D", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText style={{ width: 16, height: 16, color: "#D6B75E" }} />
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
                Daily Morning Institutional Intelligence Brief — NSE Cash & Derivatives
              </h3>
            </div>
            <span style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "#929CA7" }}>
              Publication Date: 10 Nov 2026 · 08:30 IST
            </span>
          </div>

          <p style={{ fontSize: "11.5px", color: "#E7E9EC", lineHeight: 1.6, margin: 0 }}>
            Indian equities opened resilient, supported by healthy IT earnings guidance from TCS and robust banking deposit accretion at HDFC Bank. Reliance Industries commands key attention ahead of clean energy gigafactory commissioning updates. FII flows turned net positive with ₹1,420 Cr pumped into index bellwethers, while DII institutional absorption absorbed mid-cap supply.
          </p>
        </div>

        <div
          className="fin-view-grid-3"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}
        >
          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#26C88A", textTransform: "uppercase" }}>
              Institutional Capital Flow
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#E7E9EC" }}>
              FII: +₹1,420 Cr · DII: +₹890 Cr
            </span>
            <p style={{ fontSize: "10px", color: "#929CA7", margin: 0 }}>
              Primary absorption concentrated in Large-Cap BFSI and IT bellwethers.
            </p>
          </div>

          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#D6B75E", textTransform: "uppercase" }}>
              Global Handover
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#E7E9EC" }}>
              S&P: +0.45% · Nikkei: +0.72%
            </span>
            <p style={{ fontSize: "10px", color: "#929CA7", margin: 0 }}>
              US treasury yields eased 4 bps to 4.28%, providing emerging market tailwind.
            </p>
          </div>

          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#C084FC", textTransform: "uppercase" }}>
              Derivative Telemetry
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#E7E9EC" }}>
              NIFTY PCR: 1.18 (Bullish)
            </span>
            <p style={{ fontSize: "10px", color: "#929CA7", margin: 0 }}>
              Heavy put writing witnessed at 24,000 strike; resistance anchored at 24,500.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 5. Ecosystem
  if (viewId === "ecosystem") {
    return (
      <div className="fin-view-wrapper" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          className="fin-view-card"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid #26333D",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #26333D", paddingBottom: "10px" }}>
            <Layers style={{ width: 16, height: 16, color: "#D6B75E" }} />
            <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
              Conglomerate Supplier & Competitor Ecosystem Matrix
            </h3>
          </div>
          <p style={{ fontSize: "11px", color: "#929CA7", margin: 0 }}>
            Automated dependency mapping of conglomerate supply tiers, market share distributions, and competitive moat benchmarks.
          </p>
        </div>

        <div
          className="fin-view-grid-3"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}
        >
          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <span
              className="fin-view-tag-gold"
              style={{
                fontSize: "9px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                backgroundColor: "#1E1A11",
                border: "1px solid #D6B75E",
                color: "#D6B75E",
                width: "fit-content"
              }}
            >
              Telecom Sector Footprint
            </span>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
              Jio Infocomm vs Bharti Airtel vs Vodafone Idea
            </p>
            <p style={{ fontSize: "10.5px", color: "#929CA7", margin: 0, lineHeight: 1.5 }}>
              Market share: Jio (42.4%), Airtel (33.1%), VIL (18.6%). 5G SA rollout gives Reliance clear latency advantage in enterprise services.
            </p>
          </div>

          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <span
              className="fin-view-tag-green"
              style={{
                fontSize: "9px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                backgroundColor: "rgba(38, 200, 138, 0.15)",
                border: "1px solid #26C88A",
                color: "#26C88A",
                width: "fit-content"
              }}
            >
              Organized Retail Network
            </span>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
              Reliance Retail vs DMart vs Trent
            </p>
            <p style={{ fontSize: "10.5px", color: "#929CA7", margin: 0, lineHeight: 1.5 }}>
              Over 18,500 physical doors operational. Grocery & electronics dominate EBITDA generation, while fast-fashion competes with Trent Zudio.
            </p>
          </div>

          <div
            className="fin-view-card"
            style={{
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <span
              className="fin-view-tag-teal"
              style={{
                fontSize: "9px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                backgroundColor: "rgba(69, 182, 163, 0.15)",
                border: "1px solid #45B6A3",
                color: "#45B6A3",
                width: "fit-content"
              }}
            >
              New Clean Energy Complex
            </span>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
              Jamnagar Gigafactory vs Adani Green vs Tata Power
            </p>
            <p style={{ fontSize: "10.5px", color: "#929CA7", margin: 0, lineHeight: 1.5 }}>
              Integrated solar PV, green hydrogen electrolyzers, energy storage batteries, and fuel cells fully backward-integrated.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 6. Report Generator
  if (viewId === "report") {
    return (
      <div className="fin-view-wrapper" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          className="fin-view-card"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid #26333D",
            borderRadius: "8px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #26333D", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText style={{ width: 18, height: 18, color: "#D6B75E" }} />
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
                Institutional Research Initiation Report Generator
              </h3>
            </div>
            <span style={{ fontSize: "10px", color: "#929CA7", fontFamily: "ui-monospace, monospace" }}>
              Template: Tier-1 Institutional Research Standard (MiFID II Compliant)
            </span>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "6px",
              backgroundColor: "#0B1219",
              border: "1px solid #26333D",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#E7E9EC", display: "block" }}>
                Comprehensive 12-Page Equity Initiation Note (PDF)
              </span>
              <p style={{ fontSize: "10.5px", color: "#929CA7", margin: "4px 0 0 0" }}>
                Includes discounted cash flow (DCF) model, sensitivity matrices, competitive moat audit & multi-agent thesis.
              </p>
            </div>

            <button
              onClick={() => setReportGenerated(true)}
              className="fin-btn-gold"
              style={{
                padding: "8px 16px",
                fontSize: "11px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Download style={{ width: 14, height: 14 }} />
              <span>Generate PDF Note</span>
            </button>
          </div>

          {reportGenerated && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "6px",
                backgroundColor: "#18221B",
                border: "1px solid #26C88A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "11.5px",
                color: "#26C88A"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                <span style={{ fontWeight: 600 }}>
                  Institutional Research Note Compiled Successfully (FinIntel_Equity_Research.pdf)
                </span>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob(
                    [
                      "FININTEL INSTITUTIONAL EQUITY RESEARCH DESK\n" +
                      "============================================\n\n" +
                      "TICKER: RELIANCE INDUSTRIES LTD (NSE: RELIANCE)\n" +
                      "RECOMMENDATION: OVERWEIGHT / INSTITUTIONAL BUY\n" +
                      "TARGET PRICE: Rs 3,340 (+11.8% upside)\n" +
                      "CONSENSUS: 78% Bullish (Autonomous Multi-Agent Synthesis)\n\n" +
                      "KEY INVESTMENT HIGHLIGHTS:\n" +
                      "1. Jio Infocomm ARPU expansion with 5G monetization.\n" +
                      "2. Retail EBITDA growth outperforming offline FMCG peers.\n" +
                      "3. Jamnagar Clean Energy Gigafactory commissioning timeline.\n\n" +
                      "COMPLIANCE & SEBI DISCLAIMER:\n" +
                      "This algorithmic document is generated for institutional research simulation only."
                    ],
                    { type: "text/plain" }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "FinIntel_Equity_Research_Note.txt";
                  a.click();
                }}
                style={{
                  color: "#D6B75E",
                  textDecoration: "underline",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Download Note File (.txt)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 7. Backtest Engine
  if (viewId === "backtest") {
    return (
      <div className="fin-view-wrapper" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          className="fin-view-card"
          style={{
            backgroundColor: "#101A23",
            border: "1px solid #26333D",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #26333D", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FlaskConical style={{ width: 16, height: 16, color: "#D6B75E" }} />
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
                Quantitative Alpha Strategy Backtesting Desk
              </h3>
            </div>
            <span style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "#929CA7" }}>
              Engine: High-Frequency Event-Driven Python Core
            </span>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: "6px",
              backgroundColor: "#0B1219",
              border: "1px solid #26333D",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#E7E9EC", display: "block" }}>
                Strategy: Multi-Agent Momentum & Valuation Filter
              </span>
              <p style={{ fontSize: "10px", color: "#929CA7", margin: "2px 0 0 0" }}>
                Lookback Period: 3 Years (2021 – 2024) · Benchmark: NIFTY 50 Total Return Index
              </p>
            </div>

            <button
              onClick={() => {
                setBacktestRunning(true);
                setTimeout(() => {
                  setBacktestRunning(false);
                  setBacktestDone(true);
                }, 1000);
              }}
              disabled={backtestRunning}
              className="fin-btn-green"
              style={{
                padding: "7px 16px",
                fontSize: "11px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <Play style={{ width: 13, height: 13, fill: "currentColor" }} />
              <span>{backtestRunning ? "Computing Alpha Telemetry..." : "Run Quantitative Backtest"}</span>
            </button>
          </div>

          {backtestDone && (
            <div
              className="fin-view-grid-4"
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "4px" }}
            >
              <div
                className="fin-stat-metric-card"
                style={{
                  backgroundColor: "#18221B",
                  border: "1px solid #26C88A",
                  borderRadius: "6px",
                  padding: "12px",
                  textAlign: "center"
                }}
              >
                <span style={{ fontSize: "9.5px", color: "#929CA7", textTransform: "uppercase", display: "block" }}>
                  CAGR Alpha
                </span>
                <span style={{ fontSize: "16px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#26C88A" }}>
                  +24.8%
                </span>
              </div>

              <div
                className="fin-stat-metric-card"
                style={{
                  backgroundColor: "#0B1219",
                  border: "1px solid #26333D",
                  borderRadius: "6px",
                  padding: "12px",
                  textAlign: "center"
                }}
              >
                <span style={{ fontSize: "9.5px", color: "#929CA7", textTransform: "uppercase", display: "block" }}>
                  Sharpe Ratio
                </span>
                <span style={{ fontSize: "16px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#D6B75E" }}>
                  2.32
                </span>
              </div>

              <div
                className="fin-stat-metric-card"
                style={{
                  backgroundColor: "#0B1219",
                  border: "1px solid #26333D",
                  borderRadius: "6px",
                  padding: "12px",
                  textAlign: "center"
                }}
              >
                <span style={{ fontSize: "9.5px", color: "#929CA7", textTransform: "uppercase", display: "block" }}>
                  Max Drawdown
                </span>
                <span style={{ fontSize: "16px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#E36B73" }}>
                  -8.4%
                </span>
              </div>

              <div
                className="fin-stat-metric-card"
                style={{
                  backgroundColor: "#0B1219",
                  border: "1px solid #26333D",
                  borderRadius: "6px",
                  padding: "12px",
                  textAlign: "center"
                }}
              >
                <span style={{ fontSize: "9.5px", color: "#929CA7", textTransform: "uppercase", display: "block" }}>
                  Win Rate
                </span>
                <span style={{ fontSize: "16px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "#45B6A3" }}>
                  68.4%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
