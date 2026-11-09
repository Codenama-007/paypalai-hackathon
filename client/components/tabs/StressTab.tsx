"use client";

import { Sliders } from "lucide-react";

interface StressTabProps {
  stressScenario: string;
  setStressScenario: (v: string) => void;
  marketShock: number;
  setMarketShock: (v: number) => void;
  crudeShock: number;
  setCrudeShock: (v: number) => void;
  inrShock: number;
  setInrShock: (v: number) => void;
  rateShock: number;
  setRateShock: (v: number) => void;
  stressEvents: any[];
  runStressTest: () => Promise<void>;
}

export default function StressTab({
  stressScenario,
  setStressScenario,
  marketShock,
  setMarketShock,
  crudeShock,
  setCrudeShock,
  inrShock,
  setInrShock,
  rateShock,
  setRateShock,
  stressEvents,
  runStressTest,
}: StressTabProps) {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          Macroeconomic Factor Stress Shock Model
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] text-zinc-400">NIFTY Market Drop (%)</label>
            <input
              type="number"
              value={marketShock}
              onChange={(e) => setMarketShock(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400">Brent Crude Shock (%)</label>
            <input
              type="number"
              value={crudeShock}
              onChange={(e) => setCrudeShock(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400">USD/INR Depreciation (%)</label>
            <input
              type="number"
              value={inrShock}
              onChange={(e) => setInrShock(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400">Interest Rate Spike (bps)</label>
            <input
              type="number"
              value={rateShock}
              onChange={(e) => setRateShock(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
            />
          </div>
        </div>
        <button
          onClick={runStressTest}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center gap-2"
        >
          <Sliders className="w-3.5 h-3.5" />
          Simulate Factor Shocks
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {stressEvents.map((evt, idx) => {
          if (evt.type === "shock") {
            return (
              <div key={idx} className="bg-rose-950/20 border border-rose-500/40 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300 font-semibold uppercase">Scenario: {evt.scenario}</span>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">
                    Stressed Value: ₹{evt.stressed_value?.toLocaleString()}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-zinc-400">Projected Portfolio Loss:</span>
                  <div className="text-xl font-bold text-rose-400">
                    -₹{Math.abs(evt.total_drawdown)?.toLocaleString()} ({evt.drawdown_pct}%)
                  </div>
                </div>
              </div>
            );
          }
          if (evt.type === "narrative") {
            return (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 text-xs whitespace-pre-line leading-relaxed text-zinc-200">
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
