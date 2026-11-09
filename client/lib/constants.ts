import {
  Play,
  Activity,
  Scale,
  Briefcase,
  Sliders,
  Compass,
  Layers,
  Users,
  FileText,
  TrendingUp,
  PieChart,
} from "lucide-react";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export const POPULAR_TICKERS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "TATAMOTORS",
  "ITC",
  "BHARTIARTL",
  "SBIN",
  "LT",
];

export const TABS = [
  { id: "analyst", label: "Analyst Task Agent", icon: Play },
  { id: "chat", label: "ReAct Chat (31 Tools)", icon: Activity },
  { id: "war_room", label: "War Room Debate", icon: Scale },
  { id: "portfolio", label: "Portfolio Audit", icon: Briefcase },
  { id: "stress", label: "Stress Testing", icon: Sliders },
  { id: "discover", label: "NLP Screener", icon: Compass },
  { id: "brief", label: "Morning Brief", icon: Layers },
  { id: "ecosystem", label: "Ecosystem & Peers", icon: Users },
  { id: "report", label: "Research Report", icon: FileText },
  { id: "backtest", label: "SIP Backtest", icon: TrendingUp },
  { id: "track_record", label: "Track Record & Ledger", icon: PieChart },
] as const;

export type TabId = (typeof TABS)[number]["id"];
