"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";
import { ChatMessage } from "@/types/dashboard";

export interface ChatDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isTyping?: boolean;
}

export const ChatDialogueModal: React.FC<ChatDialogueModalProps> = ({
  isOpen,
  onClose,
  messages,
  isTyping = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-14 right-80 w-96 rounded-[8px] bg-[#101A23] border border-[#26333D] shadow-2xl p-3 space-y-2 z-50">
      <div className="flex items-center justify-between border-b border-[#26333D] pb-1.5">
        <span className="text-[11px] font-bold text-[#D6B75E] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D6B75E]" />
          FinAnalyst Co-Pilot Dialogue
        </span>
        <button onClick={onClose} className="text-[#929CA7] hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 text-[11px] pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2 rounded leading-relaxed border ${
              m.role === "user"
                ? "bg-[#131F29] border-[#26333D] text-[#E7E9EC] ml-4"
                : "bg-[#080D12] border-[#26333D] text-[#929CA7] mr-4"
            }`}
          >
            <span className="text-[9px] font-bold block mb-0.5 text-[#D6B75E]">
              {m.role === "user" ? "You" : "FinAnalyst AI"}
            </span>
            <div className="whitespace-pre-line text-[#E7E9EC]">{m.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="text-[10px] text-[#D6B75E] font-mono animate-pulse flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 animate-spin" />
            Analyzing live market data & computing factors...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDialogueModal;

