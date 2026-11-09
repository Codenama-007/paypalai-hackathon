"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Timeframe } from "@/types/dashboard";

export interface StockChartProps {
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  currentPrice?: string;
  ticker?: string;
}

const TIMEFRAMES: Timeframe[] = ["1D", "5D", "1M", "6M", "1Y", "5Y", "Max"];

export const StockChart: React.FC<StockChartProps> = ({
  timeframe,
  onTimeframeChange,
  currentPrice = "2,987.40",
  ticker = "RELIANCE"
}) => {
  const [chartMode, setChartMode] = useState<"candlestick" | "line">("candlestick");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Candlesticks for 1D
  const candles = [
    { x: 12, open: 135, close: 130, high: 128, low: 138, vol: 15, isUp: true },
    { x: 22, open: 130, close: 125, high: 122, low: 133, vol: 20, isUp: true },
    { x: 32, open: 125, close: 118, high: 116, low: 128, vol: 25, isUp: true },
    { x: 42, open: 118, close: 121, high: 115, low: 124, vol: 18, isUp: false },
    { x: 52, open: 121, close: 112, high: 109, low: 122, vol: 35, isUp: true },
    { x: 62, open: 112, close: 105, high: 102, low: 114, vol: 40, isUp: true },
    { x: 72, open: 105, close: 97, high: 94, low: 108, vol: 48, isUp: true },
    { x: 82, open: 97, close: 90, high: 86, low: 100, vol: 50, isUp: true },
    { x: 92, open: 90, close: 93, high: 88, low: 96, vol: 28, isUp: false },
    { x: 102, open: 93, close: 86, high: 82, low: 94, vol: 32, isUp: true },
    { x: 112, open: 86, close: 90, high: 84, low: 92, vol: 20, isUp: false },
    { x: 122, open: 90, close: 96, high: 88, low: 98, vol: 30, isUp: false },
    { x: 132, open: 96, close: 102, high: 94, low: 105, vol: 40, isUp: false },
    { x: 142, open: 102, close: 109, high: 100, low: 112, vol: 42, isUp: false },
    { x: 152, open: 109, close: 115, high: 107, low: 118, vol: 35, isUp: false },
    { x: 162, open: 115, close: 111, high: 109, low: 119, vol: 22, isUp: true },
    { x: 172, open: 111, close: 119, high: 109, low: 122, vol: 38, isUp: false },
    { x: 182, open: 119, close: 125, high: 117, low: 127, vol: 40, isUp: false },
    { x: 192, open: 125, close: 122, high: 119, low: 129, vol: 25, isUp: true },
    { x: 202, open: 122, close: 127, high: 120, low: 131, vol: 28, isUp: false },
    { x: 212, open: 127, close: 125, high: 122, low: 129, vol: 18, isUp: true },
    { x: 222, open: 125, close: 129, high: 123, low: 132, vol: 22, isUp: false },
    { x: 232, open: 129, close: 123, high: 121, low: 131, vol: 26, isUp: true },
    { x: 242, open: 123, close: 126, high: 120, low: 128, vol: 19, isUp: false },
    { x: 252, open: 126, close: 122, high: 119, low: 127, vol: 24, isUp: true },
    { x: 262, open: 122, close: 115, high: 112, low: 124, vol: 35, isUp: true },
    { x: 272, open: 115, close: 109, high: 106, low: 117, vol: 40, isUp: true },
    { x: 282, open: 109, close: 102, high: 99, low: 111, vol: 48, isUp: true },
    { x: 292, open: 102, close: 95, high: 92, low: 104, vol: 52, isUp: true },
    { x: 302, open: 95, close: 99, high: 93, low: 102, vol: 25, isUp: false },
    { x: 312, open: 99, close: 91, high: 87, low: 101, vol: 44, isUp: true },
    { x: 322, open: 91, close: 85, high: 82, low: 93, vol: 50, isUp: true },
    { x: 332, open: 85, close: 79, high: 75, low: 87, vol: 55, isUp: true },
    { x: 342, open: 79, close: 82, high: 77, low: 85, vol: 28, isUp: false },
    { x: 352, open: 82, close: 77, high: 73, low: 84, vol: 45, isUp: true },
    { x: 362, open: 77, close: 73, high: 69, low: 79, vol: 58, isUp: true },
    { x: 372, open: 73, close: 79, high: 71, low: 81, vol: 32, isUp: false },
    { x: 382, open: 79, close: 75, high: 72, low: 82, vol: 30, isUp: true },
    { x: 392, open: 75, close: 72, high: 69, low: 77, vol: 35, isUp: true },
    { x: 402, open: 72, close: 77, high: 70, low: 79, vol: 25, isUp: false },
    { x: 412, open: 77, close: 73, high: 71, low: 79, vol: 28, isUp: true },
    { x: 422, open: 73, close: 74, high: 70, low: 77, vol: 32, isUp: false },
    { x: 432, open: 74, close: 72, high: 69, low: 76, vol: 38, isUp: true },
    { x: 442, open: 72, close: 73, high: 70, low: 75, vol: 22, isUp: false },
    { x: 452, open: 73, close: 72, high: 70, low: 74, vol: 30, isUp: true }
  ];

  // SVG Line path for line chart mode
  const linePoints = candles.map((c) => `${c.x + 2.25},${c.close}`).join(" ");

  const cleanPrice = currentPrice.replace(/[^0-9.]/g, "");

  const renderSvgContent = (viewW = 520, viewH = 170) => (
    <svg className="w-full h-full" viewBox={`0 0 ${viewW} ${viewH}`} preserveAspectRatio="none">
      {/* Grid Lines */}
      <line x1="0" y1="20" x2="465" y2="20" stroke="#1C2731" strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1="0" y1="52" x2="465" y2="52" stroke="#1C2731" strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1="0" y1="85" x2="465" y2="85" stroke="#1C2731" strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1="0" y1="118" x2="465" y2="118" stroke="#1C2731" strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1="0" y1="145" x2="465" y2="145" stroke="#1C2731" strokeWidth="0.7" strokeDasharray="2 2" />

      {/* Price Scale Right Labels */}
      <text x="472" y="24" fill="#929CA7" fontSize="8" fontFamily="monospace">3,020.00</text>
      <text x="472" y="55" fill="#929CA7" fontSize="8" fontFamily="monospace">3,000.00</text>

      {/* Green CMP Badge */}
      <rect x="468" y="68" width="48" height="13" rx="2" fill="#26C88A" />
      <text x="471" y="78" fill="#080D12" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
        {cleanPrice || "2,987.40"}
      </text>

      <text x="472" y="95" fill="#929CA7" fontSize="8" fontFamily="monospace">2,980.00</text>
      <text x="472" y="122" fill="#929CA7" fontSize="8" fontFamily="monospace">2,960.00</text>
      <text x="472" y="147" fill="#929CA7" fontSize="8" fontFamily="monospace">2,940.00</text>

      {chartMode === "candlestick" ? (
        candles.map((c, i) => {
          const color = c.isUp ? "#35C98A" : "#E36B73";
          const top = Math.min(c.open, c.close);
          const height = Math.max(2, Math.abs(c.open - c.close));
          const volHeight = (c.vol / 60) * 20;

          return (
            <g key={i}>
              {/* Volume Bar */}
              <rect
                x={c.x}
                y={165 - volHeight}
                width={4.5}
                height={volHeight}
                fill={color}
                opacity="0.35"
              />
              {/* Upper/Lower Wick */}
              <line x1={c.x + 2.25} y1={c.high} x2={c.x + 2.25} y2={c.low} stroke={color} strokeWidth="1" />
              {/* Candle Body */}
              <rect
                x={c.x}
                y={top}
                width={4.5}
                height={height}
                fill={color}
                stroke={color}
                rx="0.5"
              />
            </g>
          );
        })
      ) : (
        <>
          {/* Area Fill */}
          <polygon
            points={`14.25,165 ${linePoints} 454.25,165`}
            fill="url(#goldGradient)"
            opacity="0.25"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D6B75E" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D6B75E" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Line Stroke */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#D6B75E"
            strokeWidth="1.8"
          />
        </>
      )}

      {/* Time Scale Bottom Labels */}
      <text x="12" y="167" fill="#929CA7" fontSize="7.5" fontFamily="monospace">09:15</text>
      <text x="75" y="167" fill="#929CA7" fontSize="7.5" fontFamily="monospace">10:00</text>
      <text x="140" y="167" fill="#929CA7" fontSize="7.5" fontFamily="monospace">11:00</text>
      <text x="205" y="167" fill="#929CA7" fontSize="7.5" fontFamily="monospace">12:00</text>
      <text x="270" y="167" fill="#929CA7" fontSize="7.5" fontFamily="monospace">13:00</text>
      <text x="335" y="167" fill="#929CA7" fontSize="7.5" fontFamily="monospace">14:00</text>
      <text x="400" y="167" fill="#929CA7" fontSize="7.5" fontFamily="monospace">15:00</text>
    </svg>
  );

  return (
    <>
      <div
        className="fin-panel-box col-span-8 rounded-[8px] bg-[#101A23] border border-[#26333D] p-2.5 flex flex-col justify-between h-[215px] transition-all duration-300 hover:border-[#D6B75E]/30"
        style={{ height: 215, padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        {/* Top Controls: Timeframes & Fullscreen */}
        <div className="flex items-center justify-between pb-1 border-b border-[#26333D]">
          <div className="flex items-center gap-1 text-[10px]">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`fin-timeframe-btn h-[20px] px-2 rounded-[4px] font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                  timeframe === tf
                    ? "active bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E] shadow-xs"
                    : "text-[#929CA7] hover:text-[#E7E9EC] hover:bg-[#131F29]"
                }`}
                style={{
                  height: 20,
                  padding: "0 8px",
                  borderRadius: 4,
                  fontSize: "10px",
                  backgroundColor: timeframe === tf ? "#1E1A11" : "transparent",
                  border: timeframe === tf ? "1px solid #D6B75E" : "1px solid transparent",
                  color: timeframe === tf ? "#D6B75E" : "#929CA7"
                }}
              >
                {tf}
              </button>
            ))}

            {/* Candlestick / Line Mode Toggle Icon */}
            <button
              onClick={() => setChartMode(chartMode === "candlestick" ? "line" : "candlestick")}
              className="h-[20px] px-1.5 rounded text-[#929CA7] hover:text-[#E7E9EC] hover:bg-[#131F29] transition-colors cursor-pointer"
              style={{ background: "transparent", border: "none", color: chartMode === "line" ? "#D6B75E" : "#929CA7", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              title={`Switch to ${chartMode === "candlestick" ? "Line" : "Candlestick"} View`}
            >
              <span className="font-mono text-[10px]">
                {chartMode === "candlestick" ? "⫽" : "∿"}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(true)}
            className="text-[#929CA7] hover:text-white transition-colors cursor-pointer"
            style={{ background: "transparent", border: "none", color: "#929CA7", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Expand Fullscreen Chart"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG Chart */}
        <div className="flex-1 w-full relative pt-1 chart-render-anim">
          {renderSvgContent()}
        </div>
      </div>

      {/* Expanded Chart Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[1100px] h-[650px] rounded-[10px] bg-[#101A23] border border-[#26333D] p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#26333D] pb-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[14px] text-[#E7E9EC]">{ticker} Candlestick Analysis</span>
                <span className="text-[11px] font-bold text-[#26C88A]">₹{currentPrice}</span>
                <span className="text-[10px] text-[#D6B75E] px-2 py-0.5 rounded bg-[#1E1A11] border border-[#D6B75E]/40 font-mono">
                  Timeframe: {timeframe}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartMode(chartMode === "candlestick" ? "line" : "candlestick")}
                  className="px-2.5 py-1 rounded bg-[#131F29] border border-[#26333D] text-[11px] text-[#D6B75E] hover:border-[#D6B75E]"
                >
                  {chartMode === "candlestick" ? "Switch to Area Line" : "Switch to Candles"}
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="w-7 h-7 rounded bg-[#131F29] border border-[#26333D] flex items-center justify-center text-[#929CA7] hover:text-white"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full relative p-4">
              {renderSvgContent(750, 320)}
            </div>

            <div className="pt-2 border-t border-[#26333D] flex items-center justify-between text-[10px] text-[#5F6D7E]">
              <span>Real-time NSE 1-second Tick Telemetry Stream</span>
              <span>Press ESC or click minimize to return</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StockChart;
