/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Users } from "lucide-react";

interface EcosystemTabProps {
  selectedTicker: string;
  ecosystemEvents: any[];
}

export default function EcosystemTab({ selectedTicker, ecosystemEvents }: EcosystemTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-base font-bold text-white flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-400" />
        Ecosystem &amp; Direct Competitor Pricing: {selectedTicker}
      </h2>

      {ecosystemEvents.map((evt, idx) => {
        if (evt.type === "map") {
          return (
            <div key={idx} className="space-y-6">
              {/* Competitor multiples */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Direct Competitor Multiples</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {evt.competitors?.map((p: any, i: number) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800/80 rounded p-3.5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{p.name} ({p.ticker})</span>
                        <span className="font-mono text-zinc-200 font-bold">₹{p.price}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 font-mono">
                        <span>P/E: <strong className="text-zinc-200">{p.pe}x</strong></span>
                        <span>ROE: <strong className="text-emerald-400">{p.roe}%</strong></span>
                        <span>Beta: <strong className="text-zinc-200">{p.beta}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Network map */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
                  <span className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">Key Customers</span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {evt.customers?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Key Suppliers</span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {evt.suppliers?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Strategic Partners</span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {evt.partners?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          );
        }
        if (evt.type === "summary") {
          return (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 text-xs whitespace-pre-line text-zinc-200 leading-relaxed">
              {evt.text}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
