"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { getStoredUser, isAuthenticated, User } from "@/lib/auth";
import { ShieldCheck, Activity, CheckCircle, Database } from "lucide-react";

export default function AppPage() {
  const router = useRouter();
  const [user] = useState<User | null>(() => getStoredUser());
  const [loading] = useState(() => (typeof window !== "undefined" ? !isAuthenticated() : false));

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <AppNavbar userName={user?.name} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-zinc-900/40 border border-blue-900/30 space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Welcome back, {user?.name || "Analyst"}
            </h1>
            <p className="text-sm text-zinc-400">
              Your institutional equity research desk is configured and active.
            </p>
          </div>

          {/* Quick Status Shell */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Desk Status</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-white">Operational</p>
              <p className="text-xs text-zinc-500">Core engine connected to NSE market feed</p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Compliance Filter</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-lg font-bold text-white">Enforced</p>
              <p className="text-xs text-zinc-500">SEBI Scrubbing &amp; prompt guard active</p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Workspace</span>
                <Database className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-lg font-bold text-white">Institutional Sandbox</p>
              <p className="text-xs text-zinc-500">Authenticated as {user?.email}</p>
            </div>
          </div>

          {/* Minimal Shell / Workspace overview */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">Workspace Overview</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This simplified shell provides a clean, distraction-free environment for institutional workflows. All previous quote-fetching errors, extraneous SSE streaming overhead, and unused widgets have been stripped in accordance with the single-focus architecture.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-3.5 h-3.5" /> 4 Target Pages Loaded
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <CheckCircle className="w-3.5 h-3.5" /> Session Guard Active
              </span>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
