export type RiskProfile = "Conservative" | "Balanced" | "Aggressive";

export type ApprovalStatus = "idle" | "approved" | "redirected" | "stopped";

export type Timeframe = "1D" | "5D" | "1M" | "6M" | "1Y" | "5Y" | "Max";

export type SegmentMode = "single" | "sector" | "compare" | "screener";

export type ResearchTab =
  | "overview"
  | "financials"
  | "valuation"
  | "ownership"
  | "news"
  | "sentiment"
  | "thesis";

export type MetricsTab = "metrics" | "about";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  active?: boolean;
  badge?: string;
}

export interface MetricItem {
  label: string;
  val: string;
}

export interface StreamItem {
  time: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconBg: string;
  iconColor: string;
  title: string;
  badge: string;
  badgeColor: string;
  badgeText: string;
  desc: string;
}

export interface ToolItem {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  query: string;
}

