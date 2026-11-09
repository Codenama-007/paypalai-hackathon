"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Search,
  Layers,
  FileText,
  Briefcase,
  Activity,
  Compass,
  Scale,
  Users,
  PieChart,
  ArrowRight,
  Database,
  Info,
  DollarSign,
  Maximize2
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface StockQuote {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  prev_close: number;
  change: number;
  change_pct: number;
  day_high: number;
  day_low: number;
  high_52w: number;
  low_52w: number;
  volume: number;
  mcap_cr: number;
  pe: number;
  sector_pe: number;
  pb: number;
  div_yield: number;
  roe: number;
  roce: number;
  debt_equity: number;
  rsi: number;
  dma_50: number;
  dma_200: number;
  trend: string;
  beta: number;
  sharpe: number;
  volatility_1y: number;
  max_drawdown: number;
  source: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("analyst");
  const [selectedTicker, setSelectedTicker] = useState<string>("RELIANCE");
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [riskProfile, setRiskProfile] = useState<string>("balanced");
  const [backendHealth, setBackendHealth] = useState<{ ok: boolean; has_key: boolean } | null>(null);

  // Quick ticker catalog
  const popularTickers = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "TATAMOTORS", "ITC", "BHARTIARTL", "SBIN", "LT"];

  // Fetch quote & health
  const fetchQuote = async (ticker: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/quote/${ticker}`);
      if (res.ok) {
        const data = await res.json();
        setQuote(data);
      }
    } catch (err) {
      console.error("Quote fetch error", err);
    }
  };

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
      }
    } catch (err) {
      setBackendHealth(null);
    }
  };

  useEffect(() => {
    fetchQuote(selectedTicker);
  }, [selectedTicker]);

  useEffect(() => {
    checkHealth();
    const timer = setInterval(checkHealth, 10000);
    return () => clearInterval(timer);
  }, []);

  // ===================== 1. ANALYST TASK AGENT STATE =====================
  const [taskName, setTaskName] = useState<string>("Institutional Valuation & Technical Review");
  const [taskEvents, setTaskEvents] = useState<any[]>([]);
  const [taskThread, setTaskThread] = useState<string>("");
  const [taskPendingGate, setTaskPendingGate] = useState<any | null>(null);
  const [taskRunning, setTaskRunning] = useState<boolean>(false);
  const [redirectInput, setRedirectInput] = useState<string>("");

  const startTaskAgent = async () => {
    setTaskEvents([]);
    setTaskPendingGate(null);
    setTaskRunning(true);
    const tid = crypto.randomUUID();
    setTaskThread(tid);

    try {
      const res = await fetch(`${API_BASE}/api/task/start?ticker=${selectedTicker}&task=${encodeURIComponent(taskName)}&thread=${tid}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              if (evt.type === "propose") {
                setTaskPendingGate(evt);
                setTaskRunning(false);
              }
              setTaskEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      console.error(e);
      setTaskRunning(false);
    }
  };

  const resumeTaskAgent = async (decision: string) => {
    setTaskPendingGate(null);
    setTaskRunning(true);

    try {
      const res = await fetch(`${API_BASE}/api/task/step?decision=${encodeURIComponent(decision)}&thread=${taskThread}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              if (evt.type === "propose") {
                setTaskPendingGate(evt);
                setTaskRunning(false);
              } else if (evt.type === "done") {
                setTaskRunning(false);
              }
              setTaskEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      console.error(e);
      setTaskRunning(false);
    }
  };

  // ===================== 2. REACT CHAT DESK STATE =====================
  const [chatInput, setChatInput] = useState<string>("What is the risk-reward ratio and PE valuation vs peers?");
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      role: "assistant",
      text: "Welcome to FinIntel ReAct Desk. Select an NSE stock and ask any technical, fundamental, or risk query. All arithmetic is computed in Python and reviewed through compliance guardrails."
    }
  ]);
  const [chatStreaming, setChatStreaming] = useState<boolean>(false);
  const [chatStreamSteps, setChatStreamSteps] = useState<any[]>([]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatStreaming) return;
    const userQ = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userQ }]);
    setChatStreaming(true);
    setChatStreamSteps([]);

    const tid = crypto.randomUUID();
    try {
      const res = await fetch(
        `${API_BASE}/api/chat?ticker=${selectedTicker}&q=${encodeURIComponent(userQ)}&thread=${tid}&profile=${riskProfile}`
      );
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              if (evt.type === "answer") {
                setChatMessages((prev) => [...prev, { role: "assistant", text: evt.text, source: evt.source }]);
              } else if (evt.type === "done") {
                setChatStreaming(false);
              } else {
                setChatStreamSteps((prev) => [...prev, evt]);
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      setChatStreaming(false);
    }
  };

  // ===================== 3. WAR ROOM STATE =====================
  const [warEvents, setWarEvents] = useState<any[]>([]);
  const [warThread, setWarThread] = useState<string>("");
  const [warPendingGate, setWarPendingGate] = useState<any | null>(null);
  const [warRunning, setWarRunning] = useState<boolean>(false);

  const startWarRoom = async () => {
    setWarEvents([]);
    setWarPendingGate(null);
    setWarRunning(true);
    const tid = crypto.randomUUID();
    setWarThread(tid);

    try {
      const res = await fetch(`${API_BASE}/api/war/start?ticker=${selectedTicker}&thread=${tid}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              if (evt.type === "approval_request") {
                setWarPendingGate(evt);
                setWarRunning(false);
              }
              setWarEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      setWarRunning(false);
    }
  };

  const resumeWarRoom = async (decision: string) => {
    setWarPendingGate(null);
    setWarRunning(true);

    try {
      const res = await fetch(`${API_BASE}/api/war/resume?decision=${encodeURIComponent(decision)}&thread=${warThread}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              setWarEvents((prev) => [...prev, evt]);
              if (evt.type === "done") setWarRunning(false);
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      setWarRunning(false);
    }
  };

  // ===================== 4. PORTFOLIO STATE =====================
  const [portfolioData, setPortfolioData] = useState<any | null>(null);
  const [portfolioEvents, setPortfolioEvents] = useState<any[]>([]);
  const [portfolioGate, setPortfolioGate] = useState<any | null>(null);
  const [portfolioThread, setPortfolioThread] = useState<string>("");

  const loadPortfolio = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const d = await res.json();
        setPortfolioData(d);
      }
    } catch (e) {}
  };

  const auditPortfolio = async () => {
    setPortfolioEvents([]);
    setPortfolioGate(null);
    const tid = crypto.randomUUID();
    setPortfolioThread(tid);

    try {
      const res = await fetch(`${API_BASE}/api/portfolio/analyze?profile=${riskProfile}&thread=${tid}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              if (evt.type === "approval_request") {
                setPortfolioGate(evt);
              }
              setPortfolioEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
  };

  const resumePortfolio = async (decision: string) => {
    setPortfolioGate(null);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/resume?decision=${decision}&thread=${portfolioThread}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              setPortfolioEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (activeTab === "portfolio") loadPortfolio();
  }, [activeTab]);

  // ===================== 5. STRESS TEST STATE =====================
  const [stressScenario, setStressScenario] = useState<string>("Crude Surge + Global Inflation Shock");
  const [marketShock, setMarketShock] = useState<number>(-10);
  const [crudeShock, setCrudeShock] = useState<number>(15);
  const [inrShock, setInrShock] = useState<number>(-3);
  const [rateShock, setRateShock] = useState<number>(50);
  const [stressEvents, setStressEvents] = useState<any[]>([]);

  const runStressTest = async () => {
    setStressEvents([]);
    try {
      const res = await fetch(
        `${API_BASE}/api/portfolio/stress?scenario=${encodeURIComponent(stressScenario)}&market=${marketShock}&crude=${crudeShock}&inr=${inrShock}&rates=${rateShock}`
      );
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              setStressEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
  };

  // ===================== 6. DISCOVER STATE =====================
  const [discoverQuery, setDiscoverQuery] = useState<string>("High ROE (>25%) and Low Debt (<0.5)");
  const [discoverEvents, setDiscoverEvents] = useState<any[]>([]);

  const runDiscover = async (qStr?: string) => {
    const qToRun = qStr || discoverQuery;
    setDiscoverEvents([]);
    try {
      const res = await fetch(`${API_BASE}/api/discover?q=${encodeURIComponent(qToRun)}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              setDiscoverEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
  };

  // ===================== 7. BRIEF STATE =====================
  const [briefEvents, setBriefEvents] = useState<any[]>([]);
  const loadBrief = async () => {
    setBriefEvents([]);
    try {
      const res = await fetch(`${API_BASE}/api/brief`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              setBriefEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
  };

  // ===================== 8. ECOSYSTEM STATE =====================
  const [ecosystemEvents, setEcosystemEvents] = useState<any[]>([]);
  const loadEcosystem = async () => {
    setEcosystemEvents([]);
    try {
      const res = await fetch(`${API_BASE}/api/ecosystem?ticker=${selectedTicker}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              setEcosystemEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
  };

  // ===================== 9. REPORT STATE =====================
  const [reportEvents, setReportEvents] = useState<any[]>([]);
  const loadReport = async () => {
    setReportEvents([]);
    try {
      const res = await fetch(`${API_BASE}/api/report?ticker=${selectedTicker}`);
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const evt = JSON.parse(line.replace("data: ", ""));
              setReportEvents((prev) => [...prev, evt]);
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
  };

  // ===================== 10. BACKTEST STATE =====================
  const [backtestMode, setBacktestMode] = useState<string>("sip");
  const [backtestAmount, setBacktestAmount] = useState<number>(10000);
  const [backtestYears, setBacktestYears] = useState<number>(5);
  const [backtestData, setBacktestData] = useState<any | null>(null);

  const runBacktest = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/backtest?tickers=${selectedTicker}&mode=${backtestMode}&amount=${backtestAmount}&years=${backtestYears}`
      );
      if (res.ok) {
        const d = await res.json();
        setBacktestData(d);
      }
    } catch (e) {}
  };

  // ===================== 11. TRACK RECORD STATE =====================
  const [trackRecordData, setTrackRecordData] = useState<any | null>(null);
  const [ledgerData, setLedgerData] = useState<any | null>(null);

  const loadTrackRecord = async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${API_BASE}/api/track-record`),
        fetch(`${API_BASE}/api/ledger`)
      ]);
      if (r1.ok) setTrackRecordData(await r1.json());
      if (r2.ok) setLedgerData(await r2.json());
    } catch (e) {}
  };

  useEffect(() => {
    if (activeTab === "brief") loadBrief();
    if (activeTab === "ecosystem") loadEcosystem();
    if (activeTab === "report") loadReport();
    if (activeTab === "backtest") runBacktest();
    if (activeTab === "track_record") loadTrackRecord();
    if (activeTab === "discover") runDiscover();
  }, [activeTab, selectedTicker]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVBAR */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-50 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md shadow-blue-500/20">
              FI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">FinIntel</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Agentic Equity Desk
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Institutional NSE Equity Research & Compliance Pipeline</p>
            </div>
          </div>

          {/* Center: Ticker selection buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-xl">
            {popularTickers.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTicker(t)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                  selectedTicker === t
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Right: Risk profile & Backend health */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2.5 py-1 rounded text-xs border border-zinc-700/60">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400 text-[11px]">Risk:</span>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="bg-transparent font-medium text-blue-400 focus:outline-none capitalize cursor-pointer text-xs"
              >
                <option value="conservative" className="bg-zinc-900 text-zinc-200">Conservative</option>
                <option value="balanced" className="bg-zinc-900 text-zinc-200">Balanced</option>
                <option value="aggressive" className="bg-zinc-900 text-zinc-200">Aggressive</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/50 text-[11px] border border-zinc-700/50">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealth?.ok ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span className="text-zinc-300 font-mono text-[11px]">
                {backendHealth?.ok ? "Port 8000 LIVE" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. LIVE TICKER SUMMARY RIBBON */}
      {quote && (
        <div className="bg-zinc-900/60 border-b border-zinc-800 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-white">{quote.name}</span>
              <span className="text-zinc-400 text-xs">({quote.ticker}.NS)</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">
                {quote.sector}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  quote.source === "live"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {quote.source === "live" ? "● Live yfinance" : "⚡ Offline Seed"}
              </span>
            </div>

            <div className="flex items-center gap-5 text-zinc-300 font-mono">
              <div className="flex items-baseline gap-1.5">
                <span className="text-zinc-400 text-[11px]">CMP:</span>
                <span className="text-base font-bold text-white">₹{quote.price.toFixed(2)}</span>
                <span
                  className={`text-xs font-semibold flex items-center ${
                    quote.change >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {quote.change >= 0 ? "+" : ""}
                  {quote.change.toFixed(2)} ({quote.change_pct.toFixed(2)}%)
                </span>
              </div>
              <div>
                <span className="text-zinc-400 text-[11px]">P/E:</span>{" "}
                <span className="font-semibold text-zinc-200">{quote.pe}x</span>{" "}
                <span className="text-zinc-500 text-[10px]">(Sec: {quote.sector_pe}x)</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[11px]">ROE:</span>{" "}
                <span className="font-semibold text-zinc-200">{quote.roe}%</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[11px]">RSI(14):</span>{" "}
                <span className="font-semibold text-zinc-200">{quote.rsi}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[11px]">Beta:</span>{" "}
                <span className="font-semibold text-zinc-200">{quote.beta}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-NAV TABS */}
      <nav className="bg-zinc-900 border-b border-zinc-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto text-xs py-1">
          {[
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
            { id: "track_record", label: "Track Record & Ledger", icon: PieChart }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 font-medium rounded-t border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === item.id
                    ? "border-blue-500 text-blue-400 bg-zinc-800/50"
                    : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. MAIN VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* ===================== TAB 1: ANALYST TASK AGENT ===================== */}
        {activeTab === "analyst" && (
          <div className="space-y-6">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-blue-400" />
                    Step-by-Step Analyst Task Desk (Human-in-the-Loop)
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    LangGraph-style execution: The agent proposes one analytics step, halts at an approval gate, and waits for your confirmation before continuing.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Task objective..."
                    className="bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-zinc-200 w-72 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <button
                    onClick={startTaskAgent}
                    disabled={taskRunning}
                    className="flex items-center gap-2 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {taskRunning ? "Running..." : "Initialize Plan"}
                  </button>
                </div>
              </div>
            </div>

            {/* Human Gate Box */}
            {taskPendingGate && (
              <div className="bg-amber-950/30 border-2 border-amber-500/60 rounded-lg p-5 shadow-lg animate-in fade-in duration-300">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Human Approval Required (Step {taskPendingGate.step} / {taskPendingGate.total_steps})
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">Thread ID: {taskThread.slice(0, 8)}...</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">{taskPendingGate.title}</h3>
                      <p className="text-xs text-zinc-300 mt-1">{taskPendingGate.description}</p>
                    </div>

                    <div className="bg-zinc-900/90 border border-amber-500/30 rounded p-3 text-xs font-mono text-amber-200">
                      <strong>Proposed Action:</strong> {taskPendingGate.proposed_action}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={() => resumeTaskAgent("approve")}
                        className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve & Proceed
                      </button>

                      <button
                        onClick={() => resumeTaskAgent("stop")}
                        className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow"
                      >
                        Stop Execution
                      </button>

                      <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                        <input
                          type="text"
                          value={redirectInput}
                          onChange={(e) => setRedirectInput(e.target.value)}
                          placeholder="Optional redirect instructions..."
                          className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded text-xs text-zinc-200 flex-1 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => resumeTaskAgent(`redirect:${redirectInput}`)}
                          className="px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-xs font-medium"
                        >
                          Redirect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task Timeline */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Desk Audit Log</h3>
              {taskEvents.length === 0 && !taskRunning && (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  Click <strong>Initialize Plan</strong> to trigger the autonomous multi-step analyst workflow.
                </div>
              )}

              <div className="space-y-3">
                {taskEvents.map((evt, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
                    {evt.type === "intro" && (
                      <div className="text-blue-400 font-medium">{evt.text}</div>
                    )}
                    {evt.type === "phase" && (
                      <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {evt.phase}
                        <span className="text-zinc-500 font-normal">({evt.detail})</span>
                      </div>
                    )}
                    {evt.type === "step_result" && (
                      <div className="space-y-1">
                        <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {evt.title}
                        </div>
                        <div className="whitespace-pre-line text-zinc-300 bg-zinc-950 p-3 rounded border border-zinc-800/80 font-mono text-[11px] leading-relaxed">
                          {evt.content}
                        </div>
                      </div>
                    )}
                    {evt.type === "final" && (
                      <div className="space-y-2 border-t border-zinc-800 pt-3">
                        <div className="font-bold text-white text-sm">Final Analyst Dossier</div>
                        <div className="whitespace-pre-line text-zinc-200 bg-zinc-950 p-4 rounded border border-blue-500/30 leading-relaxed font-sans text-xs">
                          {evt.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: CHAT DESK ===================== */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 cols: Chat Messages */}
            <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-lg flex flex-col h-[650px] shadow-sm">
              <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">ReAct Agent Chat: {selectedTicker}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">SEBI Compliance Active</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3.5 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white shadow"
                          : "bg-zinc-800/90 text-zinc-200 border border-zinc-700/60"
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">{msg.text}</div>
                      {msg.source && (
                        <div className="mt-2 text-[10px] text-zinc-400 font-mono border-t border-zinc-700/40 pt-1">
                          Source: {msg.source}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {chatStreaming && (
                  <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3 text-xs text-zinc-400 flex items-center gap-2 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    Agent orchestrating tools & evaluating compliance filters...
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder={`Ask questions about ${selectedTicker} (valuation, technicals, balance sheet, risk)...`}
                  className="bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-xs text-zinc-200 flex-1 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatStreaming}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right col: Live ReAct Tool Execution Inspector */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col h-[650px]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                ReAct Tool Execution Feed
              </h3>
              <p className="text-[11px] text-zinc-400 mb-3">
                Live stream of tools executed by the Python ReAct backend engine.
              </p>

              <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[11px]">
                {chatStreamSteps.length === 0 ? (
                  <div className="text-center py-20 text-zinc-500 text-xs font-sans">
                    Send a question to inspect live Python tool calls, metrics extraction, and self-review steps.
                  </div>
                ) : (
                  chatStreamSteps.map((s, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded p-2.5 space-y-1">
                      {s.type === "tool_call" && (
                        <div className="text-blue-400 flex items-center gap-1.5 font-semibold">
                          <Play className="w-3 h-3 text-blue-500" />
                          TOOL: {s.tool}
                        </div>
                      )}
                      {s.type === "tool_result" && (
                        <div className="text-emerald-400 pl-4 text-[10px]">
                          DATA: {JSON.stringify(s.data)}
                        </div>
                      )}
                      {s.type === "phase" && (
                        <div className="text-amber-400 font-semibold">{s.phase}: {s.detail}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: WAR ROOM DEBATE ===================== */}
        {activeTab === "war_room" && (
          <div className="space-y-6">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" />
                  War Room Multi-Agent Debate Desk
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Planner assigns 4 domain specialists (Quant, Fundamental, News, Risk) in parallel, triggers Bull vs Bear arguments, and Judge rules with human approval gate.
                </p>
              </div>
              <button
                onClick={startWarRoom}
                disabled={warRunning}
                className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow transition-colors flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                {warRunning ? "Debating..." : `Convene War Room on ${selectedTicker}`}
              </button>
            </div>

            {/* Approval Gate for War Room */}
            {warPendingGate && (
              <div className="bg-amber-950/40 border-2 border-amber-500/80 rounded-lg p-5 shadow-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      {warPendingGate.title}
                    </h3>
                    <p className="text-xs text-zinc-200">{warPendingGate.message}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => resumeWarRoom("approve")}
                        className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve Verdict & Deploy ₹1,00,000 Paper Tranche
                      </button>
                      <button
                        onClick={() => resumeWarRoom("reject")}
                        className="px-4 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Debate Logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warEvents.map((evt, idx) => {
                if (evt.type === "specialist") {
                  return (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-1.5">
                      <div className="text-blue-400 font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {evt.role}
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-sans">{evt.text}</p>
                    </div>
                  );
                }
                if (evt.type === "debate") {
                  const isBull = evt.stance === "BULL";
                  return (
                    <div
                      key={idx}
                      className={`md:col-span-1 rounded p-4 text-xs space-y-1.5 border ${
                        isBull
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                          : "bg-rose-950/20 border-rose-500/40 text-rose-200"
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {isBull ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
                        {evt.advocate} ({evt.stance})
                      </div>
                      <p className="leading-relaxed font-sans">{evt.argument}</p>
                    </div>
                  );
                }
                if (evt.type === "verdict") {
                  return (
                    <div key={idx} className="md:col-span-2 bg-zinc-900 border-2 border-blue-500/60 rounded p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                          Judge Ruling ({evt.ticker})
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Confidence: {evt.confidence}%
                        </span>
                      </div>
                      <div className="text-xl font-bold text-white flex items-center gap-3">
                        <span>Recommendation: {evt.recommendation}</span>
                        <span className="text-emerald-400 text-sm font-semibold">Target Upside: +{evt.target_upside_pct}%</span>
                        <span className="text-zinc-400 text-sm font-semibold">Stop Loss: ₹{evt.stop_loss}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{evt.text}</p>
                    </div>
                  );
                }
                if (evt.type === "final") {
                  return (
                    <div key={idx} className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded p-4 text-xs whitespace-pre-line text-zinc-300">
                      {evt.text}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: PORTFOLIO AUDIT ===================== */}
        {activeTab === "portfolio" && portfolioData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <span className="text-[11px] text-zinc-400">Total Portfolio Value</span>
                <div className="text-xl font-bold text-white mt-1">₹{portfolioData.total_value?.toLocaleString()}</div>
                <span className={`text-xs font-semibold ${portfolioData.total_pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {portfolioData.total_pnl >= 0 ? "+" : ""}₹{portfolioData.total_pnl?.toLocaleString()} ({portfolioData.total_pnl_pct}%)
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <span className="text-[11px] text-zinc-400">Portfolio Weighted Beta</span>
                <div className="text-xl font-bold text-zinc-200 mt-1">{portfolioData.portfolio_beta}</div>
                <span className="text-[11px] text-zinc-500">Systematic Market Risk</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <span className="text-[11px] text-zinc-400">Weighted P/E Multiple</span>
                <div className="text-xl font-bold text-zinc-200 mt-1">{portfolioData.portfolio_pe}x</div>
                <span className="text-[11px] text-zinc-500">Valuation Benchmark</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400">Risk Score</span>
                  <div className="text-xl font-bold text-amber-400 mt-1">{portfolioData.risk_score} / 10</div>
                </div>
                <button
                  onClick={auditPortfolio}
                  className="mt-2 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium"
                >
                  Run Risk Audit
                </button>
              </div>
            </div>

            {/* Rebalance gate */}
            {portfolioGate && (
              <div className="bg-amber-950/40 border border-amber-500/80 rounded-lg p-4 space-y-3">
                <div className="text-xs font-bold text-amber-300 uppercase">{portfolioGate.title}</div>
                <div className="text-xs text-zinc-200">{portfolioGate.proposed_action}</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => resumePortfolio("approve")}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
                  >
                    Approve Rebalance
                  </button>
                  <button
                    onClick={() => resumePortfolio("reject")}
                    className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Holdings Table */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-800/80 text-zinc-400 font-medium border-b border-zinc-700/60">
                  <tr>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Sector</th>
                    <th className="p-3">Shares</th>
                    <th className="p-3">Avg Buy</th>
                    <th className="p-3">CMP</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">P&L</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Beta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-200 font-mono">
                  {portfolioData.holdings?.map((h: any, i: number) => (
                    <tr key={i} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold font-sans">{h.ticker}</td>
                      <td className="p-3 font-sans text-zinc-400">{h.sector}</td>
                      <td className="p-3">{h.shares}</td>
                      <td className="p-3">₹{h.buy_price}</td>
                      <td className="p-3 font-bold text-white">₹{h.current_price}</td>
                      <td className="p-3">₹{h.value.toLocaleString()}</td>
                      <td className={`p-3 font-semibold ${h.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {h.pnl >= 0 ? "+" : ""}₹{h.pnl} ({h.pnl_pct}%)
                      </td>
                      <td className="p-3">{h.weight_pct}%</td>
                      <td className="p-3">{h.beta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: STRESS TESTING ===================== */}
        {activeTab === "stress" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Macroeconomic Factor Stress Shock Model
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] text-zinc-400">NIFTY Market Drop (%)</label>
                  <input
                    type="number"
                    value={marketShock}
                    onChange={(e) => setMarketShock(Number(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400">Brent Crude Shock (%)</label>
                  <input
                    type="number"
                    value={crudeShock}
                    onChange={(e) => setCrudeShock(Number(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400">USD/INR Depreciation (%)</label>
                  <input
                    type="number"
                    value={inrShock}
                    onChange={(e) => setInrShock(Number(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400">Interest Rate Spike (bps)</label>
                  <input
                    type="number"
                    value={rateShock}
                    onChange={(e) => setRateShock(Number(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
                  />
                </div>
              </div>
              <button
                onClick={runStressTest}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5" />
                Simulate Factor Shocks
              </button>
            </div>

            {/* Stress results */}
            <div className="space-y-4">
              {stressEvents.map((evt, idx) => {
                if (evt.type === "shock") {
                  return (
                    <div key={idx} className="bg-rose-950/20 border border-rose-500/40 rounded-lg p-5 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-rose-300 font-semibold uppercase">Scenario: {evt.scenario}</span>
                        <div className="text-2xl font-bold text-white mt-1 font-mono">
                          Stressed Value: ₹{evt.stressed_value?.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs text-zinc-400">Projected Portfolio Loss:</span>
                        <div className="text-xl font-bold text-rose-400">
                          -₹{Math.abs(evt.total_drawdown)?.toLocaleString()} ({evt.drawdown_pct}%)
                        </div>
                      </div>
                    </div>
                  );
                }
                if (evt.type === "narrative") {
                  return (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 text-xs whitespace-pre-line leading-relaxed text-zinc-200">
                      {evt.text}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 6: DISCOVER NLP SCREENER ===================== */}
        {activeTab === "discover" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-400" />
                Natural Language Stock Screener
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discoverQuery}
                  onChange={(e) => setDiscoverQuery(e.target.value)}
                  placeholder="e.g. High ROE with low debt, or Undervalued banking..."
                  className="bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-xs text-white flex-1 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={() => runDiscover()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
                >
                  Sweep Universe
                </button>
              </div>

              {/* Preset queries */}
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="text-zinc-500">Presets:</span>
                {[
                  "High ROE (>25%) and Low Debt (<0.5)",
                  "Undervalued P/E (<20) with Strong Profit Growth",
                  "High Dividend Yield (>2%) & Defensive",
                  "Large Cap Infra & Capital Expenditure Play"
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDiscoverQuery(p);
                      runDiscover(p);
                    }}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {discoverEvents
                .filter((e) => e.type === "stock")
                .map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTicker(s.ticker)}
                    className="bg-zinc-900 border border-zinc-800 hover:border-blue-500/60 rounded-lg p-4 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{s.ticker}</span>
                      <span className="text-xs font-bold text-zinc-200 font-mono">₹{s.price}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">{s.name}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                      <span>P/E: <strong className="text-zinc-200">{s.pe}x</strong></span>
                      <span>ROE: <strong className="text-emerald-400">{s.roe}%</strong></span>
                      <span>RSI: <strong className="text-zinc-200">{s.rsi}</strong></span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 7: MORNING BRIEF ===================== */}
        {activeTab === "brief" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Morning Pre-Market Desk Brief
              </h2>
              <button
                onClick={loadBrief}
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Cues
              </button>
            </div>

            <div className="space-y-4">
              {briefEvents.map((evt, idx) => {
                if (evt.type === "markets") {
                  return (
                    <div key={idx} className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {evt.indices?.map((m: any, i: number) => (
                          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded p-3 text-xs">
                            <span className="text-zinc-400 text-[11px]">{m.name}</span>
                            <div className="font-bold text-white font-mono mt-1">{m.value}</div>
                            <span className={`text-[11px] font-semibold ${m.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              {m.change >= 0 ? "+" : ""}{m.change_pct}%
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {evt.commodities?.map((c: any, i: number) => (
                          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded p-3 text-xs flex justify-between items-center">
                            <div>
                              <span className="font-bold text-white">{c.name}</span>
                              <p className="text-[11px] text-zinc-400 mt-0.5">{c.impact}</p>
                            </div>
                            <div className="text-right font-mono">
                              <span className="font-bold text-zinc-200">{c.value} {c.unit}</span>
                              <div className={`text-[11px] ${c.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                {c.change >= 0 ? "+" : ""}{c.change_pct}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (evt.type === "brief") {
                  return (
                    <div key={idx} className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 text-xs whitespace-pre-line leading-relaxed text-zinc-200">
                      {evt.text}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 8: ECOSYSTEM & PEERS ===================== */}
        {activeTab === "ecosystem" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Ecosystem & Direct Competitor Pricing: {selectedTicker}
            </h2>

            {ecosystemEvents.map((evt, idx) => {
              if (evt.type === "map") {
                return (
                  <div key={idx} className="space-y-6">
                    {/* Peers Comparison */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Direct Competitor Multiples</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {evt.competitors?.map((p: any, i: number) => (
                          <div key={i} className="bg-zinc-950 border border-zinc-800/80 rounded p-3.5 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white">{p.name} ({p.ticker})</span>
                              <span className="font-mono text-zinc-200 font-bold">₹{p.price}</span>
                            </div>
                            <div className="flex justify-between text-xs text-zinc-400 font-mono">
                              <span>P/E: <strong className="text-zinc-200">{p.pe}x</strong></span>
                              <span>ROE: <strong className="text-emerald-400">{p.roe}%</strong></span>
                              <span>Beta: <strong className="text-zinc-200">{p.beta}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Network map */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
                        <span className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">Key Customers</span>
                        <ul className="list-disc list-inside space-y-1 text-zinc-300">
                          {evt.customers?.map((c: string, i: number) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
                        <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Key Suppliers</span>
                        <ul className="list-disc list-inside space-y-1 text-zinc-300">
                          {evt.suppliers?.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
                        <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Strategic Partners</span>
                        <ul className="list-disc list-inside space-y-1 text-zinc-300">
                          {evt.partners?.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              }
              if (evt.type === "summary") {
                return (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 text-xs whitespace-pre-line text-zinc-200 leading-relaxed">
                    {evt.text}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* ===================== TAB 9: RESEARCH REPORT ===================== */}
        {activeTab === "report" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Institutional Equity Research Note Generator: {selectedTicker}
              </h2>
              <button
                onClick={loadReport}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs text-white font-medium flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-Generate Note
              </button>
            </div>

            {reportEvents.map((evt, idx) => {
              if (evt.type === "result") {
                return (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-xs whitespace-pre-line leading-relaxed text-zinc-200 font-sans shadow-md">
                    {evt.text}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* ===================== TAB 10: BACKTEST ===================== */}
        {activeTab === "backtest" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Deterministic SIP / Lumpsum Backtest Engine
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] text-zinc-400">Mode</label>
                  <select
                    value={backtestMode}
                    onChange={(e) => setBacktestMode(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
                  >
                    <option value="sip">Monthly SIP</option>
                    <option value="lumpsum">One-time Lumpsum</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400">Amount (₹)</label>
                  <input
                    type="number"
                    value={backtestAmount}
                    onChange={(e) => setBacktestAmount(Number(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400">Horizon (Years)</label>
                  <input
                    type="number"
                    value={backtestYears}
                    onChange={(e) => setBacktestYears(Number(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-xs text-white mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={runBacktest}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                  >
                    Run Simulation
                  </button>
                </div>
              </div>
            </div>

            {backtestData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                  <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
                    <span className="text-[11px] text-zinc-400 font-sans">Total Invested</span>
                    <div className="text-xl font-bold text-white mt-1">₹{backtestData.total_invested?.toLocaleString()}</div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
                    <span className="text-[11px] text-zinc-400 font-sans">Final Portfolio Corpus</span>
                    <div className="text-xl font-bold text-emerald-400 mt-1">₹{backtestData.final_value?.toLocaleString()}</div>
                    <span className="text-xs text-emerald-400 font-semibold font-sans">+{backtestData.portfolio_cagr_pct}% CAGR</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
                    <span className="text-[11px] text-zinc-400 font-sans">NIFTY 50 Corpus</span>
                    <div className="text-xl font-bold text-zinc-300 mt-1">₹{backtestData.nifty_final_value?.toLocaleString()}</div>
                    <span className="text-xs text-zinc-400 font-sans">+{backtestData.nifty_cagr_pct}% CAGR</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
                    <span className="text-[11px] text-zinc-400 font-sans">Alpha vs NIFTY</span>
                    <div className="text-xl font-bold text-blue-400 mt-1">+{backtestData.alpha_generated_pct}%</div>
                    <span className="text-[11px] text-zinc-500 font-sans">Sharpe: {backtestData.sharpe_ratio}</span>
                  </div>
                </div>

                {/* Timeline Table */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-800 text-zinc-400 border-b border-zinc-700">
                      <tr>
                        <th className="p-3">Month</th>
                        <th className="p-3">Invested</th>
                        <th className="p-3">Portfolio Value</th>
                        <th className="p-3">Nifty Benchmark</th>
                        <th className="p-3">Alpha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {backtestData.timeline?.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-zinc-800/50">
                          <td className="p-3">Month {row.month}</td>
                          <td className="p-3">₹{row.invested.toLocaleString()}</td>
                          <td className="p-3 font-bold text-emerald-400">₹{row.portfolio_value.toLocaleString()}</td>
                          <td className="p-3 text-zinc-400">₹{row.nifty_value.toLocaleString()}</td>
                          <td className="p-3 text-blue-400">+₹{row.alpha.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 11: TRACK RECORD & LEDGER ===================== */}
        {activeTab === "track_record" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-400" />
              Institutional Verdict Track Record & Virtual Ledger
            </h2>

            {ledgerData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
                  <span className="text-[11px] text-zinc-400 font-sans">Paper Ledger Capital</span>
                  <div className="text-xl font-bold text-white mt-1">₹{ledgerData.total_invested?.toLocaleString()}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
                  <span className="text-[11px] text-zinc-400 font-sans">Current Ledger Value</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">₹{ledgerData.portfolio_value?.toLocaleString()}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
                  <span className="text-[11px] text-zinc-400 font-sans">Total P&L</span>
                  <div className={`text-xl font-bold mt-1 ${ledgerData.total_pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {ledgerData.total_pnl >= 0 ? "+" : ""}₹{ledgerData.total_pnl?.toLocaleString()} ({ledgerData.pnl_pct}%)
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
                  <span className="text-[11px] text-zinc-400 font-sans">Alpha vs NIFTY</span>
                  <div className="text-xl font-bold text-blue-400 mt-1">+{ledgerData.alpha_vs_nifty_pct}%</div>
                  <span className="text-xs text-zinc-500 font-sans">Win Rate: {trackRecordData?.win_rate_pct}%</span>
                </div>
              </div>
            )}

            {/* Verdicts List */}
            {trackRecordData && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-800 text-zinc-400 font-medium border-b border-zinc-700">
                    <tr>
                      <th className="p-3">Ticker</th>
                      <th className="p-3">Call</th>
                      <th className="p-3">Entry CMP</th>
                      <th className="p-3">Current CMP</th>
                      <th className="p-3">Return</th>
                      <th className="p-3">Confidence</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-200">
                    {trackRecordData.active_verdicts?.map((v: any, i: number) => (
                      <tr key={i} className="hover:bg-zinc-800/40">
                        <td className="p-3 font-bold">{v.ticker}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.verdict === "BUY"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : v.verdict === "SELL"
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-zinc-700 text-zinc-300"
                            }`}
                          >
                            {v.verdict}
                          </span>
                        </td>
                        <td className="p-3 font-mono">₹{v.entry_price}</td>
                        <td className="p-3 font-mono font-bold text-white">₹{v.current_price}</td>
                        <td className={`p-3 font-mono font-semibold ${v.return_pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {v.return_pct >= 0 ? "+" : ""}{v.return_pct}%
                        </td>
                        <td className="p-3 font-mono">{v.confidence}%</td>
                        <td className="p-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              v.outcome === "WIN"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : v.outcome === "LOSS"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-zinc-700 text-zinc-400"
                            }`}
                          >
                            {v.outcome}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-400 truncate max-w-xs">{v.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 px-6 text-center text-[11px] text-zinc-500 space-y-1">
        <p>
          FinIntel Agentic Research Desk — Designed for Indian Equity Research with Human-in-the-Loop Approval Gates.
        </p>
        <p className="text-[10px] text-zinc-600">
          Not investment advice. All equity transactions carry market risks. Mandatory SEBI Compliance & Output Scrubbing Pipeline active.
        </p>
      </footer>
    </div>
  );
}
