"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Repeat,
  FileUp,
  Zap,
  ChevronRight,
  Send,
  FileCheck
} from "lucide-react";
import { ToolExecutionFeed } from "./ToolExecutionFeed";

export interface ChatDeskProps {
  ticker?: string;
  onClearTicker?: () => void;
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendMessage: (query?: string) => void;
  isTyping?: boolean;
}

const SUGGESTED_PROMPTS = [
  "Summarize the latest results",
  "Analyze valuation vs. peers",
  "List key risks and catalysts"
];

export const ChatDesk: React.FC<ChatDeskProps> = ({
  ticker = "RELIANCE",
  onClearTicker,
  chatInput,
  onChatInputChange,
  onSendMessage,
  isTyping = false
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(`Processing ${file.name}...`);
      setTimeout(() => {
        setUploadProgress(`Ingested ${file.name}`);
        onSendMessage(`Summarize institutional takeaways from ${file.name}`);
        setTimeout(() => setUploadProgress(""), 3500);
      }, 1000);
    }
  };

  return (
    <aside
      className="fin-copilot w-[290px] h-full shrink-0 bg-[#070C11] border-l border-[#26333D] flex flex-col justify-between overflow-y-auto p-2.5"
      style={{ width: 290, height: "100%", flexShrink: 0, backgroundColor: "#070C11", borderLeft: "1px solid #26333D", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "10px" }}
    >
      <div className="flex flex-col gap-2" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Header */}
        <div
          className="flex items-center justify-between pb-1.5 border-b border-[#26333D]"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #26333D", paddingBottom: 6 }}
        >
          <div className="flex items-center gap-1.5" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles className="w-3.5 h-3.5 text-[#D6B75E]" style={{ width: 14, height: 14, color: "#D6B75E" }} />
            <div>
              <h3 className="text-[11.5px] font-bold text-[#E7E9EC] leading-tight" style={{ fontSize: "11.5px", fontWeight: 700, color: "#E7E9EC", margin: 0, lineHeight: 1.15 }}>
                AI Co-Pilot
              </h3>
              <p className="text-[8.5px] text-[#929CA7]" style={{ fontSize: "8.5px", color: "#929CA7", margin: 0 }}>
                Your financial research companion
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-5 h-5 rounded-[4px] bg-[#101A23] border border-[#26333D] flex items-center justify-center text-[#929CA7] hover:text-white cursor-pointer"
            style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: "#101A23", border: "1px solid #26333D", display: "flex", alignItems: "center", justifyContent: "center" }}
            title={isOpen ? "Collapse Panel" : "Expand Panel"}
          >
            {isOpen ? <ChevronUp className="w-3 h-3" style={{ width: 12, height: 12 }} /> : <ChevronDown className="w-3 h-3" style={{ width: 12, height: 12 }} />}
          </button>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <>
            {/* Ticker Context */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span className="text-[9.5px] text-[#929CA7] block font-medium" style={{ fontSize: "9.5px", color: "#929CA7", fontWeight: 500 }}>
                Ticker Context
              </span>
              <div
                className="h-[28px] px-2 rounded-[5px] bg-[#101A23] border border-[#26333D] flex items-center justify-between"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 28, padding: "0 8px", borderRadius: 5, backgroundColor: "#101A23", border: "1px solid #26333D" }}
              >
                <div className="flex items-center gap-1.5" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    className="w-4 h-4 rounded-full bg-[#D6B75E] flex items-center justify-center font-bold text-[8.5px] text-[#080D12]"
                    style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#D6B75E", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "8.5px", color: "#080D12" }}
                  >
                    {ticker.charAt(0)}
                  </div>
                  <span className="font-bold text-[10.5px] font-mono text-[#E7E9EC]" style={{ fontWeight: 700, fontSize: "10.5px", fontFamily: "var(--fin-font-mono)", color: "#E7E9EC" }}>
                    {ticker}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClearTicker}
                  className="text-[#929CA7] hover:text-white cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                  title="Clear Ticker Filter"
                >
                  <X className="w-3 h-3" style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </div>

            {/* ReAct Loop Card with Tools Grid */}
            <div
              className="rounded-[6px] bg-[#101A23] border border-[#26333D] p-2 space-y-1"
              style={{ borderRadius: 6, backgroundColor: "#101A23", border: "1px solid #26333D", padding: "8px", display: "flex", flexDirection: "column", gap: 4 }}
            >
              <div>
                <div className="flex items-center gap-1 text-[9.5px] font-semibold text-[#E7E9EC]" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "9.5px", fontWeight: 600, color: "#E7E9EC" }}>
                  <Repeat className="w-3 h-3 text-[#D6B75E]" style={{ width: 12, height: 12, color: "#D6B75E" }} />
                  <span>ReAct Loop</span>
                  <span className="text-[#929CA7] text-[8.5px] font-normal" style={{ color: "#929CA7", fontSize: "8.5px", fontWeight: 400 }}>
                    (Reason → Act → Observe)
                  </span>
                </div>
                <span className="text-[8.5px] text-[#929CA7] pl-4 block" style={{ fontSize: "8.5px", color: "#929CA7", paddingLeft: 18, display: "block" }}>
                  31 Tools Available
                </span>
              </div>

              {/* 6 Research Tools Grid */}
              <ToolExecutionFeed onSelectTool={(q) => onSendMessage(q)} />
            </div>

            {/* Upload PDF Dropzone with Real Native File Picker */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              style={{ display: "none" }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="fin-pdf-dropzone rounded-[6px] border border-dashed border-[#26333D] bg-[#101A23] p-2 text-center space-y-0.5 hover:border-[#D6B75E]/50 cursor-pointer transition-colors group"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 10px", textAlign: "center", borderRadius: 6, border: "1px dashed #26333D", backgroundColor: "#101A23" }}
              title="Click to upload institutional earnings PDF"
            >
              {uploadProgress ? (
                <div className="flex items-center gap-1.5 text-[10px] text-[#26C88A] font-bold">
                  <FileCheck className="w-3.5 h-3.5 text-[#26C88A]" />
                  <span>{uploadProgress}</span>
                </div>
              ) : (
                <>
                  <FileUp className="w-3.5 h-3.5 mx-auto text-[#D6B75E] group-hover:scale-110 transition-transform" style={{ width: 14, height: 14, color: "#D6B75E" }} />
                  <span className="text-[10px] font-bold text-[#E7E9EC] block" style={{ fontSize: "10px", fontWeight: 700, color: "#E7E9EC" }}>
                    Upload PDF
                  </span>
                  <p className="text-[8.5px] text-[#929CA7]" style={{ fontSize: "8.5px", color: "#929CA7", margin: 0 }}>
                    Earnings, Reports, Presentations, Research, etc.
                  </p>
                </>
              )}
            </div>

            {/* Suggested Prompts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div className="flex items-center gap-1 text-[9.5px] font-bold text-[#E7E9EC]" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "9.5px", fontWeight: 700, color: "#E7E9EC" }}>
                <Zap className="w-3 h-3 text-[#D6B75E]" style={{ width: 12, height: 12, color: "#D6B75E" }} />
                <span>Suggested Prompts</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(p)}
                    className="fin-prompt-pill prompt-pill w-full h-[24px] px-2 rounded-[4px] bg-[#101A23] border border-[#26333D] hover:border-[#D6B75E]/60 flex items-center justify-between text-[9px] text-[#929CA7] hover:text-[#E7E9EC] transition-colors cursor-pointer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24, padding: "0 8px", fontSize: "9px" }}
                  >
                    <span className="truncate">{p}</span>
                    <ChevronRight className="w-3 h-3 text-[#929CA7]" style={{ width: 12, height: 12, color: "#929CA7" }} />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chat Input Bar Pinned at Bottom */}
      <div className="pt-2 mt-auto" style={{ paddingTop: 8, marginTop: "auto" }}>
        <div
          className="fin-chat-bar h-[32px] px-2.5 rounded-[5px] bg-[#101A23] border border-[#26333D] flex items-center justify-between gap-1.5 focus-within:border-[#D6B75E]/70 transition-colors"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 32, padding: "0 10px", borderRadius: 5, backgroundColor: "#101A23", border: "1px solid #26333D", gap: 6 }}
        >
          <div className="flex items-center gap-1.5 flex-1" style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
            <Sparkles className="w-3 h-3 text-[#D6B75E] shrink-0" style={{ width: 12, height: 12, color: "#D6B75E" }} />
            <input
              type="text"
              value={chatInput}
              onChange={(e) => onChatInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
              placeholder="Ask FinAnalyst..."
              className="fin-chat-input bg-transparent text-[10px] text-[#E7E9EC] placeholder-[#929CA7] focus:outline-none w-full"
              style={{ background: "transparent", border: "none", fontSize: "10px", color: "#E7E9EC", width: "100%" }}
            />
          </div>
          <button
            onClick={() => onSendMessage()}
            disabled={isTyping}
            className="w-5 h-5 rounded flex items-center justify-center text-[#D6B75E] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            style={{ width: 20, height: 20, background: "transparent", border: "none", color: "#D6B75E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Send Query to AI Co-Pilot"
          >
            <Send className="w-3 h-3" style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ChatDesk;
