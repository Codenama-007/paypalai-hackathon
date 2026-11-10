"use client";

import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";

interface NavbarProps {
  userName?: string;
}

export default function AppNavbar({ userName }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-50 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/app" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-md shadow-blue-500/20">
              FI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">FinIntel</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Desk
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700/50">
            <UserIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>{userName || "Analyst"}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-red-400 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-zinc-800/60"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
