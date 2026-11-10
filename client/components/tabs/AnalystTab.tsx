/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Play, AlertTriangle, CheckCircle2 } from "lucide-react";

interface AnalystTabProps {
  selectedTicker: string;
  taskName: string;
  setTaskName: (v: string) => void;
  taskEvents: any[];
  taskThread: string;
  taskPendingGate: any | null;
  taskRunning: boolean;
  redirectInput: string;
  setRedirectInput: (v: string) => void;
  startTaskAgent: () => Promise<void>;
  resumeTaskAgent: (decision: string) => Promise<void>;
}

export default function AnalystTab({
  taskName,
  setTaskName,
  taskEvents,
  taskThread,
  taskPendingGate,
  taskRunning,
  redirectInput,
  setRedirectInput,
  startTaskAgent,
  resumeTaskAgent,
}: AnalystTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-400" />
              Step-by-Step Analyst Task Desk (Human-in-the-Loop)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              LangGraph-style execution: The agent proposes one analytics step, halts at an approval gate, and waits for your confirmation before continuing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task objective..."
              className="bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-zinc-200 w-72 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={startTaskAgent}
              disabled={taskRunning}
              className="flex items-center gap-2 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {taskRunning ? "Running..." : "Initialize Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Human Approval Gate */}
      {taskPendingGate && (
        <div className="bg-amber-950/30 border-2 border-amber-500/60 rounded-lg p-5 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Human Approval Required (Step {taskPendingGate.step} / {taskPendingGate.total_steps})
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Thread ID: {taskThread.slice(0, 8)}...</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">{taskPendingGate.title}</h3>
                <p className="text-xs text-zinc-300 mt-1">{taskPendingGate.description}</p>
              </div>

              <div className="bg-zinc-900/90 border border-amber-500/30 rounded p-3 text-xs font-mono text-amber-200">
                <strong>Proposed Action:</strong> {taskPendingGate.proposed_action}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => resumeTaskAgent("approve")}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve &amp; Proceed
                </button>

                <button
                  onClick={() => resumeTaskAgent("stop")}
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow"
                >
                  Stop Execution
                </button>

                <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                  <input
                    type="text"
                    value={redirectInput}
                    onChange={(e) => setRedirectInput(e.target.value)}
                    placeholder="Optional redirect instructions..."
                    className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded text-xs text-zinc-200 flex-1 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => resumeTaskAgent(`redirect:${redirectInput}`)}
                    className="px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-xs font-medium"
                  >
                    Redirect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Audit Log / Timeline */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Desk Audit Log</h3>
        {taskEvents.length === 0 && !taskRunning && (
          <div className="text-center py-12 text-zinc-500 text-xs">
            Click <strong>Initialize Plan</strong> to trigger the autonomous multi-step analyst workflow.
          </div>
        )}

        <div className="space-y-3">
          {taskEvents.map((evt, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
              {evt.type === "intro" && (
                <div className="text-blue-400 font-medium">{evt.text}</div>
              )}
              {evt.type === "phase" && (
                <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {evt.phase}
                  <span className="text-zinc-500 font-normal">({evt.detail})</span>
                </div>
              )}
              {evt.type === "step_result" && (
                <div className="space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {evt.title}
                  </div>
                  <div className="whitespace-pre-line text-zinc-300 bg-zinc-950 p-3 rounded border border-zinc-800/80 font-mono text-[11px] leading-relaxed">
                    {evt.content}
                  </div>
                </div>
              )}
              {evt.type === "final" && (
                <div className="space-y-2 border-t border-zinc-800 pt-3">
                  <div className="font-bold text-white text-sm">Final Analyst Dossier</div>
                  <div className="whitespace-pre-line text-zinc-200 bg-zinc-950 p-4 rounded border border-blue-500/30 leading-relaxed font-sans text-xs">
                    {evt.text}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
