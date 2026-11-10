"use client";

import React, { useState } from "react";
import { Search, X, Star, MoreVertical, Download, Copy, BellRing, Check } from "lucide-react";

export interface TickerSelectorProps {
  ticker?: string;
  companyName?: string;
  exchange?: string;
  price?: string;
  priceChange?: string;
  isStarred?: boolean;
  onClear?: () => void;
  onStarToggle?: () => void;
  onOpenSearch?: () => void;
}

export const TickerSelector: React.FC<TickerSelectorProps> = ({
  ticker = "RELIANCE",
  companyName = "RELIANCE INDUSTRIES LTD.",
  exchange = "RELIANCE · NSE",
  price = "₹2,987.40",
  priceChange = "▲ +12.30 (+0.41%)",
  isStarred = true,
  onClear,
  onStarToggle,
  onOpenSearch
}) => {
  const [starred, setStarred] = useState(isStarred);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  };

  const handleStarClick = () => {
    const next = !starred;
    setStarred(next);
    if (onStarToggle) onStarToggle();
    showToast(next ? `Added ${ticker} to Institutional Watchlist` : `Removed ${ticker} from Watchlist`);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      `Ticker,Company,Exchange,Price,Change\n${ticker},"${companyName}",${exchange},"${price}","${priceChange}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${ticker}_institutional_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOptionsOpen(false);
    showToast(`Exported ${ticker} telemetry to CSV`);
  };

  const handleCopyBloomberg = () => {
    const symbol = `${ticker}:IN`;
    navigator.clipboard?.writeText(symbol);
    setOptionsOpen(false);
    showToast(`Copied ${symbol} to clipboard`);
  };

  const handleSetAlert = () => {
    setOptionsOpen(false);
    showToast(`Price alert activated for ${ticker} at ${price}`);
  };

  return (
    <div
      className="fin-stock-card-top flex items-center justify-between relative"
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
    >
      {/* Left: Search box & Company Identity */}
      <div
        className="fin-stock-info-group flex items-center gap-3"
        style={{ display: "flex", alignItems: "center", gap: 12 }}
      >
        {/* Search Box Pill */}
        <div
          onClick={onOpenSearch}
          className="fin-stock-search-pill"
          title="Click to search other stocks"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Search className="w-3.5 h-3.5 text-[#929CA7]" style={{ width: 13, height: 13, color: "#929CA7" }} />
            <span style={{ fontWeight: 600, fontSize: "11px", color: "#E7E9EC" }}>{ticker}</span>
          </div>
          <X
            className="w-3 h-3 text-[#929CA7] cursor-pointer hover:text-white"
            style={{ width: 12, height: 12, color: "#929CA7", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              if (onClear) onClear();
              if (onOpenSearch) onOpenSearch();
            }}
          />
        </div>

        {/* Company Logo Badge */}
        <div
          className="fin-stock-badge-r w-[30px] h-[30px] rounded-full bg-[#D6B75E] flex items-center justify-center font-bold text-[#080D12] text-xs shadow-sm"
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "#D6B75E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            color: "#080D12",
            fontSize: "12px"
          }}
        >
          <span className="font-serif font-black">{ticker.charAt(0)}</span>
        </div>

        {/* Company Name & NSE Label & Live Pill */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: "12px", color: "#E7E9EC", letterSpacing: "-0.01em" }}>
              {companyName}
            </span>
            <span
              className="fin-live-badge"
              style={{
                height: 17,
                padding: "0 8px",
                borderRadius: 9999,
                backgroundColor: "#183526",
                border: "1px solid #26C88A",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: "8.5px",
                fontWeight: 700,
                color: "#26C88A"
              }}
            >
              <span
                className="fin-pulse-dot live-pulse-dot"
                style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#26C88A", display: "inline-block" }}
              />
              Live
            </span>
          </div>
          <span style={{ fontSize: "10px", fontFamily: "var(--fin-font-mono)", color: "#929CA7" }}>
            {exchange}
          </span>
        </div>
      </div>

      {/* Right: Price & Watchlist/Options */}
      <div
        className="fin-price-group flex items-center gap-3.5"
        style={{ display: "flex", alignItems: "center", gap: 14 }}
      >
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--fin-font-mono)", color: "#E7E9EC", lineHeight: 1.15 }}>
            {price}
          </div>
          <div style={{ fontSize: "10px", fontFamily: "var(--fin-font-mono)", fontWeight: 600, color: "#35C98A" }}>
            {priceChange}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingLeft: 8, borderLeft: "1px solid #26333D" }}>
          <button
            onClick={handleStarClick}
            className="fin-icon-btn cursor-pointer transition-colors"
            style={{ width: 28, height: 28, color: starred ? "#D6B75E" : "#929CA7", display: "flex", alignItems: "center", justifyContent: "center" }}
            title={starred ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Star className={`w-3.5 h-3.5 ${starred ? "fill-current text-[#D6B75E]" : ""}`} style={{ width: 14, height: 14 }} />
          </button>

          <div className="relative">
            <button
              onClick={() => setOptionsOpen(!optionsOpen)}
              className="fin-icon-btn cursor-pointer transition-colors"
              style={{ width: 28, height: 28, color: optionsOpen ? "#E7E9EC" : "#929CA7", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Stock Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" style={{ width: 14, height: 14 }} />
            </button>

            {optionsOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-[6px] bg-[#101A23] border border-[#26333D] shadow-2xl py-1 z-50 text-[10.5px] animate-in fade-in duration-100">
                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#131F29] text-[#E7E9EC] flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D6B75E]" />
                  <span>Export to CSV / Excel</span>
                </button>
                <button
                  onClick={handleCopyBloomberg}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#131F29] text-[#E7E9EC] flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-[#45B6A3]" />
                  <span>Copy Bloomberg Ticker</span>
                </button>
                <button
                  onClick={handleSetAlert}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#131F29] text-[#E7E9EC] flex items-center gap-2 cursor-pointer"
                >
                  <BellRing className="w-3 h-3 text-[#E5A93C]" />
                  <span>Set Price Alert</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating feedback toast */}
      {toastMsg && (
        <div className="absolute right-0 -bottom-8 z-50 px-2.5 py-1 rounded bg-[#101A23] border border-[#D6B75E] text-[#D6B75E] text-[10px] font-medium shadow-lg flex items-center gap-1.5 animate-in fade-in duration-150">
          <Check className="w-3 h-3" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default TickerSelector;
