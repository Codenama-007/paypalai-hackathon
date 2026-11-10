"use client";

import React from "react";
import { X } from "lucide-react";

export interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectText: string;
  onRedirectTextChange: (text: string) => void;
  onConfirm: () => void;
}

export const RedirectModal: React.FC<RedirectModalProps> = ({
  isOpen,
  onClose,
  redirectText,
  onRedirectTextChange,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-[8px] bg-[#101A23] border border-[#26333D] p-4 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#26333D] pb-2">
          <span className="text-[12px] font-bold text-[#E7E9EC] uppercase tracking-wider">
            Redirect Research Focus
          </span>
          <button onClick={onClose} className="text-[#929CA7] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <textarea
          value={redirectText}
          onChange={(e) => onRedirectTextChange(e.target.value)}
          placeholder="Provide redirected thesis constraints (e.g. Focus on new energy solar gigafactory and capex timeline)..."
          rows={3}
          className="w-full bg-[#080D12] border border-[#26333D] p-2.5 rounded text-[11px] text-[#E7E9EC] focus:outline-none focus:border-[#D6B75E]"
        />
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-[11px] text-[#929CA7] hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="fin-gate-redirect-btn px-3.5 py-1.5 rounded text-[11px] font-semibold bg-[#251F12] border border-[#D6B75E] text-[#D6B75E] hover:bg-[#362C16]"
          >
            Confirm Redirect
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedirectModal;

