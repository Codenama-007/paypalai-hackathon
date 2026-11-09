"use client";

import React from "react";
import { Maximize2 } from "lucide-react";
import { Timeframe } from "@/types/dashboard";

export interface CandlestickChartProps {
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
}

const TIMEFRAMES: Timeframe[] = ["1D", "5D", "1M", "6M", "1Y", "5Y", "Max"];

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  timeframe,
  onTimeframeChange
}) => {
  return (
    <div className="fin-panel-box col-span-8 rounded-[8px] bg-[#101A23] border border-[#26333D] p-3 flex flex-col justify-between h-[255px]">
      {/* Top Controls: Timeframes & Fullscreen */}
      <div className="flex items-center justify-between pb-1 border-b border-[#26333D]">
        <div className="flex items-center gap-1 text-[10px]">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`fin-timeframe-btn h-[20px] px-2 rounded-[4px] font-semibold transition-colors ${
                timeframe === tf
                  ? "active bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E]"
                  : "text-[#929CA7] hover:text-[#E7E9EC]"
              }`}
            >
              {tf}
            </button>
          ))}
          {/* Candlestick Toggle Icon */}
          <button className="h-[20px] px-1.5 rounded text-[#929CA7] hover:text-[#E7E9EC]">
            <span className="font-mono text-[10px]">⫽</span>
          </button>
        </div>

        <button className="text-[#929CA7] hover:text-white" title="Fullscreen">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Exact Candlestick SVG Chart Matching Screenshot */}
      <div className="flex-1 w-full relative pt-1">
        <svg className="w-full h-full" viewBox="0 0 520 170" preserveAspectRatio="none">
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
          <text x="471" y="78" fill="#080D12" fontSize="7.5" fontWeight="bold" fontFamily="monospace">2,987.40</text>
          <text x="472" y="95" fill="#929CA7" fontSize="8" fontFamily="monospace">2,980.00</text>
          <text x="472" y="122" fill="#929CA7" fontSize="8" fontFamily="monospace">2,960.00</text>
          <text x="472" y="147" fill="#929CA7" fontSize="8" fontFamily="monospace">2,940.00</text>

          {/* Candlestick Pattern Sequence */}
          {[
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
          ].map((c, i) => {
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
                  strokeWidth="0.5"
                  rx="0.5"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Time Labels */}
      <div className="flex justify-between text-[9px] font-mono text-[#929CA7] px-2 pt-0.5 border-t border-[#26333D]">
        <span>09:15</span>
        <span>10:00</span>
        <span>11:00</span>
        <span>12:00</span>
        <span>13:00</span>
        <span>14:00</span>
        <span>15:00</span>
      </div>
    </div>
  );
};

export default CandlestickChart;

