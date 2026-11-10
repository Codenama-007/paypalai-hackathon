"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  ChevronDown,
  Search,
  Bell,
  Sun,
  BarChart2,
  Check,
  LogOut,
  Shield,
  Key
} from "lucide-react";
import { RiskProfile } from "@/types/dashboard";
import { NiftyModal } from "./NiftyModal";
import { StockSearchModal } from "./StockSearchModal";
import { NotificationsPopover } from "./NotificationsPopover";
import { getStoredUser, clearUserSession, DEFAULT_DEMO_USER, UserSession } from "@/lib/auth";

export interface HeaderProps {
  riskProfile: RiskProfile;
  onRiskProfileChange: (profile: RiskProfile) => void;
  onSelectStock?: (ticker: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  riskProfile,
  onRiskProfileChange,
  onSelectStock
}) => {
  const router = useRouter();

  // Dropdown & Modal States
  const [riskDropdown, setRiskDropdown] = useState(false);
  const [niftyModalOpen, setNiftyModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeToast, setThemeToast] = useState(false);

  // User session initialized lazily without triggering cascading effect
  const [currentUser] = useState<UserSession>(() => getStoredUser() || DEFAULT_DEMO_USER);

  const handleLogout = () => {
    clearUserSession();
    setUserMenuOpen(false);
    router.push("/login");
  };

  const handleThemeToggle = () => {
    setThemeToast(true);
    setTimeout(() => setThemeToast(false), 2500);
  };

  return (
    <>
      <header className="fin-top-nav h-[50px] bg-[#070C11] border-b border-[#26333D] flex items-center justify-between px-4 z-40 shrink-0">
        {/* Left: FinAnalyst AI Logo & Tagline */}
        <div className="fin-top-nav-left flex items-center gap-5">
          <Link
            href="/"
            className="fin-logo-group"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, background: "transparent", outline: "none" }}
          >
            {/* Stylized Gold A Icon */}
            <div
              className="w-5 h-5 flex items-center justify-center shrink-0"
              style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ width: 20, height: 20 }} fill="none">
                <path d="M4 19L11 4L13.5 9.5L8.5 19H4Z" fill="#D6B75E" />
                <path d="M14.5 11.5L18 19H13L11.5 15.5L14.5 11.5Z" fill="#F3DE97" />
                <path d="M13 15H17" stroke="#080D12" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="flex flex-col" style={{ display: "flex", flexDirection: "column" }}>
              <span
                className="font-bold text-[13.5px] tracking-tight text-[#E7E9EC] leading-tight"
                style={{ fontSize: "13.5px", fontWeight: 700, color: "#E7E9EC", lineHeight: 1.15 }}
              >
                FinAnalyst AI
              </span>
              <span
                className="text-[9px] text-[#A98B45] font-medium tracking-wider"
                style={{ fontSize: "9px", color: "#A98B45", fontWeight: 500, letterSpacing: "0.04em" }}
              >
                Research · Analyse · Invest
              </span>
            </div>
          </Link>

          {/* NSE: NIFTY 50 Ticker Pill — Clickable */}
          <button
            onClick={() => setNiftyModalOpen(true)}
            className="fin-ticker-pill h-[28px] px-2.5 rounded-[6px] bg-[#101A23] border border-[#26333D] hover:border-[#D6B75E]/50 flex items-center gap-2 text-[11px] font-mono cursor-pointer transition-colors"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 28,
              padding: "0 10px",
              borderRadius: 6,
              backgroundColor: "#101A23",
              border: "1px solid #26333D"
            }}
            title="Click to view NIFTY 50 details and top movers"
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#D6B75E]" style={{ width: 14, height: 14, color: "#D6B75E" }} />
            <span className="text-[#E7E9EC] font-semibold text-[10.5px]">NSE: NIFTY 50</span>
            <span className="text-[#E7E9EC] font-bold text-[10.5px]">24,142.30</span>
            <span className="text-[#35C98A] font-semibold flex items-center text-[10px]" style={{ color: "#35C98A", display: "flex", alignItems: "center" }}>
              ▲ +0.40% (+96.80)
            </span>
          </button>

          {/* Risk Profile Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setRiskDropdown(!riskDropdown)}
              className="fin-risk-pill h-[28px] px-2.5 rounded-[6px] bg-[#101A23] border border-[#26333D] flex items-center gap-1.5 text-[10.5px] hover:border-[#D6B75E]/60 transition-colors cursor-pointer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 28,
                padding: "0 10px",
                borderRadius: 6,
                backgroundColor: "#101A23",
                border: "1px solid #26333D"
              }}
            >
              <Scale className="w-3.5 h-3.5 text-[#D6B75E]" style={{ width: 14, height: 14, color: "#D6B75E" }} />
              <span className="text-[#929CA7]">Risk Profile:</span>
              <span className="font-semibold text-[#D6B75E]">{riskProfile}</span>
              <ChevronDown className="w-3 h-3 text-[#D6B75E] ml-0.5" style={{ width: 12, height: 12, color: "#D6B75E" }} />
            </button>

            {riskDropdown && (
              <div className="absolute left-0 mt-1 w-36 rounded-md bg-[#101A23] border border-[#26333D] py-1 shadow-xl z-50 text-[11px] animate-in fade-in duration-150">
                {(["Conservative", "Balanced", "Aggressive"] as RiskProfile[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRiskProfileChange(r);
                      setRiskDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#131F29] text-[#E7E9EC] flex items-center justify-between cursor-pointer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <span>{r}</span>
                    {riskProfile === r && <Check className="w-3 h-3 text-[#D6B75E]" style={{ width: 12, height: 12 }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Search, Notification, Theme, User Profile */}
        <div className="fin-top-nav-right flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Search Icon Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="fin-icon-btn w-[28px] h-[28px] rounded-[6px] bg-[#101A23] border border-[#26333D] flex items-center justify-center text-[#929CA7] hover:text-[#E7E9EC] hover:border-[#D6B75E]/50 transition-colors cursor-pointer"
            style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Search Indian Equities"
          >
            <Search className="w-3.5 h-3.5" style={{ width: 14, height: 14 }} />
          </button>

          {/* Notification Bell Button with Interactive Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setHasUnread(false);
              }}
              className="fin-icon-btn w-[28px] h-[28px] rounded-[6px] bg-[#101A23] border border-[#26333D] flex items-center justify-center text-[#929CA7] hover:text-[#E7E9EC] hover:border-[#D6B75E]/50 relative transition-colors cursor-pointer"
              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" style={{ width: 14, height: 14 }} />
              {hasUnread && (
                <span
                  className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#D6B75E]"
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#D6B75E"
                  }}
                />
              )}
            </button>

            <NotificationsPopover
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>

          {/* Theme / Sun Button */}
          <button
            onClick={handleThemeToggle}
            className="fin-icon-btn w-[28px] h-[28px] rounded-[6px] bg-[#101A23] border border-[#26333D] flex items-center justify-center text-[#929CA7] hover:text-[#E7E9EC] hover:border-[#D6B75E]/50 transition-colors cursor-pointer"
            style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Terminal Display Mode"
          >
            <Sun className="w-3.5 h-3.5" style={{ width: 14, height: 14 }} />
          </button>

          {/* User Profile Pill with Interactive Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="fin-user-pill h-[28px] pl-1 pr-2 rounded-[6px] bg-[#101A23] border border-[#26333D] flex items-center gap-1.5 cursor-pointer hover:border-[#D6B75E]/50 transition-colors"
              style={{
                height: 28,
                padding: "0 8px 0 4px",
                borderRadius: 6,
                backgroundColor: "#101A23",
                border: "1px solid #26333D",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
              title="Analyst Profile"
            >
              <div
                className="fin-avatar-circle w-[20px] h-[20px] rounded-full bg-[#1F2C37] border border-[#26333D] flex items-center justify-center font-bold text-[9.5px] text-[#E7E9EC]"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#1F2C37",
                  border: "1px solid #26333D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "9.5px"
                }}
              >
                {currentUser.avatarInitials || "RD"}
              </div>
              <ChevronDown className="w-3 h-3 text-[#929CA7]" style={{ width: 12, height: 12, color: "#929CA7" }} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 rounded-[8px] bg-[#101A23] border border-[#26333D] shadow-2xl z-50 p-2 space-y-2 animate-in fade-in duration-150 text-[11px]">
                {/* User Info Header */}
                <div className="p-2 rounded bg-[#0B1219] border border-[#26333D]/60 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#E7E9EC] text-[11.5px]">{currentUser.name}</span>
                    <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded bg-[#1E1A11] text-[#D6B75E] border border-[#D6B75E]/40">
                      {currentUser.isDemo ? "Demo Mode" : "Institutional"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#929CA7] block truncate">{currentUser.email}</span>
                  <span className="text-[9px] text-[#5F6D7E] block">{currentUser.role}</span>
                </div>

                {/* Profile Links */}
                <div className="space-y-0.5 text-[#929CA7]">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setRiskDropdown(true);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-[#131F29] hover:text-[#E7E9EC] flex items-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#D6B75E]" />
                    <span>Risk Profile Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setThemeToast(true);
                      setTimeout(() => setThemeToast(false), 2000);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-[#131F29] hover:text-[#E7E9EC] flex items-center gap-2 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-[#45B6A3]" />
                    <span>Session Telemetry & Audit</span>
                  </button>
                </div>

                {/* Sign Out / Switch to Login */}
                <div className="pt-1 border-t border-[#26333D]/60">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-1.5 rounded bg-[#2B1417]/40 hover:bg-[#2B1417] text-[#E36B73] hover:text-white flex items-center gap-2 font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out to Login Page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* NIFTY 50 Modal */}
      <NiftyModal
        isOpen={niftyModalOpen}
        onClose={() => setNiftyModalOpen(false)}
        onSelectStock={(t) => {
          if (onSelectStock) onSelectStock(t);
        }}
      />

      {/* Stock Search Modal */}
      <StockSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectStock={(t) => {
          if (onSelectStock) onSelectStock(t);
        }}
      />

      {/* Theme Feedback Toast */}
      {themeToast && (
        <div className="fixed bottom-4 right-4 z-50 p-3 rounded-[6px] bg-[#101A23] border border-[#D6B75E] text-[#E7E9EC] shadow-2xl flex items-center gap-2 text-[11px] animate-in fade-in duration-200">
          <Sun className="w-4 h-4 text-[#D6B75E]" />
          <span>Institutional Dark Terminal: Calibrated for trading-floor optical contrast and SEBI display compliance.</span>
        </div>
      )}
    </>
  );
};

export default Header;
