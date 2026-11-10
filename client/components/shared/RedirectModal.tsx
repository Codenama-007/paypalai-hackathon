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
    <div
      className="fin-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(4, 7, 10, 0.82)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px"
      }}
    >
      <div
        className="fin-modal-card w-full max-w-sm"
        style={{
          width: "100%",
          maxWidth: 380,
          backgroundColor: "#101A23",
          border: "1px solid #26333D",
          borderRadius: 8,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.65)",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
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

