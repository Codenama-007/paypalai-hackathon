"use client";

import { FileText, RefreshCw } from "lucide-react";

interface ReportTabProps {
  selectedTicker: string;
  reportEvents: any[];
  loadReport: () => Promise<void>;
}

export default function ReportTab({ selectedTicker, reportEvents, loadReport }: ReportTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          Institutional Equity Research Note Generator: {selectedTicker}
        </h2>
        <button
          onClick={loadReport}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs text-white font-medium flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-Generate Note
        </button>
      </div>

      {reportEvents.map((evt, idx) => {
        if (evt.type === "result") {
          return (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-xs whitespace-pre-line leading-relaxed text-zinc-200 font-sans shadow-md">
              {evt.text}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
