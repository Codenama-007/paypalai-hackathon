"use client";

import { StockQuote } from "@/lib/types";

interface TickerRibbonProps {
  quote: StockQuote | null;
}

export default function TickerRibbon({ quote }: TickerRibbonProps) {
  if (!quote) return null;

  return (
    <div className="bg-zinc-900/60 border-b border-zinc-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Name, ticker, sector, source badge */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-white">{quote.name}</span>
          <span className="text-zinc-400 text-xs">({quote.ticker}.NS)</span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">
            {quote.sector}
          </span>
          <span
            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
              quote.source === "live"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {quote.source === "live" ? "● Live yfinance" : "⚡ Offline Seed"}
          </span>
        </div>

        {/* Right: Key metrics */}
        <div className="flex items-center gap-5 text-zinc-300 font-mono">
          <div className="flex items-baseline gap-1.5">
            <span className="text-zinc-400 text-[11px]">CMP:</span>
            <span className="text-base font-bold text-white">₹{quote.price.toFixed(2)}</span>
            <span
              className={`text-xs font-semibold flex items-center ${
                quote.change >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {quote.change >= 0 ? "+" : ""}
              {quote.change.toFixed(2)} ({quote.change_pct.toFixed(2)}%)
            </span>
          </div>
          <div>
            <span className="text-zinc-400 text-[11px]">P/E:</span>{" "}
            <span className="font-semibold text-zinc-200">{quote.pe}x</span>{" "}
            <span className="text-zinc-500 text-[10px]">(Sec: {quote.sector_pe}x)</span>
          </div>
          <div>
            <span className="text-zinc-400 text-[11px]">ROE:</span>{" "}
            <span className="font-semibold text-zinc-200">{quote.roe}%</span>
          </div>
          <div>
            <span className="text-zinc-400 text-[11px]">RSI(14):</span>{" "}
            <span className="font-semibold text-zinc-200">{quote.rsi}</span>
          </div>
          <div>
            <span className="text-zinc-400 text-[11px]">Beta:</span>{" "}
            <span className="font-semibold text-zinc-200">{quote.beta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
