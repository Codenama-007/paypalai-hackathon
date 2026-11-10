import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./finintel.css";

export const metadata: Metadata = {
  title: "FinIntel — Dynamic Stock Analysis & Institutional Desk",
  description: "AI Equity Research Desk with Dynamic Multi-Stock Analysis",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-[#21242c] text-[#E7E9EC] m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
