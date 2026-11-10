"use client";

import React, { useState } from "react";
import { STOCKS, getStockData, StockData } from "@/lib/marketData";
import { Search, ChevronDown, X, TrendingUp, ArrowUpRight, Info } from "lucide-react";

interface NvidiaStockCardProps {
  ticker?: string;
  onSelectStock?: (ticker: string) => void;
  onAnalyse?: (ticker: string) => void;
  onSwitchToDesk?: () => void;
}

export function NvidiaStockCard({
  ticker = "NVDA",
  onSelectStock,
  onAnalyse,
  onSwitchToDesk
}: NvidiaStockCardProps) {
  // Current active ticker state (derived from props with local override)
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const currentTicker = selectedTicker || ticker;

  const [timeframe, setTimeframe] = useState<string>("1D");
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Modals state
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [showFinancialsModal, setShowFinancialsModal] = useState<boolean>(false);
  const [showEarningsModal, setShowEarningsModal] = useState<boolean>(false);

  // Hover chart tooltip state
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; price: number } | null>(null);

  // Retrieve dynamic stock data
  const stock: StockData = getStockData(currentTicker);

  const handleStockChange = (newTicker: string) => {
    setSelectedTicker(newTicker);
    setIsSearchOpen(false);
    setSearchQuery("");
    setShowMoreMenu(false);
    if (onSelectStock) {
      onSelectStock(newTicker);
    }
  };

  const handleAnalyseClick = () => {
    if (onAnalyse) {
      onAnalyse(stock.ticker);
    } else if (onSwitchToDesk) {
      onSwitchToDesk();
    }
  };

  // Filtered stocks for search autocomplete
  const filteredStocks = Object.values(STOCKS).filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.ticker.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    );
  });

  // Timeframe chart calculation
  const chartData = stock.timeframeCharts[timeframe] || stock.timeframeCharts["1D"] || {
    prevClose: 180,
    minPrice: 170,
    maxPrice: 190,
    yLabels: ["190", "180", "170"],
    xLabels: ["2:00 pm", "8:00 pm"],
    points: [{ time: "9:30 am", price: 175 }, { time: "4:00 pm", price: 178 }]
  };

  const { points, extendedPoints, prevClose, minPrice, maxPrice, yLabels, xLabels } = chartData;

  // Chart coordinate math (SVG viewBox: 350w x 135h, drawing area: 45 to 340 x, 10 to 110 y)
  const chartLeft = 45;
  const chartRight = 338;
  const chartTop = 12;
  const chartBottom = 110;
  const chartWidth = chartRight - chartLeft;
  const chartHeight = chartBottom - chartTop;

  const priceRange = maxPrice - minPrice || 1;
  const getY = (val: number) => {
    const norm = (val - minPrice) / priceRange;
    return chartBottom - norm * chartHeight;
  };

  // Regular session points coordinates
  const totalRegular = points.length;
  // If there are extended hours, regular session occupies 72% of width, extended occupies remaining 28%
  const regularWidth = extendedPoints && extendedPoints.length > 0 ? chartWidth * 0.72 : chartWidth;

  const coords = points.map((pt, i) => {
    const x = chartLeft + (i / Math.max(1, totalRegular - 1)) * regularWidth;
    const y = getY(pt.price);
    return { x, y, ...pt };
  });

  // Build SVG path string for regular session
  const pathD = coords.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, "");

  // Area fill under curve
  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${chartBottom} L ${coords[0].x.toFixed(1)} ${chartBottom} Z`
    : "";

  // Extended hours path coordinates
  let extendedPathD = "";
  const lastRegularCoord = coords[coords.length - 1];

  if (extendedPoints && extendedPoints.length > 0 && lastRegularCoord) {
    const extStart = chartLeft + regularWidth;
    const extWidth = chartRight - extStart;
    const extCoords = extendedPoints.map((pt, i) => {
      const x = extStart + (i / Math.max(1, extendedPoints.length - 1)) * extWidth;
      const y = getY(pt.price);
      return { x, y, ...pt };
    });
    extendedPathD = extCoords.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    }, "");
  }

  // Prev close dotted line Y level
  const prevCloseY = getY(prevClose);

  // Line & accent colors matching screenshot
  const strokeColor = stock.isPositive ? "#66C18C" : "#EA7676";
  const gradId = stock.isPositive ? "greenGradient" : "coralGradient";

  // Popular quick-select chips
  const quickTickers = ["NVDA", "RELIANCE", "TCS", "INFY", "TATAMOTORS", "HDFCBANK", "AAPL", "MSFT"];

  return (
    <div className="dynamic-stock-dashboard-root" style={{ width: "100%", maxWidth: "360px", margin: "0 auto", boxSizing: "border-box" }}>
      {/* 1. TOP QUICK SWITCHER & SEARCH BAR */}
      <div className="stock-selector-ribbon" style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden" }}>
        {/* Search Input Box */}
        <div style={{ position: "relative", width: "125px", flexShrink: 0 }}>
          <div
            onClick={() => setIsSearchOpen(true)}
            className="stock-search-input-pill"
          >
            <Search style={{ width: 12, height: 12, color: "#979CA8", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {stock.ticker} ▾
            </span>
          </div>

          {/* Autocomplete Dropdown Modal / Popover */}
          {isSearchOpen && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "calc(100% + 6px)",
                width: "270px",
                backgroundColor: "#2B2F38",
                border: "1px solid #484E5B",
                borderRadius: "12px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
                zIndex: 60,
                padding: "8px",
                boxSizing: "border-box"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 8px",
                  backgroundColor: "#1F2228",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  border: "1px solid #3E4350"
                }}
              >
                <Search style={{ width: 13, height: 13, color: "#979CA8" }} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type ticker or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    outline: "none",
                    width: "100%"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  style={{ background: "none", border: "none", color: "#979CA8", cursor: "pointer", padding: 0 }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <div style={{ maxHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                {filteredStocks.map((s) => (
                  <div
                    key={s.ticker}
                    onClick={() => handleStockChange(s.ticker)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 8px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "12px",
                      backgroundColor: s.ticker === stock.ticker ? "#3D424F" : "transparent"
                    }}
                    onMouseEnter={(e) => {
                      if (s.ticker !== stock.ticker) e.currentTarget.style.backgroundColor = "#343842";
                    }}
                    onMouseLeave={(e) => {
                      if (s.ticker !== stock.ticker) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px" }}>
                        {s.ticker}
                        <span style={{ fontSize: "10px", color: "#979CA8", fontWeight: 400 }}>{s.exchange}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#979CA8", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.name}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 500, color: "#FFFFFF" }}>
                        {s.currencySymbol}{s.price}
                      </div>
                      <div style={{ fontSize: "10.5px", color: s.isPositive ? "#66C18C" : "#EA7676" }}>
                        {s.priceChange.split(" ")[1] || s.priceChange}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredStocks.length === 0 && (
                  <div style={{ padding: "10px", textAlign: "center", fontSize: "11px", color: "#979CA8" }}>
                    No stock found.
                    <button
                      type="button"
                      onClick={() => handleStockChange(searchQuery.toUpperCase())}
                      style={{
                        marginTop: "8px",
                        display: "block",
                        width: "100%",
                        padding: "6px",
                        backgroundColor: "#3A3F4C",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "11px",
                        cursor: "pointer"
                      }}
                    >
                      Search &amp; Load {searchQuery.toUpperCase()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Ticker Chips Scrollable */}
        <div className="ticker-chips-row no-scrollbar" style={{ flex: 1, minWidth: 0, display: "flex", gap: "4px", overflowX: "auto" }}>
          {quickTickers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleStockChange(t)}
              className={`ticker-chip ${t === stock.ticker ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THE MAIN STOCK CARD (Exact match to reference image) */}
      <div className="nvidia-main-card">
        {/* Card Header: Price, Currency, Daily Change */}
        <div className="nvidia-price-row">
          <span className="nvidia-price-val">
            {stock.price}
          </span>
          <span className="nvidia-price-currency">
            {stock.currency}
          </span>
          <span className={`nvidia-price-change ${stock.isPositive ? "positive" : "negative"}`}>
            <span>{stock.priceChange}</span>
            <span>{stock.isPositive ? "↑ today" : "↓ today"}</span>
          </span>
        </div>

        {/* Sub-header Line 1: Closed timestamp & Disclaimer link */}
        <div className="nvidia-sub-info-row">
          <span>{stock.marketStatus}</span>
          <span style={{ color: "#686D7A" }}>•</span>
          <button
            type="button"
            onClick={() => setShowDisclaimerModal(true)}
            className="nvidia-disclaimer-link"
          >
            Disclaimer
          </button>
        </div>

        {/* Sub-header Line 2: Pre-market or After-hours info */}
        {stock.preMarket && (
          <div className="nvidia-premarket-row">
            <span>{stock.preMarket.label || "Pre-market"}</span>
            <span style={{ color: "#FFFFFF", fontWeight: 500 }}>{stock.preMarket.price}</span>
            <span style={{ color: stock.preMarket.isPositive ? "#66C18C" : "#EA7676", fontWeight: 500 }}>
              {stock.preMarket.change} ({stock.preMarket.percent})
            </span>
          </div>
        )}

        {/* Timeframe Selector Pill Navigation */}
        <div className="nvidia-timeframe-row">
          <div className="nvidia-timeframe-group">
            {["1D", "5D", "1M", "6M", "YTD"].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setTimeframe(tf);
                  setShowMoreMenu(false);
                }}
                className={`nvidia-timeframe-btn ${timeframe === tf ? "active" : ""}`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* "More ▾" Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`nvidia-timeframe-btn ${["1Y", "5Y", "Max"].includes(timeframe) ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: "2px" }}
            >
              <span>{["1Y", "5Y", "Max"].includes(timeframe) ? timeframe : "More"}</span>
              <span style={{ fontSize: "10px", marginLeft: "1px" }}>▾</span>
            </button>

            {showMoreMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 4px)",
                  backgroundColor: "#282B32",
                  border: "1px solid #484E5B",
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                  zIndex: 30,
                  padding: "4px 0",
                  minWidth: "75px"
                }}
              >
                {["1Y", "5Y", "Max"].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => {
                      setTimeframe(tf);
                      setShowMoreMenu(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "5px 12px",
                      fontSize: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: timeframe === tf ? "#FFFFFF" : "#979CA8",
                      fontWeight: timeframe === tf ? 700 : 400
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#343841";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Responsive Interactive Stock Chart */}
        <div className="nvidia-chart-container">
          <svg
            viewBox="0 0 350 135"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              {/* Coral linear gradient fill for negative days */}
              <linearGradient id="coralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EA7676" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#EA7676" stopOpacity="0.0" />
              </linearGradient>

              {/* Mint green linear gradient fill for positive days */}
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#66C18C" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#66C18C" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Left Y-Axis Price Labels */}
            {yLabels.map((yl, idx) => {
              const yPos = chartTop + (idx / Math.max(1, yLabels.length - 1)) * chartHeight;
              return (
                <text
                  key={idx}
                  x="10"
                  y={yPos + 4}
                  fill="#979CA8"
                  fontSize="11"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {yl}
                </text>
              );
            })}

            {/* Prev Close Dotted Horizontal Reference Line */}
            <line
              x1={chartLeft}
              y1={prevCloseY}
              x2={chartRight}
              y2={prevCloseY}
              stroke="#555B68"
              strokeDasharray="2 3"
              strokeWidth="1"
            />

            {/* Prev Close Label on the Right (Stacked 3 lines matching reference) */}
            <text
              x={chartRight}
              y={prevCloseY - 20}
              fill="#979CA8"
              fontSize="9.5"
              textAnchor="end"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              <tspan x={chartRight} dy="0">Prev</tspan>
              <tspan x={chartRight} dy="11">close</tspan>
              <tspan x={chartRight} dy="11">{prevClose}</tspan>
            </text>

            {/* Soft Gradient Area Fill */}
            {areaD && (
              <path
                d={areaD}
                fill={`url(#${gradId})`}
              />
            )}

            {/* Regular Session Price Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Close Marker Dot at Regular Session End */}
            {lastRegularCoord && (
              <g>
                <circle
                  cx={lastRegularCoord.x}
                  cy={lastRegularCoord.y}
                  r="7.5"
                  fill="none"
                  stroke={strokeColor}
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />
                <circle
                  cx={lastRegularCoord.x}
                  cy={lastRegularCoord.y}
                  r="4"
                  fill={strokeColor}
                />
              </g>
            )}

            {/* Extended Hours Pre-market / After-hours Grey Line */}
            {extendedPathD && (
              <path
                d={extendedPathD}
                fill="none"
                stroke="#9AA0AD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Invisible Hover Rects for Cursor Interactivity */}
            {coords.map((pt, i) => (
              <rect
                key={i}
                x={pt.x - 10}
                y={chartTop}
                width="20"
                height={chartHeight + 10}
                fill="transparent"
                style={{ cursor: "crosshair" }}
                onMouseEnter={() => setHoveredPoint({ time: pt.time, price: pt.price })}
              />
            ))}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <div
              style={{
                position: "absolute",
                pointerEvents: "none",
                backgroundColor: "#202229",
                border: "1px solid #484E5B",
                color: "#FFFFFF",
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                top: "10px",
                left: "40%",
                transform: "translateX(-50%)"
              }}
            >
              <span style={{ color: "#979CA8", marginRight: "6px" }}>{hoveredPoint.time}:</span>
              <span style={{ fontWeight: 600 }}>{stock.currencySymbol}{hoveredPoint.price.toFixed(2)}</span>
            </div>
          )}

          {/* Bottom X-Axis Timestamps */}
          <div className="nvidia-chart-xaxis">
            {xLabels.map((xl, i) => (
              <span key={i}>{xl}</span>
            ))}
          </div>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="nvidia-card-divider" />

        {/* Two-Column Stock Statistics Grid (Exact 4x2 layout from reference) */}
        <div className="nvidia-stats-grid">
          {/* Row 1 */}
          <div className="nvidia-stat-row">
            <span className="nvidia-stat-label">Open</span>
            <span className="nvidia-stat-val">{stock.stats.open}</span>
          </div>
          <div className="nvidia-stat-row">
            <span className="nvidia-stat-label">Mkt cap</span>
            <span className="nvidia-stat-val">{stock.stats.marketCap}</span>
          </div>

          {/* Row 2 */}
          <div className="nvidia-stat-row">
            <span className="nvidia-stat-label">High</span>
            <span className="nvidia-stat-val">{stock.stats.high}</span>
          </div>
          <div className="nvidia-stat-row">
            <span className="nvidia-stat-label">P/E ratio</span>
            <span className="nvidia-stat-val">{stock.stats.peRatio}</span>
          </div>

          {/* Row 3 */}
          <div className="nvidia-stat-row">
            <span className="nvidia-stat-label">Low</span>
            <span className="nvidia-stat-val">{stock.stats.low}</span>
          </div>
          <div className="nvidia-stat-row">
            <span className="nvidia-stat-label">Dividend</span>
            <span className="nvidia-stat-val">{stock.stats.dividend}</span>
          </div>

          {/* Row 4 */}
          <div className="nvidia-stat-row">
            <span className="nvidia-stat-label">52-wk range</span>
            <span className="nvidia-stat-val">{stock.stats.range52W}</span>
          </div>
          <div className="nvidia-stat-row">
            <span className="nvidia-stat-label">Qtrly div amt</span>
            <span className="nvidia-stat-val">{stock.stats.qtrlyDivAmt}</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM TWO SUB-CARDS (Quarterly Financials & Earnings) */}
      <div className="nvidia-subcards-row">
        {/* Card A: Quarterly Financials */}
        <div
          onClick={() => setShowFinancialsModal(true)}
          className="nvidia-sub-card"
        >
          <div className="nvidia-subcard-header">
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Quarterly financ...
            </span>
            <ChevronDown style={{ width: 14, height: 14, color: "#979CA8", flexShrink: 0, marginLeft: 4 }} />
          </div>

          <div className="nvidia-subcard-body">
            <div className="nvidia-subcard-mainval">
              {stock.quarterlyFinancials.value}
            </div>
            <div className={`nvidia-subcard-subval ${stock.quarterlyFinancials.isPositive ? "positive" : "negative"}`}>
              {stock.quarterlyFinancials.yoyGrowth}
            </div>
            <div className="nvidia-subcard-label">
              {stock.quarterlyFinancials.period}
            </div>
          </div>
        </div>

        {/* Card B: Earnings */}
        <div
          onClick={() => setShowEarningsModal(true)}
          className="nvidia-sub-card"
        >
          <div className="nvidia-subcard-header">
            <span>Earnings</span>
            <ChevronDown style={{ width: 14, height: 14, color: "#979CA8", flexShrink: 0 }} />
          </div>

          <div className="nvidia-subcard-body" style={{ marginTop: "16px" }}>
            <div
              className="nvidia-subcard-mainval"
              style={{ color: stock.earnings.isBeat ? "#66C18C" : "#EA7676", fontSize: "14.5px" }}
            >
              {stock.earnings.beatPercent}
            </div>
            <div className="nvidia-subcard-label" style={{ color: "#D5D9E2", fontWeight: 500, fontSize: "12px" }}>
              {stock.earnings.label}
            </div>
          </div>
        </div>
      </div>

      {/* 4. DYNAMIC ACTION BUTTON: "Analyse [Selected Company Name] >" */}
      <button
        type="button"
        onClick={handleAnalyseClick}
        className="nvidia-analyse-btn"
      >
        <span>Analyse {stock.name}</span>
        <span style={{ fontSize: "15px", fontWeight: "normal", marginLeft: "2px" }}>&gt;</span>
      </button>

      {/* 5. INTERACTIVE POP-UP MODALS */}
      {/* A. Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowDisclaimerModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #3D424F" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Info style={{ width: 16, height: 16, color: "#979CA8" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Market Data Disclaimer</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDisclaimerModal(false)}
                style={{ background: "none", border: "none", color: "#979CA8", cursor: "pointer" }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div style={{ fontSize: "12px", color: "#CBD3DF", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto", lineHeight: 1.5 }}>
              <p style={{ margin: 0 }}>
                Market data is provided for institutional equity research and demonstration purposes. Quotes are delayed by up to 15 minutes as per exchange terms.
              </p>
              <p style={{ margin: 0 }}>
                FinIntel provides automated fundamental analytics, multi-agent AI syntheses, and technical indicators. Nothing contained herein constitutes investment advice or an offer to buy/sell securities.
              </p>
              <p style={{ margin: 0, color: "#979CA8" }}>
                Exchange Sources: NASDAQ OMX, National Stock Exchange of India (NSE), Bombay Stock Exchange (BSE).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDisclaimerModal(false)}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "8px",
                backgroundColor: "#3D424F",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* B. Quarterly Financials Breakdown Modal */}
      {showFinancialsModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowFinancialsModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #3D424F" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp style={{ width: 16, height: 16, color: "#66C18C" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>{stock.name} — Financial Breakdown</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFinancialsModal(false)}
                style={{ background: "none", border: "none", color: "#979CA8", cursor: "pointer" }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Reporting Period</span>
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>{stock.quarterlyFinancials.period}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Quarterly Revenue</span>
                <span style={{ color: "#FFFFFF", fontWeight: 700 }}>{stock.quarterlyFinancials.breakdown?.revenue || stock.quarterlyFinancials.value}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Year-over-Year Growth</span>
                <span style={{ color: "#66C18C", fontWeight: 600 }}>{stock.quarterlyFinancials.yoyGrowth}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Net Income</span>
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>{stock.quarterlyFinancials.breakdown?.netIncome || "Disclosed in SEC/SEBI Filing"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Operating Margin</span>
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>{stock.quarterlyFinancials.breakdown?.operatingMargin || "Resilient"}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFinancialsModal(false);
                handleAnalyseClick();
              }}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                backgroundColor: "#2B2E3A",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <span>Deep Financial Analysis in Desk</span>
              <ArrowUpRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      )}

      {/* C. Earnings Surprise Modal */}
      {showEarningsModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowEarningsModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #3D424F" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp style={{ width: 16, height: 16, color: "#66C18C" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>{stock.name} — Earnings Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEarningsModal(false)}
                style={{ background: "none", border: "none", color: "#979CA8", cursor: "pointer" }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Fiscal Period</span>
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>{stock.earnings.fiscalPeriod || "Latest Quarter"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Surprise / Delta</span>
                <span style={{ fontWeight: 700, color: stock.earnings.isBeat ? "#66C18C" : "#EA7676" }}>
                  {stock.earnings.beatPercent} ({stock.earnings.label})
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Actual Reported EPS</span>
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>{stock.earnings.actualEps || "Reflected in 10-Q / Q2 Report"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#979CA8" }}>Consensus Estimate</span>
                <span style={{ color: "#FFFFFF", fontWeight: 500 }}>{stock.earnings.estimatedEps || "Wall Street Consensus"}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowEarningsModal(false);
                handleAnalyseClick();
              }}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                backgroundColor: "#2B2E3A",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <span>Open Institutional Desk</span>
              <ArrowUpRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
