// FinIntel Comprehensive Institutional Market Data Store

export interface StockData {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  currency: string;
  currencySymbol: string;
  price: string;
  priceChange: string;
  isPositive: boolean;
  marketStatus: string;
  preMarket?: {
    price: string;
    change: string;
    percent: string;
    isPositive: boolean;
    label?: string;
  };
  stats: {
    open: string;
    high: string;
    low: string;
    range52W: string;
    marketCap: string;
    peRatio: string;
    dividend: string;
    qtrlyDivAmt: string;
    prevClose: string;
  };
  quarterlyFinancials: {
    value: string;
    yoyGrowth: string;
    isPositive: boolean;
    period: string;
    breakdown?: {
      revenue: string;
      netIncome: string;
      operatingMargin: string;
      cashFromOps: string;
    };
  };
  earnings: {
    beatPercent: string;
    isBeat: boolean;
    label: string;
    actualEps?: string;
    estimatedEps?: string;
    fiscalPeriod?: string;
  };
  timeframeCharts: Record<
    string,
    {
      points: Array<{ time: string; price: number }>;
      extendedPoints?: Array<{ time: string; price: number }>;
      prevClose: number;
      minPrice: number;
      maxPrice: number;
      yLabels: string[];
      xLabels: string[];
    }
  >;
  // Additional institutional analyst fields
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
  // 1. NVIDIA CORP (Matches exact reference screenshot visual numbers)
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corp",
    exchange: "NASDAQ",
    sector: "Semiconductors & AI Hardware",
    currency: "USD",
    currencySymbol: "$",
    price: "178.67",
    priceChange: "-7.97 (4.27%)",
    isPositive: false,
    marketStatus: "Closed: 10 Nov, 5:01 am GMT-5",
    preMarket: {
      price: "182.27",
      change: "+3.60",
      percent: "2.01%",
      isPositive: true,
      label: "Pre-market"
    },
    stats: {
      open: "173.06",
      high: "179.92",
      low: "170.24",
      range52W: "164.27 - 243.37",
      marketCap: "4.31LCr",
      peRatio: "22.59",
      dividend: "0.56%",
      qtrlyDivAmt: "0.25",
      prevClose: "186.64"
    },
    quarterlyFinancials: {
      value: "9.62KCr",
      yoyGrowth: "+105.85% Y/Y",
      isPositive: true,
      period: "2027 Q2 Revenue",
      breakdown: {
        revenue: "$30.04 B",
        netIncome: "$16.60 B",
        operatingMargin: "62.1%",
        cashFromOps: "$14.50 B"
      }
    },
    earnings: {
      beatPercent: "+6.16%",
      isBeat: true,
      label: "EPS Beat",
      actualEps: "$0.68",
      estimatedEps: "$0.64",
      fiscalPeriod: "Q2 FY25"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 186.64,
        minPrice: 170.0,
        maxPrice: 190.0,
        yLabels: ["190", "180", "170"],
        xLabels: ["2:00 pm", "8:00 pm"],
        // Matches exact screenshot coral curve:
        // Opens ~173.06, dips, climbs to ~180 peak, dips to 174, recovers to ~178.67 close
        points: [
          { time: "9:30 am", price: 173.06 },
          { time: "9:45 am", price: 177.20 },
          { time: "10:00 am", price: 179.50 },
          { time: "10:15 am", price: 177.10 },
          { time: "10:30 am", price: 179.92 },
          { time: "11:00 am", price: 175.40 },
          { time: "11:30 am", price: 173.80 },
          { time: "12:00 pm", price: 176.20 },
          { time: "12:45 pm", price: 178.50 },
          { time: "1:30 pm", price: 177.80 },
          { time: "2:00 pm", price: 176.10 },
          { time: "2:30 pm", price: 177.40 },
          { time: "3:00 pm", price: 175.80 },
          { time: "3:30 pm", price: 177.90 },
          { time: "4:00 pm", price: 178.67 }
        ],
        // Extended hours (pre-market/after-hours) path in grey to 182.27
        extendedPoints: [
          { time: "4:00 pm", price: 178.67 },
          { time: "4:30 pm", price: 180.20 },
          { time: "5:30 pm", price: 179.50 },
          { time: "6:30 pm", price: 181.10 },
          { time: "7:30 pm", price: 182.90 },
          { time: "8:00 pm", price: 182.27 }
        ]
      },
      "5D": {
        prevClose: 189.50,
        minPrice: 168.0,
        maxPrice: 195.0,
        yLabels: ["195", "180", "168"],
        xLabels: ["5 Nov", "10 Nov"],
        points: [
          { time: "Nov 5", price: 189.20 },
          { time: "Nov 6", price: 186.40 },
          { time: "Nov 7", price: 183.10 },
          { time: "Nov 8", price: 181.50 },
          { time: "Nov 10", price: 178.67 }
        ]
      },
      "1M": {
        prevClose: 172.00,
        minPrice: 160.0,
        maxPrice: 195.0,
        yLabels: ["195", "175", "160"],
        xLabels: ["10 Oct", "10 Nov"],
        points: [
          { time: "Oct 10", price: 165.20 },
          { time: "Oct 18", price: 172.80 },
          { time: "Oct 25", price: 184.60 },
          { time: "Nov 02", price: 189.90 },
          { time: "Nov 10", price: 178.67 }
        ]
      },
      "6M": {
        prevClose: 125.00,
        minPrice: 110.0,
        maxPrice: 200.0,
        yLabels: ["200", "150", "110"],
        xLabels: ["May", "Nov"],
        points: [
          { time: "May", price: 118.00 },
          { time: "Jun", price: 135.50 },
          { time: "Jul", price: 128.20 },
          { time: "Aug", price: 145.80 },
          { time: "Sep", price: 162.40 },
          { time: "Oct", price: 182.00 },
          { time: "Nov", price: 178.67 }
        ]
      },
      "YTD": {
        prevClose: 95.00,
        minPrice: 85.0,
        maxPrice: 200.0,
        yLabels: ["200", "140", "85"],
        xLabels: ["Jan", "Nov"],
        points: [
          { time: "Jan", price: 92.50 },
          { time: "Mar", price: 115.00 },
          { time: "May", price: 122.00 },
          { time: "Jul", price: 138.40 },
          { time: "Sep", price: 165.10 },
          { time: "Nov", price: 178.67 }
        ]
      },
      "1Y": {
        prevClose: 75.00,
        minPrice: 70.0,
        maxPrice: 200.0,
        yLabels: ["200", "135", "70"],
        xLabels: ["Nov '25", "Nov '26"],
        points: [
          { time: "Q1", price: 78.40 },
          { time: "Q2", price: 110.20 },
          { time: "Q3", price: 142.50 },
          { time: "Q4", price: 178.67 }
        ]
      },
      "5Y": {
        prevClose: 20.00,
        minPrice: 15.0,
        maxPrice: 200.0,
        yLabels: ["200", "100", "15"],
        xLabels: ["2021", "2026"],
        points: [
          { time: "2021", price: 24.50 },
          { time: "2022", price: 18.20 },
          { time: "2023", price: 45.00 },
          { time: "2024", price: 98.00 },
          { time: "2025", price: 140.00 },
          { time: "2026", price: 178.67 }
        ]
      },
      "Max": {
        prevClose: 5.00,
        minPrice: 1.0,
        maxPrice: 200.0,
        yLabels: ["200", "100", "1"],
        xLabels: ["IPO", "2026"],
        points: [
          { time: "1999", price: 1.80 },
          { time: "2010", price: 5.40 },
          { time: "2016", price: 14.20 },
          { time: "2020", price: 32.50 },
          { time: "2024", price: 120.00 },
          { time: "2026", price: 178.67 }
        ]
      }
    },
    marketCap: "4.31LCr",
    peTTM: "22.59",
    epsTTM: "$7.90",
    yield: "0.56%",
    high52W: "$243.37",
    low52W: "$164.27",
    about:
      "NVIDIA Corporation is the pioneer of GPU computing, dominating AI acceleration, data centers, gaming hardware, and autonomous vehicle compute platforms worldwide.",
    sentiment: "Strongly Bullish (88%)",
    sentimentScore: 88,
    bullPoints: [
      "Blackwell B200 architecture experiencing unprecedented hyperscaler demand",
      "Data Center segment gross margins sustained above 75%",
      "CUDA software moat creating high retention across global enterprise developers"
    ],
    bearPoints: [
      "Export controls on advanced chip architectures in select international jurisdictions",
      "Supply constraints in CoWoS packaging capacity limiting near-term volume shipments"
    ],
    ownership: { promoter: "4.2%", fii: "68.5%", dii: "18.2%", public: "9.1%" },
    financials: { revenue: "$120.8 B", ebitda: "$72.4 B", netProfit: "$61.2 B", deRatio: "0.14x", roce: "48.2%" },
    news: [
      { time: "10:02 AM", title: "NVIDIA expands Blackwell AI infrastructure deployments across global cloud partners", category: "AI Hardware", impact: "High Bullish" },
      { time: "08:45 AM", title: "Major cloud hyperscalers confirm multi-billion dollar capex additions for B200 accelerators", category: "Capex", impact: "Bullish" }
    ]
  },

  // 2. RELIANCE INDUSTRIES LTD
  RELIANCE: {
    ticker: "RELIANCE",
    name: "Reliance Industries Ltd",
    exchange: "RELIANCE · NSE",
    sector: "Energy, Retail & Telecom",
    currency: "INR",
    currencySymbol: "₹",
    price: "2,987.40",
    priceChange: "+12.30 (0.41%)",
    isPositive: true,
    marketStatus: "Closed: 10 Nov, 3:30 pm IST",
    preMarket: {
      price: "2,992.50",
      change: "+5.10",
      percent: "0.17%",
      isPositive: true,
      label: "After-hours"
    },
    stats: {
      open: "2,978.00",
      high: "2,994.50",
      low: "2,966.20",
      range52W: "2,222.00 - 3,024.90",
      marketCap: "20.24 L Cr",
      peRatio: "26.40",
      dividend: "0.34%",
      qtrlyDivAmt: "2.50",
      prevClose: "2,975.10"
    },
    quarterlyFinancials: {
      value: "2.41 L Cr",
      yoyGrowth: "+8.42% Y/Y",
      isPositive: true,
      period: "2025 Q2 Revenue",
      breakdown: {
        revenue: "₹2,41,800 Cr",
        netIncome: "₹19,320 Cr",
        operatingMargin: "17.8%",
        cashFromOps: "₹34,100 Cr"
      }
    },
    earnings: {
      beatPercent: "+4.18%",
      isBeat: true,
      label: "EPS Beat",
      actualEps: "₹28.60",
      estimatedEps: "₹27.45",
      fiscalPeriod: "Q2 FY25"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 2975.10,
        minPrice: 2960.0,
        maxPrice: 3000.0,
        yLabels: ["3,000", "2,980", "2,960"],
        xLabels: ["11:30 am", "3:30 pm"],
        points: [
          { time: "9:15 am", price: 2978.00 },
          { time: "9:45 am", price: 2972.50 },
          { time: "10:30 am", price: 2966.20 },
          { time: "11:15 am", price: 2975.40 },
          { time: "12:00 pm", price: 2981.10 },
          { time: "1:00 pm", price: 2984.60 },
          { time: "2:00 pm", price: 2994.50 },
          { time: "2:45 pm", price: 2990.20 },
          { time: "3:30 pm", price: 2987.40 }
        ],
        extendedPoints: [
          { time: "3:30 pm", price: 2987.40 },
          { time: "3:45 pm", price: 2989.00 },
          { time: "4:00 pm", price: 2992.50 }
        ]
      },
      "5D": {
        prevClose: 2950.00,
        minPrice: 2940.0,
        maxPrice: 3010.0,
        yLabels: ["3,010", "2,975", "2,940"],
        xLabels: ["5 Nov", "10 Nov"],
        points: [
          { time: "5 Nov", price: 2952.00 },
          { time: "6 Nov", price: 2965.40 },
          { time: "7 Nov", price: 2970.00 },
          { time: "8 Nov", price: 2975.10 },
          { time: "10 Nov", price: 2987.40 }
        ]
      },
      "1M": {
        prevClose: 2880.00,
        minPrice: 2850.0,
        maxPrice: 3020.0,
        yLabels: ["3,020", "2,930", "2,850"],
        xLabels: ["10 Oct", "10 Nov"],
        points: [
          { time: "10 Oct", price: 2890.00 },
          { time: "20 Oct", price: 2920.00 },
          { time: "30 Oct", price: 2955.00 },
          { time: "10 Nov", price: 2987.40 }
        ]
      },
      "6M": {
        prevClose: 2750.00,
        minPrice: 2700.0,
        maxPrice: 3050.0,
        yLabels: ["3,050", "2,875", "2,700"],
        xLabels: ["May", "Nov"],
        points: [
          { time: "May", price: 2760.00 },
          { time: "Jul", price: 2840.00 },
          { time: "Sep", price: 2940.00 },
          { time: "Nov", price: 2987.40 }
        ]
      },
      "YTD": {
        prevClose: 2580.00,
        minPrice: 2500.0,
        maxPrice: 3050.0,
        yLabels: ["3,050", "2,775", "2,500"],
        xLabels: ["Jan", "Nov"],
        points: [
          { time: "Jan", price: 2585.00 },
          { time: "Apr", price: 2720.00 },
          { time: "Jul", price: 2890.00 },
          { time: "Nov", price: 2987.40 }
        ]
      },
      "1Y": {
        prevClose: 2400.00,
        minPrice: 2350.0,
        maxPrice: 3050.0,
        yLabels: ["3,050", "2,700", "2,350"],
        xLabels: ["Nov '25", "Nov '26"],
        points: [
          { time: "Q1", price: 2420.00 },
          { time: "Q2", price: 2650.00 },
          { time: "Q3", price: 2880.00 },
          { time: "Q4", price: 2987.40 }
        ]
      },
      "5Y": {
        prevClose: 1950.00,
        minPrice: 1800.0,
        maxPrice: 3100.0,
        yLabels: ["3,100", "2,450", "1,800"],
        xLabels: ["2021", "2026"],
        points: [
          { time: "2021", price: 1980.00 },
          { time: "2022", price: 2350.00 },
          { time: "2023", price: 2540.00 },
          { time: "2024", price: 2790.00 },
          { time: "2026", price: 2987.40 }
        ]
      },
      "Max": {
        prevClose: 100.00,
        minPrice: 50.0,
        maxPrice: 3100.0,
        yLabels: ["3,100", "1,500", "50"],
        xLabels: ["2005", "2026"],
        points: [
          { time: "2005", price: 280.00 },
          { time: "2010", price: 510.00 },
          { time: "2015", price: 880.00 },
          { time: "2020", price: 1950.00 },
          { time: "2026", price: 2987.40 }
        ]
      }
    },
    marketCap: "₹20.24 L Cr",
    peTTM: "26.40",
    epsTTM: "₹113.20",
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

  // 3. TATA CONSULTANCY SERVICES (TCS)
  TCS: {
    ticker: "TCS",
    name: "Tata Consultancy Services Ltd",
    exchange: "TCS · NSE",
    sector: "Information Technology",
    currency: "INR",
    currencySymbol: "₹",
    price: "4,120.50",
    priceChange: "+28.70 (0.70%)",
    isPositive: true,
    marketStatus: "Closed: 10 Nov, 3:30 pm IST",
    preMarket: {
      price: "4,126.00",
      change: "+5.50",
      percent: "0.13%",
      isPositive: true,
      label: "After-hours"
    },
    stats: {
      open: "4,100.00",
      high: "4,135.00",
      low: "4,085.00",
      range52W: "3,311.00 - 4,585.00",
      marketCap: "14.92 L Cr",
      peRatio: "31.20",
      dividend: "1.25%",
      qtrlyDivAmt: "10.00",
      prevClose: "4,091.80"
    },
    quarterlyFinancials: {
      value: "64.25 K Cr",
      yoyGrowth: "+7.63% Y/Y",
      isPositive: true,
      period: "2025 Q2 Revenue",
      breakdown: {
        revenue: "₹64,259 Cr",
        netIncome: "₹11,909 Cr",
        operatingMargin: "24.1%",
        cashFromOps: "₹12,400 Cr"
      }
    },
    earnings: {
      beatPercent: "+2.85%",
      isBeat: true,
      label: "EPS Beat",
      actualEps: "₹32.90",
      estimatedEps: "₹31.98",
      fiscalPeriod: "Q2 FY25"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 4091.80,
        minPrice: 4075.0,
        maxPrice: 4145.0,
        yLabels: ["4,140", "4,110", "4,080"],
        xLabels: ["11:30 am", "3:30 pm"],
        points: [
          { time: "9:15 am", price: 4100.00 },
          { time: "10:15 am", price: 4085.00 },
          { time: "11:30 am", price: 4110.20 },
          { time: "1:00 pm", price: 4125.00 },
          { time: "2:15 pm", price: 4135.00 },
          { time: "3:30 pm", price: 4120.50 }
        ],
        extendedPoints: [
          { time: "3:30 pm", price: 4120.50 },
          { time: "4:00 pm", price: 4126.00 }
        ]
      },
      "5D": {
        prevClose: 4050.00,
        minPrice: 4020.0,
        maxPrice: 4150.0,
        yLabels: ["4,150", "4,085", "4,020"],
        xLabels: ["5 Nov", "10 Nov"],
        points: [
          { time: "5 Nov", price: 4040.00 },
          { time: "7 Nov", price: 4075.00 },
          { time: "10 Nov", price: 4120.50 }
        ]
      },
      "1M": {
        prevClose: 3980.00,
        minPrice: 3950.0,
        maxPrice: 4180.0,
        yLabels: ["4,180", "4,065", "3,950"],
        xLabels: ["10 Oct", "10 Nov"],
        points: [
          { time: "10 Oct", price: 3990.00 },
          { time: "25 Oct", price: 4045.00 },
          { time: "10 Nov", price: 4120.50 }
        ]
      },
      "6M": {
        prevClose: 3800.00,
        minPrice: 3750.0,
        maxPrice: 4250.0,
        yLabels: ["4,250", "4,000", "3,750"],
        xLabels: ["May", "Nov"],
        points: [
          { time: "May", price: 3820.00 },
          { time: "Aug", price: 3990.00 },
          { time: "Nov", price: 4120.50 }
        ]
      },
      "YTD": {
        prevClose: 3650.00,
        minPrice: 3600.0,
        maxPrice: 4300.0,
        yLabels: ["4,300", "3,950", "3,600"],
        xLabels: ["Jan", "Nov"],
        points: [
          { time: "Jan", price: 3680.00 },
          { time: "Jun", price: 3910.00 },
          { time: "Nov", price: 4120.50 }
        ]
      },
      "1Y": {
        prevClose: 3450.00,
        minPrice: 3400.0,
        maxPrice: 4300.0,
        yLabels: ["4,300", "3,850", "3,400"],
        xLabels: ["Nov '25", "Nov '26"],
        points: [
          { time: "Q1", price: 3500.00 },
          { time: "Q2", price: 3800.00 },
          { time: "Q3", price: 4050.00 },
          { time: "Q4", price: 4120.50 }
        ]
      },
      "5Y": {
        prevClose: 2800.00,
        minPrice: 2700.0,
        maxPrice: 4400.0,
        yLabels: ["4,400", "3,550", "2,700"],
        xLabels: ["2021", "2026"],
        points: [
          { time: "2021", price: 2900.00 },
          { time: "2023", price: 3300.00 },
          { time: "2026", price: 4120.50 }
        ]
      },
      "Max": {
        prevClose: 400.00,
        minPrice: 200.0,
        maxPrice: 4400.0,
        yLabels: ["4,400", "2,300", "200"],
        xLabels: ["2004", "2026"],
        points: [
          { time: "2004", price: 250.00 },
          { time: "2015", price: 1200.00 },
          { time: "2026", price: 4120.50 }
        ]
      }
    },
    marketCap: "₹14.92 L Cr",
    peTTM: "31.20",
    epsTTM: "₹132.10",
    yield: "1.25%",
    high52W: "₹4,585.00",
    low52W: "₹3,311.00",
    about:
      "Tata Consultancy Services is India's largest IT services firm and consulting leader with multi-decade relationships across Banking, Financial Services, Retail, and Healthcare.",
    sentiment: "Moderately Bullish (65%)",
    sentimentScore: 65,
    bullPoints: [
      "Total Contract Value (TCV) bookings reached $10.0B in the latest quarter",
      "Operating margins lead industry peers at 24.1%",
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

  // 4. INFOSYS (INFY)
  INFY: {
    ticker: "INFY",
    name: "Infosys Ltd",
    exchange: "INFY · NSE",
    sector: "Information Technology",
    currency: "INR",
    currencySymbol: "₹",
    price: "1,845.20",
    priceChange: "-8.40 (0.45%)",
    isPositive: false,
    marketStatus: "Closed: 10 Nov, 3:30 pm IST",
    preMarket: {
      price: "1,843.00",
      change: "-2.20",
      percent: "0.12%",
      isPositive: false,
      label: "After-hours"
    },
    stats: {
      open: "1,850.00",
      high: "1,858.00",
      low: "1,838.00",
      range52W: "1,358.00 - 1,991.00",
      marketCap: "7.66 L Cr",
      peRatio: "29.10",
      dividend: "2.10%",
      qtrlyDivAmt: "5.20",
      prevClose: "1,853.60"
    },
    quarterlyFinancials: {
      value: "40.98 K Cr",
      yoyGrowth: "+5.12% Y/Y",
      isPositive: true,
      period: "2025 Q2 Revenue",
      breakdown: {
        revenue: "₹40,986 Cr",
        netIncome: "₹6,506 Cr",
        operatingMargin: "21.1%",
        cashFromOps: "₹7,200 Cr"
      }
    },
    earnings: {
      beatPercent: "-1.15%",
      isBeat: false,
      label: "EPS Miss",
      actualEps: "₹15.70",
      estimatedEps: "₹15.88",
      fiscalPeriod: "Q2 FY25"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 1853.60,
        minPrice: 1830.0,
        maxPrice: 1865.0,
        yLabels: ["1,865", "1,850", "1,830"],
        xLabels: ["11:30 am", "3:30 pm"],
        points: [
          { time: "9:15 am", price: 1850.00 },
          { time: "10:15 am", price: 1858.00 },
          { time: "11:30 am", price: 1848.40 },
          { time: "1:00 pm", price: 1838.00 },
          { time: "2:30 pm", price: 1842.20 },
          { time: "3:30 pm", price: 1845.20 }
        ],
        extendedPoints: [
          { time: "3:30 pm", price: 1845.20 },
          { time: "4:00 pm", price: 1843.00 }
        ]
      },
      "5D": {
        prevClose: 1860.00,
        minPrice: 1825.0,
        maxPrice: 1870.0,
        yLabels: ["1,870", "1,850", "1,825"],
        xLabels: ["5 Nov", "10 Nov"],
        points: [
          { time: "5 Nov", price: 1862.00 },
          { time: "7 Nov", price: 1848.00 },
          { time: "10 Nov", price: 1845.20 }
        ]
      },
      "1M": {
        prevClose: 1890.00,
        minPrice: 1810.0,
        maxPrice: 1910.0,
        yLabels: ["1,910", "1,860", "1,810"],
        xLabels: ["10 Oct", "10 Nov"],
        points: [
          { time: "10 Oct", price: 1895.00 },
          { time: "25 Oct", price: 1865.00 },
          { time: "10 Nov", price: 1845.20 }
        ]
      },
      "6M": {
        prevClose: 1650.00,
        minPrice: 1600.0,
        maxPrice: 1950.0,
        yLabels: ["1,950", "1,775", "1,600"],
        xLabels: ["May", "Nov"],
        points: [
          { time: "May", price: 1620.00 },
          { time: "Aug", price: 1780.00 },
          { time: "Nov", price: 1845.20 }
        ]
      },
      "YTD": {
        prevClose: 1540.00,
        minPrice: 1500.0,
        maxPrice: 1950.0,
        yLabels: ["1,950", "1,725", "1,500"],
        xLabels: ["Jan", "Nov"],
        points: [
          { time: "Jan", price: 1545.00 },
          { time: "Jun", price: 1720.00 },
          { time: "Nov", price: 1845.20 }
        ]
      },
      "1Y": {
        prevClose: 1420.00,
        minPrice: 1380.0,
        maxPrice: 1950.0,
        yLabels: ["1,950", "1,665", "1,380"],
        xLabels: ["Nov '25", "Nov '26"],
        points: [
          { time: "Q1", price: 1450.00 },
          { time: "Q2", price: 1610.00 },
          { time: "Q3", price: 1790.00 },
          { time: "Q4", price: 1845.20 }
        ]
      },
      "5Y": {
        prevClose: 1250.00,
        minPrice: 1100.0,
        maxPrice: 2000.0,
        yLabels: ["2,000", "1,550", "1,100"],
        xLabels: ["2021", "2026"],
        points: [
          { time: "2021", price: 1350.00 },
          { time: "2023", price: 1420.00 },
          { time: "2026", price: 1845.20 }
        ]
      },
      "Max": {
        prevClose: 100.00,
        minPrice: 50.0,
        maxPrice: 2000.0,
        yLabels: ["2,000", "1,025", "50"],
        xLabels: ["1999", "2026"],
        points: [
          { time: "1999", price: 80.00 },
          { time: "2010", price: 420.00 },
          { time: "2026", price: 1845.20 }
        ]
      }
    },
    marketCap: "₹7.66 L Cr",
    peTTM: "29.10",
    epsTTM: "₹63.40",
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

  // 5. TATA MOTORS (TATAMOTORS)
  TATAMOTORS: {
    ticker: "TATAMOTORS",
    name: "Tata Motors Ltd",
    exchange: "TATAMOTORS · NSE",
    sector: "Automobile & EV",
    currency: "INR",
    currencySymbol: "₹",
    price: "972.60",
    priceChange: "+21.40 (2.25%)",
    isPositive: true,
    marketStatus: "Closed: 10 Nov, 3:30 pm IST",
    preMarket: {
      price: "975.00",
      change: "+2.40",
      percent: "0.25%",
      isPositive: true,
      label: "After-hours"
    },
    stats: {
      open: "956.00",
      high: "978.50",
      low: "950.00",
      range52W: "640.00 - 1,179.00",
      marketCap: "3.58 L Cr",
      peRatio: "14.80",
      dividend: "0.62%",
      qtrlyDivAmt: "1.50",
      prevClose: "951.20"
    },
    quarterlyFinancials: {
      value: "1.12 L Cr",
      yoyGrowth: "+13.70% Y/Y",
      isPositive: true,
      period: "2025 Q2 Revenue",
      breakdown: {
        revenue: "₹1,12,400 Cr",
        netIncome: "₹7,850 Cr",
        operatingMargin: "14.2%",
        cashFromOps: "₹11,800 Cr"
      }
    },
    earnings: {
      beatPercent: "+8.40%",
      isBeat: true,
      label: "EPS Beat",
      actualEps: "₹21.40",
      estimatedEps: "₹19.74",
      fiscalPeriod: "Q2 FY25"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 951.20,
        minPrice: 945.0,
        maxPrice: 985.0,
        yLabels: ["985", "965", "945"],
        xLabels: ["11:30 am", "3:30 pm"],
        points: [
          { time: "9:15 am", price: 956.00 },
          { time: "10:15 am", price: 950.00 },
          { time: "11:45 am", price: 964.20 },
          { time: "1:30 pm", price: 978.50 },
          { time: "2:45 pm", price: 970.10 },
          { time: "3:30 pm", price: 972.60 }
        ],
        extendedPoints: [
          { time: "3:30 pm", price: 972.60 },
          { time: "4:00 pm", price: 975.00 }
        ]
      },
      "5D": {
        prevClose: 940.00,
        minPrice: 930.0,
        maxPrice: 990.0,
        yLabels: ["990", "960", "930"],
        xLabels: ["5 Nov", "10 Nov"],
        points: [
          { time: "5 Nov", price: 938.00 },
          { time: "7 Nov", price: 955.00 },
          { time: "10 Nov", price: 972.60 }
        ]
      },
      "1M": {
        prevClose: 910.00,
        minPrice: 890.0,
        maxPrice: 1000.0,
        yLabels: ["1,000", "945", "890"],
        xLabels: ["10 Oct", "10 Nov"],
        points: [
          { time: "10 Oct", price: 915.00 },
          { time: "25 Oct", price: 942.00 },
          { time: "10 Nov", price: 972.60 }
        ]
      },
      "6M": {
        prevClose: 850.00,
        minPrice: 820.0,
        maxPrice: 1050.0,
        yLabels: ["1,050", "935", "820"],
        xLabels: ["May", "Nov"],
        points: [
          { time: "May", price: 830.00 },
          { time: "Aug", price: 910.00 },
          { time: "Nov", price: 972.60 }
        ]
      },
      "YTD": {
        prevClose: 780.00,
        minPrice: 750.0,
        maxPrice: 1180.0,
        yLabels: ["1,180", "965", "750"],
        xLabels: ["Jan", "Nov"],
        points: [
          { time: "Jan", price: 790.00 },
          { time: "Jul", price: 1080.00 },
          { time: "Nov", price: 972.60 }
        ]
      },
      "1Y": {
        prevClose: 650.00,
        minPrice: 620.0,
        maxPrice: 1180.0,
        yLabels: ["1,180", "900", "620"],
        xLabels: ["Nov '25", "Nov '26"],
        points: [
          { time: "Q1", price: 680.00 },
          { time: "Q2", price: 920.00 },
          { time: "Q3", price: 1140.00 },
          { time: "Q4", price: 972.60 }
        ]
      },
      "5Y": {
        prevClose: 320.00,
        minPrice: 280.0,
        maxPrice: 1200.0,
        yLabels: ["1,200", "740", "280"],
        xLabels: ["2021", "2026"],
        points: [
          { time: "2021", price: 340.00 },
          { time: "2023", price: 620.00 },
          { time: "2026", price: 972.60 }
        ]
      },
      "Max": {
        prevClose: 80.00,
        minPrice: 60.0,
        maxPrice: 1200.0,
        yLabels: ["1,200", "630", "60"],
        xLabels: ["2003", "2026"],
        points: [
          { time: "2003", price: 95.00 },
          { time: "2015", price: 540.00 },
          { time: "2020", price: 140.00 },
          { time: "2026", price: 972.60 }
        ]
      }
    },
    marketCap: "₹3.58 L Cr",
    peTTM: "14.80",
    epsTTM: "₹65.70",
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
  },

  // 6. HDFC BANK (HDFCBANK)
  HDFCBANK: {
    ticker: "HDFCBANK",
    name: "HDFC Bank Ltd",
    exchange: "HDFCBANK · NSE",
    sector: "Banking & Financials",
    currency: "INR",
    currencySymbol: "₹",
    price: "1,682.35",
    priceChange: "+15.80 (0.95%)",
    isPositive: true,
    marketStatus: "Closed: 10 Nov, 3:30 pm IST",
    preMarket: {
      price: "1,685.00",
      change: "+2.65",
      percent: "0.16%",
      isPositive: true,
      label: "After-hours"
    },
    stats: {
      open: "1,670.00",
      high: "1,691.00",
      low: "1,665.00",
      range52W: "1,363.00 - 1,794.00",
      marketCap: "12.78 L Cr",
      peRatio: "18.60",
      dividend: "1.16%",
      qtrlyDivAmt: "4.85",
      prevClose: "1,666.55"
    },
    quarterlyFinancials: {
      value: "85.40 K Cr",
      yoyGrowth: "+16.80% Y/Y",
      isPositive: true,
      period: "2025 Q2 Revenue",
      breakdown: {
        revenue: "₹85,400 Cr",
        netIncome: "₹16,820 Cr",
        operatingMargin: "38.2%",
        cashFromOps: "₹24,500 Cr"
      }
    },
    earnings: {
      beatPercent: "+4.20%",
      isBeat: true,
      label: "EPS Beat",
      actualEps: "₹22.10",
      estimatedEps: "₹21.21",
      fiscalPeriod: "Q2 FY25"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 1666.55,
        minPrice: 1655.0,
        maxPrice: 1700.0,
        yLabels: ["1,700", "1,680", "1,660"],
        xLabels: ["11:30 am", "3:30 pm"],
        points: [
          { time: "9:15 am", price: 1670.00 },
          { time: "10:30 am", price: 1665.00 },
          { time: "12:00 pm", price: 1676.80 },
          { time: "1:45 pm", price: 1691.00 },
          { time: "2:45 pm", price: 1684.50 },
          { time: "3:30 pm", price: 1682.35 }
        ],
        extendedPoints: [
          { time: "3:30 pm", price: 1682.35 },
          { time: "4:00 pm", price: 1685.00 }
        ]
      },
      "5D": {
        prevClose: 1645.00,
        minPrice: 1640.0,
        maxPrice: 1695.0,
        yLabels: ["1,695", "1,668", "1,640"],
        xLabels: ["5 Nov", "10 Nov"],
        points: [
          { time: "5 Nov", price: 1648.00 },
          { time: "7 Nov", price: 1662.00 },
          { time: "10 Nov", price: 1682.35 }
        ]
      },
      "1M": {
        prevClose: 1620.00,
        minPrice: 1600.0,
        maxPrice: 1710.0,
        yLabels: ["1,710", "1,655", "1,600"],
        xLabels: ["10 Oct", "10 Nov"],
        points: [
          { time: "10 Oct", price: 1625.00 },
          { time: "25 Oct", price: 1658.00 },
          { time: "10 Nov", price: 1682.35 }
        ]
      },
      "6M": {
        prevClose: 1520.00,
        minPrice: 1480.0,
        maxPrice: 1730.0,
        yLabels: ["1,730", "1,605", "1,480"],
        xLabels: ["May", "Nov"],
        points: [
          { time: "May", price: 1510.00 },
          { time: "Aug", price: 1620.00 },
          { time: "Nov", price: 1682.35 }
        ]
      },
      "YTD": {
        prevClose: 1680.00,
        minPrice: 1400.0,
        maxPrice: 1780.0,
        yLabels: ["1,780", "1,590", "1,400"],
        xLabels: ["Jan", "Nov"],
        points: [
          { time: "Jan", price: 1690.00 },
          { time: "Feb", price: 1420.00 },
          { time: "Jun", price: 1610.00 },
          { time: "Nov", price: 1682.35 }
        ]
      },
      "1Y": {
        prevClose: 1500.00,
        minPrice: 1380.0,
        maxPrice: 1780.0,
        yLabels: ["1,780", "1,580", "1,380"],
        xLabels: ["Nov '25", "Nov '26"],
        points: [
          { time: "Q1", price: 1440.00 },
          { time: "Q2", price: 1580.00 },
          { time: "Q3", price: 1660.00 },
          { time: "Q4", price: 1682.35 }
        ]
      },
      "5Y": {
        prevClose: 1380.00,
        minPrice: 1250.0,
        maxPrice: 1800.0,
        yLabels: ["1,800", "1,525", "1,250"],
        xLabels: ["2021", "2026"],
        points: [
          { time: "2021", price: 1420.00 },
          { time: "2023", price: 1580.00 },
          { time: "2026", price: 1682.35 }
        ]
      },
      "Max": {
        prevClose: 100.00,
        minPrice: 80.0,
        maxPrice: 1800.0,
        yLabels: ["1,800", "940", "80"],
        xLabels: ["2002", "2026"],
        points: [
          { time: "2002", price: 90.00 },
          { time: "2012", price: 580.00 },
          { time: "2020", price: 1220.00 },
          { time: "2026", price: 1682.35 }
        ]
      }
    },
    marketCap: "₹12.78 L Cr",
    peTTM: "18.60",
    epsTTM: "₹90.40",
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

  // 7. APPLE INC (AAPL)
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc",
    exchange: "NASDAQ",
    sector: "Consumer Electronics & Services",
    currency: "USD",
    currencySymbol: "$",
    price: "224.23",
    priceChange: "+3.15 (1.42%)",
    isPositive: true,
    marketStatus: "Closed: 10 Nov, 5:01 am GMT-5",
    preMarket: {
      price: "225.10",
      change: "+0.87",
      percent: "0.39%",
      isPositive: true,
      label: "Pre-market"
    },
    stats: {
      open: "221.50",
      high: "225.40",
      low: "220.80",
      range52W: "164.08 - 237.23",
      marketCap: "3.42LCr",
      peRatio: "33.80",
      dividend: "0.44%",
      qtrlyDivAmt: "0.25",
      prevClose: "221.08"
    },
    quarterlyFinancials: {
      value: "94.93B",
      yoyGrowth: "+6.07% Y/Y",
      isPositive: true,
      period: "2024 Q4 Revenue",
      breakdown: {
        revenue: "$94.93 B",
        netIncome: "$14.73 B",
        operatingMargin: "31.2%",
        cashFromOps: "$26.80 B"
      }
    },
    earnings: {
      beatPercent: "+4.10%",
      isBeat: true,
      label: "EPS Beat",
      actualEps: "$1.64",
      estimatedEps: "$1.58",
      fiscalPeriod: "Q4 FY24"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 221.08,
        minPrice: 218.0,
        maxPrice: 228.0,
        yLabels: ["228", "223", "218"],
        xLabels: ["2:00 pm", "8:00 pm"],
        points: [
          { time: "9:30 am", price: 221.50 },
          { time: "10:30 am", price: 220.80 },
          { time: "12:00 pm", price: 222.90 },
          { time: "1:30 pm", price: 224.10 },
          { time: "2:45 pm", price: 225.40 },
          { time: "4:00 pm", price: 224.23 }
        ],
        extendedPoints: [
          { time: "4:00 pm", price: 224.23 },
          { time: "8:00 pm", price: 225.10 }
        ]
      },
      "5D": {
        prevClose: 220.00,
        minPrice: 216.0,
        maxPrice: 226.0,
        yLabels: ["226", "221", "216"],
        xLabels: ["5 Nov", "10 Nov"],
        points: [
          { time: "5 Nov", price: 218.40 },
          { time: "8 Nov", price: 221.08 },
          { time: "10 Nov", price: 224.23 }
        ]
      },
      "1M": {
        prevClose: 215.00,
        minPrice: 210.0,
        maxPrice: 230.0,
        yLabels: ["230", "220", "210"],
        xLabels: ["10 Oct", "10 Nov"],
        points: [
          { time: "10 Oct", price: 216.50 },
          { time: "25 Oct", price: 222.00 },
          { time: "10 Nov", price: 224.23 }
        ]
      },
      "6M": {
        prevClose: 185.00,
        minPrice: 180.0,
        maxPrice: 235.0,
        yLabels: ["235", "205", "180"],
        xLabels: ["May", "Nov"],
        points: [
          { time: "May", price: 183.00 },
          { time: "Aug", price: 218.00 },
          { time: "Nov", price: 224.23 }
        ]
      },
      "YTD": {
        prevClose: 185.00,
        minPrice: 165.0,
        maxPrice: 238.0,
        yLabels: ["238", "200", "165"],
        xLabels: ["Jan", "Nov"],
        points: [
          { time: "Jan", price: 185.00 },
          { time: "Apr", price: 169.00 },
          { time: "Jul", price: 228.00 },
          { time: "Nov", price: 224.23 }
        ]
      },
      "1Y": {
        prevClose: 175.00,
        minPrice: 165.0,
        maxPrice: 238.0,
        yLabels: ["238", "200", "165"],
        xLabels: ["Nov '25", "Nov '26"],
        points: [
          { time: "Q1", price: 182.00 },
          { time: "Q2", price: 198.00 },
          { time: "Q3", price: 224.23 }
        ]
      },
      "5Y": {
        prevClose: 120.00,
        minPrice: 110.0,
        maxPrice: 240.0,
        yLabels: ["240", "175", "110"],
        xLabels: ["2021", "2026"],
        points: [
          { time: "2021", price: 125.00 },
          { time: "2023", price: 175.00 },
          { time: "2026", price: 224.23 }
        ]
      },
      "Max": {
        prevClose: 1.00,
        minPrice: 0.5,
        maxPrice: 240.0,
        yLabels: ["240", "120", "0.5"],
        xLabels: ["1980", "2026"],
        points: [
          { time: "1980", price: 0.50 },
          { time: "2010", price: 11.20 },
          { time: "2020", price: 115.00 },
          { time: "2026", price: 224.23 }
        ]
      }
    },
    marketCap: "3.42LCr",
    peTTM: "33.80",
    epsTTM: "$6.08",
    yield: "0.44%",
    high52W: "$237.23",
    low52W: "$164.08",
    about:
      "Apple Inc designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services globally.",
    sentiment: "Bullish (79%)",
    sentimentScore: 79,
    bullPoints: [
      "Apple Intelligence rollouts driving multi-year iPhone supercycle replacement demand",
      "Services revenue (iCloud, Apple Pay, App Store) margin expansion reaching 74%",
      "Substantial capital return with over $100B in annual buybacks"
    ],
    bearPoints: [
      "Greater China regional smartphone market competition",
      "Regulatory scrutiny over European App Store monetization policies"
    ],
    ownership: { promoter: "0.1%", fii: "61.2%", dii: "28.5%", public: "10.2%" },
    financials: { revenue: "$391.0 B", ebitda: "$130.5 B", netProfit: "$93.7 B", deRatio: "1.45x", roce: "58.2%" },
    news: [
      { time: "09:20 AM", title: "Apple Intelligence updates unlock new multilingual enterprise Siri workflows", category: "AI", impact: "Bullish" }
    ]
  },

  // 8. MICROSOFT CORP (MSFT)
  MSFT: {
    ticker: "MSFT",
    name: "Microsoft Corp",
    exchange: "NASDAQ",
    sector: "Cloud Infrastructure & Enterprise Software",
    currency: "USD",
    currencySymbol: "$",
    price: "415.80",
    priceChange: "+4.90 (1.19%)",
    isPositive: true,
    marketStatus: "Closed: 10 Nov, 5:01 am GMT-5",
    preMarket: {
      price: "417.00",
      change: "+1.20",
      percent: "0.29%",
      isPositive: true,
      label: "Pre-market"
    },
    stats: {
      open: "412.00",
      high: "417.30",
      low: "411.50",
      range52W: "366.78 - 468.35",
      marketCap: "3.09LCr",
      peRatio: "34.20",
      dividend: "0.72%",
      qtrlyDivAmt: "0.83",
      prevClose: "410.90"
    },
    quarterlyFinancials: {
      value: "65.59B",
      yoyGrowth: "+16.04% Y/Y",
      isPositive: true,
      period: "2025 Q1 Revenue",
      breakdown: {
        revenue: "$65.59 B",
        netIncome: "$24.67 B",
        operatingMargin: "46.2%",
        cashFromOps: "$34.20 B"
      }
    },
    earnings: {
      beatPercent: "+3.20%",
      isBeat: true,
      label: "EPS Beat",
      actualEps: "$3.30",
      estimatedEps: "$3.10",
      fiscalPeriod: "Q1 FY25"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 410.90,
        minPrice: 405.0,
        maxPrice: 422.0,
        yLabels: ["420", "415", "410"],
        xLabels: ["2:00 pm", "8:00 pm"],
        points: [
          { time: "9:30 am", price: 412.00 },
          { time: "10:30 am", price: 411.50 },
          { time: "12:00 pm", price: 414.20 },
          { time: "1:30 pm", price: 416.80 },
          { time: "2:45 pm", price: 417.30 },
          { time: "4:00 pm", price: 415.80 }
        ],
        extendedPoints: [
          { time: "4:00 pm", price: 415.80 },
          { time: "8:00 pm", price: 417.00 }
        ]
      },
      "5D": {
        prevClose: 408.00,
        minPrice: 402.0,
        maxPrice: 420.0,
        yLabels: ["420", "410", "402"],
        xLabels: ["5 Nov", "10 Nov"],
        points: [
          { time: "5 Nov", price: 406.50 },
          { time: "8 Nov", price: 410.90 },
          { time: "10 Nov", price: 415.80 }
        ]
      },
      "1M": {
        prevClose: 418.00,
        minPrice: 400.0,
        maxPrice: 430.0,
        yLabels: ["430", "415", "400"],
        xLabels: ["10 Oct", "10 Nov"],
        points: [
          { time: "10 Oct", price: 416.00 },
          { time: "25 Oct", price: 424.00 },
          { time: "10 Nov", price: 415.80 }
        ]
      },
      "6M": {
        prevClose: 395.00,
        minPrice: 385.0,
        maxPrice: 460.0,
        yLabels: ["460", "420", "385"],
        xLabels: ["May", "Nov"],
        points: [
          { time: "May", price: 398.00 },
          { time: "Jul", price: 445.00 },
          { time: "Nov", price: 415.80 }
        ]
      },
      "YTD": {
        prevClose: 375.00,
        minPrice: 370.0,
        maxPrice: 468.0,
        yLabels: ["468", "420", "370"],
        xLabels: ["Jan", "Nov"],
        points: [
          { time: "Jan", price: 376.00 },
          { time: "May", price: 425.00 },
          { time: "Nov", price: 415.80 }
        ]
      },
      "1Y": {
        prevClose: 360.00,
        minPrice: 350.0,
        maxPrice: 468.0,
        yLabels: ["468", "410", "350"],
        xLabels: ["Nov '25", "Nov '26"],
        points: [
          { time: "Q1", price: 375.00 },
          { time: "Q2", price: 420.00 },
          { time: "Q3", price: 415.80 }
        ]
      },
      "5Y": {
        prevClose: 215.00,
        minPrice: 200.0,
        maxPrice: 470.0,
        yLabels: ["470", "335", "200"],
        xLabels: ["2021", "2026"],
        points: [
          { time: "2021", price: 220.00 },
          { time: "2023", price: 310.00 },
          { time: "2026", price: 415.80 }
        ]
      },
      "Max": {
        prevClose: 1.00,
        minPrice: 0.5,
        maxPrice: 470.0,
        yLabels: ["470", "235", "0.5"],
        xLabels: ["1986", "2026"],
        points: [
          { time: "1986", price: 0.10 },
          { time: "2000", price: 55.00 },
          { time: "2015", price: 45.00 },
          { time: "2026", price: 415.80 }
        ]
      }
    },
    marketCap: "3.09LCr",
    peTTM: "34.20",
    epsTTM: "$12.15",
    yield: "0.72%",
    high52W: "$468.35",
    low52W: "$366.78",
    about:
      "Microsoft Corporation is a global technology leader developing software, cloud infrastructure via Azure, consumer electronics, gaming through Xbox, and pioneering generative AI with Copilot.",
    sentiment: "Strongly Bullish (84%)",
    sentimentScore: 84,
    bullPoints: [
      "Azure cloud revenue accelerating 33% constant currency driven by 12 points of AI workloads",
      "Microsoft 365 Copilot adoption expanding across 70% of Fortune 500 enterprises",
      "Commercial RPO backlog surpassing $259B"
    ],
    bearPoints: [
      "Heavy AI infrastructure capex temporarily impacting gross margins",
      "Gaming hardware revenue contraction post Activision-Blizzard consolidation"
    ],
    ownership: { promoter: "1.4%", fii: "71.2%", dii: "19.8%", public: "7.6%" },
    financials: { revenue: "$245.1 B", ebitda: "$125.8 B", netProfit: "$88.1 B", deRatio: "0.32x", roce: "35.8%" },
    news: [
      { time: "08:15 AM", title: "Microsoft Azure announces expanded enterprise AI security and sovereign cloud regions", category: "Cloud", impact: "Bullish" }
    ]
  }
};

// Safe getter function that returns stock data or creates a consistent fallback
export function getStockData(ticker: string): StockData {
  const upper = (ticker || "NVDA").toUpperCase().trim();
  if (STOCKS[upper]) {
    return STOCKS[upper];
  }

  // Graceful fallback for any searched stock not yet in the pre-defined list
  return {
    ticker: upper,
    name: `${upper} Inc.`,
    exchange: `${upper} · US`,
    sector: "Equity",
    currency: "USD",
    currencySymbol: "$",
    price: "150.00",
    priceChange: "+1.50 (1.01%)",
    isPositive: true,
    marketStatus: "Closed: Market Reference • Disclaimer",
    stats: {
      open: "148.50",
      high: "151.20",
      low: "147.80",
      range52W: "120.00 - 165.00",
      marketCap: "Data unavailable",
      peRatio: "Data unavailable",
      dividend: "Data unavailable",
      qtrlyDivAmt: "Data unavailable",
      prevClose: "148.50"
    },
    quarterlyFinancials: {
      value: "Data unavailable",
      yoyGrowth: "Data unavailable",
      isPositive: true,
      period: "Latest Reported Revenue"
    },
    earnings: {
      beatPercent: "Data unavailable",
      isBeat: true,
      label: "EPS Status"
    },
    timeframeCharts: {
      "1D": {
        prevClose: 148.50,
        minPrice: 145.0,
        maxPrice: 155.0,
        yLabels: ["155", "150", "145"],
        xLabels: ["9:30 am", "4:00 pm"],
        points: [
          { time: "9:30 am", price: 148.50 },
          { time: "11:00 am", price: 149.20 },
          { time: "1:00 pm", price: 151.20 },
          { time: "4:00 pm", price: 150.00 }
        ]
      }
    },
    marketCap: "Data unavailable",
    peTTM: "Data unavailable",
    epsTTM: "Data unavailable",
    yield: "Data unavailable",
    high52W: "Data unavailable",
    low52W: "Data unavailable",
    about: `${upper} is a publicly traded company. Institutional research coverage is currently initializing.`,
    sentiment: "Neutral",
    sentimentScore: 50,
    bullPoints: ["Institutional coverage initializing"],
    bearPoints: ["Awaiting quarterly disclosures"],
    ownership: { promoter: "0%", fii: "0%", dii: "0%", public: "0%" },
    financials: { revenue: "Data unavailable", ebitda: "Data unavailable", netProfit: "Data unavailable", deRatio: "Data unavailable", roce: "Data unavailable" },
    news: []
  };
}

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
