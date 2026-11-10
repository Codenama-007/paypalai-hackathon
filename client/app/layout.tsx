import type { Metadata } from "next";
import "./globals.css";
import "./finintel.css";

export const metadata: Metadata = {
  title: "FinIntel — Agentic Equity Research Desk (NSE)",
  description: "Institutional AI Equity Research Desk for Indian Stocks with Human Approval Gates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#080D12] text-[#E7E9EC]">{children}</body>
    </html>
  );
}
