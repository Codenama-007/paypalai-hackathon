"use client";

import React from "react";
import { Shield, Check, Repeat, Square } from "lucide-react";
import { ApprovalStatus } from "@/types/dashboard";

export interface ApprovalGateProps {
  status: ApprovalStatus;
  onApprove: () => void;
  onRedirect: () => void;
  onStop: () => void;
}

export const ApprovalGate: React.FC<ApprovalGateProps> = ({
  status,
  onApprove,
  onRedirect,
  onStop
}) => {
  return (
    <div
      className="fin-approval-gate rounded-[8px] bg-[#101A23] border border-[#26333D] p-2.5 flex items-center justify-between"
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
    >
      {/* Left: Shield Icon, Title & Subtitle */}
      <div className="flex items-center gap-3" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          className="w-7 h-7 rounded-[6px] bg-[#1B1811] border border-[#D6B75E] flex items-center justify-center shrink-0"
          style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "#1B1811", border: "1px solid #D6B75E", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Shield className="w-3.5 h-3.5 text-[#D6B75E]" style={{ width: 14, height: 14, color: "#D6B75E" }} />
        </div>
        <div>
          <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="text-[11.5px] font-bold text-[#E7E9EC] tracking-tight">
              Approval Gate
            </span>
            {status !== "idle" && (
              <span
                className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  status === "approved"
                    ? "bg-[#183526] text-[#26C88A]"
                    : status === "redirected"
                    ? "bg-[#2A2312] text-[#D6B75E]"
                    : "bg-[#331518] text-[#E36B73]"
                }`}
              >
                {status}
              </span>
            )}
          </div>
          <p className="text-[9.5px] text-[#929CA7]">
            Review the analysis and choose the next action.
          </p>
        </div>
      </div>

      {/* Right: Three Action Buttons (Approve, Redirect, Stop) */}
      <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Approve Button */}
        <button
          onClick={onApprove}
          className="fin-gate-approve-btn h-[28px] px-3.5 rounded-[5px] bg-[#122B21] border border-[#26C88A] text-[#26C88A] hover:bg-[#183D2F] font-semibold text-[10.5px] flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Approve</span>
        </button>

        {/* Redirect Button */}
        <button
          onClick={onRedirect}
          className="fin-gate-redirect-btn h-[28px] px-3.5 rounded-[5px] bg-[#251F12] border border-[#D6B75E] text-[#D6B75E] hover:bg-[#362C16] font-semibold text-[10.5px] flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Redirect</span>
        </button>

        {/* Stop Button */}
        <button
          onClick={onStop}
          className="fin-gate-stop-btn h-[28px] px-3.5 rounded-[5px] bg-[#2B1417] border border-[#E36B73] text-[#E36B73] hover:bg-[#3D1A1F] font-semibold text-[10.5px] flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Square className="w-3 h-3 fill-[#E36B73]" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
};

export default ApprovalGate;

