import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
