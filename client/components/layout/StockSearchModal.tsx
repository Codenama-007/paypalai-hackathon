"use client";

import React, { useState } from "react";
import { Search, X, ArrowUpRight, TrendingUp } from "lucide-react";
import { STOCKS } from "@/lib/marketData";

export interface StockSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (ticker: string) => void;
}

export const StockSearchModal: React.FC<StockSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStock
}) => {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const stockList = Object.values(STOCKS);
  const filtered = query.trim()
    ? stockList.filter(
        (s) =>
          s.ticker.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.sector.toLowerCase().includes(query.toLowerCase())
      )
    : stockList;

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
        className="fin-modal-card w-full max-w-[500px]"
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#101A23",
          border: "1px solid #26333D",
          borderRadius: 8,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.65)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Search Bar Input */}
        <div
          className="fin-modal-header p-3.5 border-b border-[#26333D] flex items-center gap-2.5"
          style={{
            padding: "12px 16px",
            backgroundColor: "#0B1219",
            borderBottom: "1px solid #26333D",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <Search className="w-4 h-4 text-[#D6B75E] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NSE Equities, Tickers, or Sectors (e.g. RELIANCE, TCS, Banking)..."
            className="w-full bg-transparent text-[12px] text-[#E7E9EC] placeholder-[#5F6D7E] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#929CA7] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-[#131F29] border border-[#26333D] text-[#929CA7] text-[10px] hover:text-white shrink-0 ml-1"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-[#929CA7] text-[11px]">
              No matching equities found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => {
                  onSelectStock(stock.ticker);
                  onClose();
                }}
                className="w-full p-2.5 rounded-[6px] hover:bg-[#131F29] border border-transparent hover:border-[#26333D] flex items-center justify-between transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1E1A11] border border-[#D6B75E] text-[#D6B75E] font-bold text-[10.5px] flex items-center justify-center font-mono">
                    {stock.ticker.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-[11.5px] text-[#E7E9EC] group-hover:text-[#D6B75E]">
                        {stock.ticker}
                      </span>
                      <span className="text-[9px] text-[#5F6D7E] uppercase px-1 rounded bg-[#0B1219]">
                        {stock.sector}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#929CA7] truncate block max-w-[240px]">
                      {stock.name}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[11.5px] font-bold text-[#E7E9EC] block">
                    {stock.price}
                  </span>
                  <span
                    className={`text-[9.5px] font-semibold flex items-center justify-end gap-0.5 ${
                      stock.isPositive ? "text-[#26C88A]" : "text-[#E36B73]"
                    }`}
                  >
                    <TrendingUp className="w-2.5 h-2.5" />
                    {stock.priceChange}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 border-t border-[#26333D] bg-[#070C11] flex items-center justify-between text-[9.5px] text-[#5F6D7E]">
          <span>NSE Realtime Data Feed</span>
          <span className="flex items-center gap-1">
            Click to switch active analyst desk <ArrowUpRight className="w-3 h-3 text-[#D6B75E]" />
          </span>
        </div>
      </div>
    </div>
  );
};

