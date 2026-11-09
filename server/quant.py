"""
Deterministic quantitative computations for FinIntel.
ALL mathematical metrics (RSI, Sharpe, Beta, Drawdowns, XIRR) are calculated here in Python.
The LLM is strictly prohibited from doing arithmetic.
"""
import math
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
import pandas as pd


def compute_rsi(prices: List[float], period: int = 14) -> float:
    """Calculate Relative Strength Index (RSI)."""
    if len(prices) < period + 1:
        return 50.0  # Neutral fallback

    deltas = np.diff(prices)
    gains = np.where(deltas > 0, deltas, 0.0)
    losses = np.where(deltas < 0, -deltas, 0.0)

    avg_gain = np.mean(gains[:period])
    avg_loss = np.mean(losses[:period])

    for i in range(period, len(deltas)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period

    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    rsi = 100.0 - (100.0 / (1.0 + rs))
    return round(float(rsi), 2)


def compute_volatility(daily_returns: List[float]) -> float:
    """Annualized volatility (standard deviation * sqrt(252))."""
    if len(daily_returns) < 5:
        return 0.18
    std = float(np.std(daily_returns, ddof=1))
    annualized = std * math.sqrt(252)
    return round(annualized, 4)


def compute_sharpe(daily_returns: List[float], risk_free_rate: float = 0.07) -> float:
    """Annualized Sharpe ratio using 7% Indian 10Y G-Sec benchmark."""
    if len(daily_returns) < 10:
        return 1.0
    mean_ret = float(np.mean(daily_returns)) * 252
    vol = compute_volatility(daily_returns)
    if vol == 0:
        return 0.0
    sharpe = (mean_ret - risk_free_rate) / vol
    return round(sharpe, 2)


def compute_beta(stock_returns: List[float], benchmark_returns: List[float]) -> float:
    """Beta relative to NIFTY 50 benchmark."""
    min_len = min(len(stock_returns), len(benchmark_returns))
    if min_len < 20:
        return 1.0
    s_ret = np.array(stock_returns[:min_len])
    b_ret = np.array(benchmark_returns[:min_len])

    cov = np.cov(s_ret, b_ret)[0, 1]
    var_b = np.var(b_ret, ddof=1)
    if var_b == 0:
        return 1.0
    beta = cov / var_b
    return round(float(beta), 2)


def compute_max_drawdown(prices: List[float]) -> Tuple[float, int]:
    """Maximum peak-to-trough drawdown (%) and duration."""
    if len(prices) < 2:
        return 0.0, 0
    cum_max = np.maximum.accumulate(prices)
    drawdowns = (np.array(prices) - cum_max) / cum_max
    max_dd = float(np.min(drawdowns)) * 100.0
    return round(abs(max_dd), 2), int(np.argmin(drawdowns))


def compute_cagr(start_val: float, end_val: float, years: float) -> float:
    """Compound Annual Growth Rate."""
    if start_val <= 0 or end_val <= 0 or years <= 0:
        return 0.0
    cagr = (pow(end_val / start_val, 1.0 / years) - 1.0) * 100.0
    return round(cagr, 2)


def compute_xirr(cash_flows: List[Tuple[float, float]], guess: float = 0.1) -> float:
    """
    Compute Extended Internal Rate of Return (XIRR).
    cash_flows is a list of tuples: (days_from_start, cash_amount)
    Negative cash_amount for investments, positive for final balance.
    """
    if len(cash_flows) < 2:
        return 0.0

    rate = guess
    for _ in range(50):
        f_val = 0.0
        f_prime = 0.0
        for days, cf in cash_flows:
            years = days / 365.0
            discount = pow(1.0 + rate, years)
            if discount == 0:
                continue
            f_val += cf / discount
            f_prime += (-years * cf) / (discount * (1.0 + rate))

        if abs(f_prime) < 1e-9:
            break
        new_rate = rate - (f_val / f_prime)
        if abs(new_rate - rate) < 1e-6:
            return round(new_rate * 100.0, 2)
        rate = new_rate

    return round(rate * 100.0, 2)
