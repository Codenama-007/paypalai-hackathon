"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, HelpCircle, ShieldAlert } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/app", icon: LayoutDashboard },
    { label: "Compliance & Safety", href: "/app#compliance", icon: ShieldAlert },
    { label: "Settings", href: "/app#settings", icon: Settings },
    { label: "Help & Docs", href: "/app#help", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-zinc-500 mb-2">
            Main Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-[11px] text-zinc-500 space-y-1">
        <p className="font-semibold text-zinc-400">Environment Active</p>
        <p>Institutional Sandbox (NSE)</p>
      </div>
    </aside>
  );
}
