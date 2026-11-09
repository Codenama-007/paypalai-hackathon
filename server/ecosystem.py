"""
Ecosystem Engine: Corporate ecosystem mapping (competitors, customers, suppliers) with live peer pricing.
"""
from typing import Dict, Any, List
from market import get_market_quote


ECOSYSTEM_MAPS = {
    "TATAMOTORS": {
        "suppliers": ["Minda Corp", "Bosch India", "Bharat Forge", "Sona BLW", "Tata AutoComp"],
        "customers": ["Fleet Operators", "Government Transport", "Retail Passenger EV Buyers", "Global Luxury Segment"],
        "partners": ["Tata Power (EV Charging)", "Tata Technologies", "NVIDIA (Autonomous)"],
        "competitors": ["MARUTI", "M&M", "BAJAJ-AUTO", "EICHERMOT"]
    },
    "RELIANCE": {
        "suppliers": ["Larsen & Toubro", "TechnipFMC", "Samsung Electronics (5G gear)", "Saudi Aramco"],
        "customers": ["450M+ Telecom Subscribers (Jio)", "Reliance Retail Walk-in Footfalls", "Domestic O2C Offtakers"],
        "partners": ["Google (Android/Cloud)", "Meta (WhatsApp Commerce)", "bp (Fuel Retail)"],
        "competitors": ["TCS", "ONGC", "BHARTIARTL", "IOC"]
    },
    "TCS": {
        "suppliers": ["Microsoft", "AWS", "Google Cloud", "Dell Technologies", "Cisco Systems"],
        "customers": ["Top Global Banks (Citi, HSBC)", "Healthcare Networks", "Retail Giants", "Airlines"],
        "partners": ["NVIDIA AI Enterprise", "Salesforce", "SAP"],
        "competitors": ["INFY", "WIPRO", "HCLTECH", "TECHM"]
    }
}


def get_ecosystem_map(ticker: str) -> Dict[str, Any]:
    ticker_clean = ticker.upper()
    quote = get_market_quote(ticker_clean)
    mapping = ECOSYSTEM_MAPS.get(ticker_clean, {
        "suppliers": ["Major Domestic Suppliers", "Raw Material Vendors"],
        "customers": ["Enterprise Clients", "Domestic Consumers"],
        "partners": ["Technology Providers", "Distribution Networks"],
        "competitors": quote.get("competitors", ["INFY", "TCS"])
    })

    competitor_quotes = [get_market_quote(c) for c in mapping.get("competitors", [])]

    return {
        "ticker": ticker_clean,
        "company_name": quote["name"],
        "suppliers": mapping["suppliers"],
        "customers": mapping["customers"],
        "partners": mapping["partners"],
        "competitors_live": competitor_quotes
    }
