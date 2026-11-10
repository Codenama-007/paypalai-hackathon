"use client";

import React, { useState } from "react";
import { Bell, Check, Sparkles, AlertCircle, TrendingUp, Info } from "lucide-react";
import { NOTIFICATIONS_DATA } from "@/lib/marketData";

export interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (text: string) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
  };

  return (
    <div
      className="fin-popover-menu absolute right-0 top-full mt-2 w-[340px] z-50 overflow-hidden"
      style={{
        position: "absolute",
        right: 0,
        top: "100%",
        marginTop: "8px",
        width: 340,
        backgroundColor: "#101A23",
        border: "1px solid #26333D",
        borderRadius: "8px",
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
        zIndex: 100,
        overflow: "hidden"
      }}
    >
      {/* Popover Header */}
      <div className="p-3 border-b border-[#26333D] flex items-center justify-between bg-[#0B1219]">
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-[#D6B75E]" />
          <span className="text-[11.5px] font-bold text-[#E7E9EC]">
            Terminal Notifications
          </span>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-[9.5px] text-[#D6B75E] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-3 h-3" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Notifications Items */}
      <div className="max-h-[260px] overflow-y-auto divide-y divide-[#26333D]/50">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (onSelectAction) onSelectAction(item.text);
              onClose();
            }}
            className={`p-3 hover:bg-[#131F29] cursor-pointer transition-colors space-y-1 ${
              item.isNew ? "bg-[#101A23]" : "bg-[#0B1219]/60 opacity-80"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {item.title.includes("News") ? (
                  <Sparkles className="w-3 h-3 text-[#26C88A]" />
                ) : item.title.includes("Approval") ? (
                  <AlertCircle className="w-3 h-3 text-[#D6B75E]" />
                ) : item.title.includes("High") ? (
                  <TrendingUp className="w-3 h-3 text-[#26C88A]" />
                ) : (
                  <Info className="w-3 h-3 text-[#45B6A3]" />
                )}
                <span className="text-[10.5px] font-bold text-[#E7E9EC]">
                  {item.title}
                </span>
                {item.isNew && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6B75E]" />
                )}
              </div>
              <span className="text-[9px] font-mono text-[#5F6D7E]">
                {item.time}
              </span>
            </div>
            <p className="text-[10px] text-[#929CA7] leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Popover Footer */}
      <div className="p-2 border-t border-[#26333D] bg-[#070C11] text-center">
        <span className="text-[9px] text-[#5F6D7E]">
          Real-time Event Stream Filter: High Priority
        </span>
      </div>
    </div>
  );
};

