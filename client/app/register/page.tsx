"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { registerUser } from "@/lib/api";
import { setAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(name, email, password);
      if (data && (data.access_token || data.token)) {
        const token = data.access_token || data.token;
        const user = data.user || {
          id: "u-1",
          email,
          name,
        };
        setAuth(token, user);
        router.push("/app");
      } else {
        // If registration does not auto-login, redirect to login
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-zinc-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/20">
              FI
            </div>
            <span className="font-bold text-xl tracking-tight text-white">FinIntel</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Create your account
          </h2>
          <p className="text-sm text-zinc-400">
            Get instant access to FinIntel research agents
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Institutional Analyst"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@firm.com"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Get Started <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
