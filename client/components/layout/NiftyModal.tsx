"use client";

import React from "react";
import { X, TrendingUp, BarChart2 } from "lucide-react";
import { NIFTY_MARKET_SUMMARY } from "@/lib/marketData";

export interface NiftyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (ticker: string) => void;
}

export const NiftyModal: React.FC<NiftyModalProps> = ({
  isOpen,
  onClose,
  onSelectStock
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fin-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(4, 7, 10, 0.82)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px"
      }}
    >
      <div
        className="fin-modal-card w-full max-w-[480px]"
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: "#101A23",
          border: "1px solid #26333D",
          borderRadius: 8,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.65)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "18px",
          gap: "14px"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#26333D] pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#D6B75E]" />
            <h3 className="text-[13px] font-bold text-[#E7E9EC]">
              NSE: NIFTY 50 Market Pulse
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded flex items-center justify-center text-[#929CA7] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level & Change */}
        <div className="p-3 rounded-[6px] bg-[#0B1219] border border-[#26333D] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#929CA7] block">Index Level</span>
            <span className="text-[18px] font-bold font-mono text-[#E7E9EC]">
              {NIFTY_MARKET_SUMMARY.current}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold font-mono text-[#26C88A] block">
              ▲ {NIFTY_MARKET_SUMMARY.percentChange} ({NIFTY_MARKET_SUMMARY.change})
            </span>
            <span className="text-[9.5px] text-[#929CA7]">
              P/E Ratio: {NIFTY_MARKET_SUMMARY.pe}x
            </span>
          </div>
        </div>

        {/* Intraday Range Bar */}
        <div className="space-y-1.5 text-[10px]">
          <div className="flex justify-between text-[#929CA7]">
            <span>Low: {NIFTY_MARKET_SUMMARY.low}</span>
            <span>Open: {NIFTY_MARKET_SUMMARY.open}</span>
            <span>High: {NIFTY_MARKET_SUMMARY.high}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#1C2731] relative overflow-hidden">
            <div className="absolute left-[20%] right-[15%] top-0 bottom-0 bg-[#26C88A] rounded-full" />
          </div>
        </div>

        {/* Breadth: Advances vs Declines */}
        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
          <div className="p-2 rounded bg-[#18221B] border border-[#26C88A]/40 flex items-center justify-between">
            <span className="text-[#929CA7]">Advances</span>
            <span className="font-bold text-[#26C88A]">{NIFTY_MARKET_SUMMARY.advances}</span>
          </div>
          <div className="p-2 rounded bg-[#2B1417] border border-[#E36B73]/40 flex items-center justify-between">
            <span className="text-[#929CA7]">Declines</span>
            <span className="font-bold text-[#E36B73]">{NIFTY_MARKET_SUMMARY.declines}</span>
          </div>
        </div>

        {/* Top Movers List */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#929CA7] block">
            Top Constituents
          </span>
          <div className="space-y-1 max-h-[140px] overflow-y-auto">
            {NIFTY_MARKET_SUMMARY.topMovers.map((mover) => (
              <button
                key={mover.ticker}
                onClick={() => {
                  onSelectStock(mover.ticker);
                  onClose();
                }}
                className="w-full h-[30px] px-2.5 rounded-[4px] bg-[#0B1219] hover:bg-[#131F29] border border-[#26333D] flex items-center justify-between text-[11px] group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-[#D6B75E]" />
                  <span className="font-bold font-mono text-[#E7E9EC] group-hover:text-[#D6B75E]">
                    {mover.ticker}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[#929CA7]">{mover.price}</span>
                  <span
                    className={
                      mover.change.startsWith("+")
                        ? "text-[#26C88A] font-semibold"
                        : "text-[#E36B73] font-semibold"
                    }
                  >
                    {mover.change}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

