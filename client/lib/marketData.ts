// FinIntel Comprehensive Institutional Market Data Store

export interface StockData {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  price: string;
  priceChange: string;
  isPositive: boolean;
  marketCap: string;
  peTTM: string;
  epsTTM: string;
  yield: string;
  high52W: string;
  low52W: string;
  about: string;
  sentiment: string;
  sentimentScore: number;
  bullPoints: string[];
  bearPoints: string[];
  ownership: { promoter: string; fii: string; dii: string; public: string };
  financials: { revenue: string; ebitda: string; netProfit: string; deRatio: string; roce: string };
  news: Array<{ time: string; title: string; category: string; impact: string }>;
}

export const STOCKS: Record<string, StockData> = {
  RELIANCE: {
    ticker: "RELIANCE",
    name: "RELIANCE INDUSTRIES LTD.",
    exchange: "RELIANCE · NSE",
    sector: "Energy & Conglomerate",
    price: "₹2,987.40",
    priceChange: "▲ +12.30 (+0.41%)",
    isPositive: true,
    marketCap: "₹20.24 L Cr",
    peTTM: "26.4",
    epsTTM: "₹113.2",
    yield: "0.34%",
    high52W: "₹3,024.90",
    low52W: "₹2,222.00",
    about:
      "Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai, with market leadership across energy, petrochemicals, telecommunications, retail, and media.",
    sentiment: "Positive (78% bullish)",
    sentimentScore: 78,
    bullPoints: [
      "New Energy Gigafactory commissioning ahead of schedule (10 GW solar by FY28)",
      "Jio 5G subscriber monetisation expanding ARPU towards ₹195",
      "Retail footfall and omni-channel grocery EBITDA margins resilient at 8.2%"
    ],
    bearPoints: [
      "Volatile Singapore GRM refining cracks impacting O2C cash flow",
      "Elevated capex cycle keeping net debt around ₹1.15 lakh crore"
    ],
    ownership: { promoter: "50.3%", fii: "21.8%", dii: "16.4%", public: "11.5%" },
    financials: { revenue: "₹8,92,450 Cr", ebitda: "₹1,78,200 Cr", netProfit: "₹69,624 Cr", deRatio: "0.38x", roce: "9.8%" },
    news: [
      { time: "10:02 AM", title: "Reliance to expand clean energy capacity by 10 GW by FY28", category: "News", impact: "High Bullish" },
      { time: "09:40 AM", title: "Jio adds 3.4M net broadband subscribers in Q2", category: "Telecom", impact: "Bullish" },
      { time: "Yesterday", title: "Reliance Retail acquires premium beauty chain retail footprint", category: "M&A", impact: "Neutral" }
    ]
  },
  TCS: {
    ticker: "TCS",
    name: "TATA CONSULTANCY SERVICES LTD.",
    exchange: "TCS · NSE",
    sector: "Information Technology",
    price: "₹4,120.50",
    priceChange: "▲ +28.70 (+0.70%)",
    isPositive: true,
    marketCap: "₹14.92 L Cr",
    peTTM: "31.2",
    epsTTM: "₹132.1",
    yield: "1.25%",
    high52W: "₹4,585.00",
    low52W: "₹3,311.00",
    about:
      "Tata Consultancy Services is India's largest IT services firm and consulting leader with multi-decade relationships across Banking, Financial Services, Retail, and Healthcare.",
    sentiment: "Moderately Bullish (65%)",
    sentimentScore: 65,
    bullPoints: [
      "Total Contract Value (TCV) bookings reached $10.0B in the latest quarter",
      "Operating margins lead industry peers at 24.5%",
      "Generative AI pipeline deals expanded 2x sequentially"
    ],
    bearPoints: [
      "Discretionary tech spending delays in European banking clients",
      "Subdued headcount net additions reflecting cautious enterprise budgets"
    ],
    ownership: { promoter: "71.8%", fii: "12.7%", dii: "10.2%", public: "5.3%" },
    financials: { revenue: "₹2,40,893 Cr", ebitda: "₹63,200 Cr", netProfit: "₹45,908 Cr", deRatio: "0.00x", roce: "52.4%" },
    news: [
      { time: "09:15 AM", title: "TCS bags $1.2B digital transformation deal with European insurance titan", category: "Deals", impact: "Bullish" },
      { time: "Yesterday", title: "Board announces interim dividend of ₹10 per share", category: "Corporate", impact: "Neutral" }
    ]
  },
  HDFCBANK: {
    ticker: "HDFCBANK",
    name: "HDFC BANK LIMITED",
    exchange: "HDFCBANK · NSE",
    sector: "Banking & Financials",
    price: "₹1,682.35",
    priceChange: "▲ +15.80 (+0.95%)",
    isPositive: true,
    marketCap: "₹12.78 L Cr",
    peTTM: "18.6",
    epsTTM: "₹90.4",
    yield: "1.16%",
    high52W: "₹1,794.00",
    low52W: "₹1,363.00",
    about:
      "HDFC Bank is India's largest private sector bank following its landmark merger with HDFC Limited, commanding leadership in retail loans, credit cards, and deposits.",
    sentiment: "Bullish (82%)",
    sentimentScore: 82,
    bullPoints: [
      "Credit-deposit ratio improving towards target 84% through steady branch mobilization",
      "Net NPA levels remain benchmark-low at 0.33%",
      "Post-merger cross-selling synergies accelerating mortgage growth"
    ],
    bearPoints: [
      "Near-term NIM compression during wholesale liquidity readjustment",
      "Branch expansion operating expenditure remaining high"
    ],
    ownership: { promoter: "0.0%", fii: "47.2%", dii: "34.1%", public: "18.7%" },
    financials: { revenue: "₹3,15,400 Cr", ebitda: "₹98,500 Cr", netProfit: "₹60,812 Cr", deRatio: "6.2x", roce: "16.8%" },
    news: [
      { time: "10:15 AM", title: "HDFC Bank deposit growth outpaces credit growth by 180 bps in Q2", category: "Banking", impact: "Bullish" }
    ]
  },
  INFY: {
    ticker: "INFY",
    name: "INFOSYS LIMITED",
    exchange: "INFY · NSE",
    sector: "Information Technology",
    price: "₹1,845.20",
    priceChange: "▼ -8.40 (-0.45%)",
    isPositive: false,
    marketCap: "₹7.66 L Cr",
    peTTM: "29.1",
    epsTTM: "₹63.4",
    yield: "2.10%",
    high52W: "₹1,991.00",
    low52W: "₹1,358.00",
    about:
      "Infosys is a global leader in next-generation digital services and consulting, enabling clients across 56 countries to navigate their digital transformation.",
    sentiment: "Neutral (54%)",
    sentimentScore: 54,
    bullPoints: [
      "Topaz Generative AI platform integrated across 100+ active enterprise clients",
      "Large deal wins totaled $3.2B with net new deal share over 50%"
    ],
    bearPoints: [
      "FY25 guidance conservatively moderated to 3.75% - 4.5% constant currency",
      "Manufacturing segment discretionary client cancellations"
    ],
    ownership: { promoter: "14.8%", fii: "32.4%", dii: "35.8%", public: "17.0%" },
    financials: { revenue: "₹1,53,670 Cr", ebitda: "₹38,200 Cr", netProfit: "₹26,233 Cr", deRatio: "0.05x", roce: "39.4%" },
    news: [
      { time: "08:50 AM", title: "Infosys expands AI partnership with global financial consortium", category: "AI", impact: "Neutral" }
    ]
  },
  TATAMOTORS: {
    ticker: "TATAMOTORS",
    name: "TATA MOTORS LIMITED",
    exchange: "TATAMOTORS · NSE",
    sector: "Automobile & EV",
    price: "₹972.60",
    priceChange: "▲ +21.40 (+2.25%)",
    isPositive: true,
    marketCap: "₹3.58 L Cr",
    peTTM: "14.8",
    epsTTM: "₹65.7",
    yield: "0.62%",
    high52W: "₹1,179.00",
    low52W: "₹640.00",
    about:
      "Tata Motors is a $42 billion automobile manufacturer with leading market share in Indian passenger EVs, commercial vehicles, and the global luxury marque Jaguar Land Rover.",
    sentiment: "Strongly Bullish (85%)",
    sentimentScore: 85,
    bullPoints: [
      "JLR EBIT margin guidance sustained above 8.5% on robust Defender & Range Rover orderbook",
      "Demerger into Commercial Vehicles and Passenger Vehicles unlocked targeted valuations",
      "Indian EV retail market share continues at dominant ~70%"
    ],
    bearPoints: [
      "European market EV adoption slowdown creating mild discounting pressure",
      "Domestic CV volume cyclical moderation in heavy trucks"
    ],
    ownership: { promoter: "46.4%", fii: "19.2%", dii: "16.8%", public: "17.6%" },
    financials: { revenue: "₹4,37,928 Cr", ebitda: "₹62,100 Cr", netProfit: "₹31,807 Cr", deRatio: "0.45x", roce: "18.9%" },
    news: [
      { time: "09:30 AM", title: "Tata Motors commences deliveries of Curvv EV; order backlog reaches 18,000 units", category: "EV", impact: "Bullish" }
    ]
  }
};

export const NIFTY_MARKET_SUMMARY = {
  index: "NIFTY 50",
  current: "24,142.30",
  change: "+96.80",
  percentChange: "+0.40%",
  open: "24,080.10",
  high: "24,185.60",
  low: "24,042.20",
  advances: 34,
  declines: 16,
  pe: "21.8",
  topMovers: [
    { ticker: "TATAMOTORS", price: "₹972.60", change: "+2.25%" },
    { ticker: "HDFCBANK", price: "₹1,682.35", change: "+0.95%" },
    { ticker: "TCS", price: "₹4,120.50", change: "+0.70%" },
    { ticker: "RELIANCE", price: "₹2,987.40", change: "+0.41%" },
    { ticker: "INFY", price: "₹1,845.20", change: "-0.45%" }
  ]
};

export const NOTIFICATIONS_DATA = [
  { id: "1", title: "News Ingested", time: "10:02 AM", text: "Reliance clean energy expansion 10 GW target approved by board", isNew: true },
  { id: "2", title: "Approval Gate", time: "09:45 AM", text: "Human-in-the-loop thesis awaiting analyst sign-off", isNew: true },
  { id: "3", title: "Nifty 50 High", time: "09:30 AM", text: "Nifty 50 touched intraday high of 24,185.60 (+0.58%)", isNew: true },
  { id: "4", title: "FII Sentiment", time: "09:15 AM", text: "Net institutional FII inflow of ₹1,420 Cr recorded in early session", isNew: false }
];

export const PORTFOLIO_DATA = {
  totalAUM: "₹48.25 Cr",
  dailyPnL: "+₹24.80 L (+0.52%)",
  sharpeRatio: "2.14",
  cashReserve: "12.4%",
  beta: "0.88",
  holdings: [
    { ticker: "RELIANCE", shares: 42000, avgCost: 2640, ltp: 2987.40, pnl: "+₹1.46 Cr (+13.1%)", weight: "26.0%" },
    { ticker: "TCS", shares: 25000, avgCost: 3820, ltp: 4120.50, pnl: "+₹75.12 L (+7.8%)", weight: "21.3%" },
    { ticker: "HDFCBANK", shares: 55000, avgCost: 1540, ltp: 1682.35, pnl: "+₹78.29 L (+9.2%)", weight: "19.2%" },
    { ticker: "TATAMOTORS", shares: 65000, avgCost: 810, ltp: 972.60, pnl: "+₹1.05 Cr (+20.0%)", weight: "13.1%" },
    { ticker: "INFY", shares: 30000, avgCost: 1720, ltp: 1845.20, pnl: "+₹37.56 L (+7.2%)", weight: "11.5%" }
  ]
};

