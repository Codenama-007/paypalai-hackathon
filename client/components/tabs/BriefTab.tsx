/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Layers, RefreshCw } from "lucide-react";

interface BriefTabProps {
  briefEvents: any[];
  loadBrief: () => Promise<void>;
}

export default function BriefTab({ briefEvents, loadBrief }: BriefTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Morning Pre-Market Desk Brief
        </h2>
        <button
          onClick={loadBrief}
          className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Cues
        </button>
      </div>

      <div className="space-y-4">
        {briefEvents.map((evt, idx) => {
          if (evt.type === "markets") {
            return (
              <div key={idx} className="space-y-4">
                {/* Indices grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {evt.indices?.map((m: any, i: number) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded p-3 text-xs">
                      <span className="text-zinc-400 text-[11px]">{m.name}</span>
                      <div className="font-bold text-white font-mono mt-1">{m.value}</div>
                      <span className={`text-[11px] font-semibold ${m.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {m.change >= 0 ? "+" : ""}{m.change_pct}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Commodities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {evt.commodities?.map((c: any, i: number) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded p-3 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{c.name}</span>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{c.impact}</p>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-zinc-200">{c.value} {c.unit}</span>
                        <div className={`text-[11px] ${c.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {c.change >= 0 ? "+" : ""}{c.change_pct}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (evt.type === "brief") {
            return (
              <div key={idx} className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 text-xs whitespace-pre-line leading-relaxed text-zinc-200">
                {evt.text}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
