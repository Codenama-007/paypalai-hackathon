"use client";

import { Activity, Layers, Play, RefreshCw, Send } from "lucide-react";

interface ChatTabProps {
  selectedTicker: string;
  chatInput: string;
  setChatInput: (v: string) => void;
  chatMessages: any[];
  chatStreaming: boolean;
  chatStreamSteps: any[];
  handleSendChat: () => Promise<void>;
}

export default function ChatTab({
  selectedTicker,
  chatInput,
  setChatInput,
  chatMessages,
  chatStreaming,
  chatStreamSteps,
  handleSendChat,
}: ChatTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 cols: Chat Messages */}
      <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-lg flex flex-col h-[650px] shadow-sm">
        <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">ReAct Agent Chat: {selectedTicker}</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">SEBI Compliance Active</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3.5 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-zinc-800/90 text-zinc-200 border border-zinc-700/60"
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>
                {msg.source && (
                  <div className="mt-2 text-[10px] text-zinc-400 font-mono border-t border-zinc-700/40 pt-1">
                    Source: {msg.source}
                  </div>
                )}
              </div>
            </div>
          ))}

          {chatStreaming && (
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3 text-xs text-zinc-400 flex items-center gap-2 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              Agent orchestrating tools &amp; evaluating compliance filters...
            </div>
          )}
        </div>

        <div className="p-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            placeholder={`Ask questions about ${selectedTicker} (valuation, technicals, balance sheet, risk)...`}
            className="bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-xs text-zinc-200 flex-1 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendChat}
            disabled={chatStreaming}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right col: Live ReAct Tool Execution Inspector */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col h-[650px]">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          ReAct Tool Execution Feed
        </h3>
        <p className="text-[11px] text-zinc-400 mb-3">
          Live stream of tools executed by the Python ReAct backend engine.
        </p>

        <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[11px]">
          {chatStreamSteps.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 text-xs font-sans">
              Send a question to inspect live Python tool calls, metrics extraction, and self-review steps.
            </div>
          ) : (
            chatStreamSteps.map((s, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded p-2.5 space-y-1">
                {s.type === "tool_call" && (
                  <div className="text-blue-400 flex items-center gap-1.5 font-semibold">
                    <Play className="w-3 h-3 text-blue-500" />
                    TOOL: {s.tool}
                  </div>
                )}
                {s.type === "tool_result" && (
                  <div className="text-emerald-400 pl-4 text-[10px]">
                    DATA: {JSON.stringify(s.data)}
                  </div>
                )}
                {s.type === "phase" && (
                  <div className="text-amber-400 font-semibold">{s.phase}: {s.detail}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
