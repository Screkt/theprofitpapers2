"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarketData() {
return (
  <div className="flex min-h-screen bg-gray-100 py-4 px-4">
    <aside className="bg-white flex flex-col shrink-0 p-4 mr-4">
        <div className="w-full bg-white">
          <div className="w-full">
            <h1 className="text-gray-800 text-2xl mb-2 text-center">
              Market Data
            </h1>
          </div>
          <nav className="text-left w-full">
            <Link
              href="/markets/market-data"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Key Market Data
            </Link>
            <Link
              href="/markets/market-data/bond-markets"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Bond Markets
            </Link>
            <Link
              href="/markets/market-data/commodities"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Commodities
            </Link>
            <Link
              href="/markets/market-data/currencies"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Currencies
            </Link>
            <Link
              href="/markets/market-data/crypto"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Crypto
            </Link>
            <Link
              href="/markets/market-data/dividend-income"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Dividends & Income
            </Link>
            <Link
              href="/markets/market-data/dividend-aristocrats"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Dividend Aristocrats
            </Link>
            <Link
              href="/markets/market-data/dividend-growth-leaders"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Dividend Growth Leaders
            </Link>
            <Link
              href="/markets/market-data/real-estate"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Real Estate
            </Link>
            <Link
              href="/markets/market-data/emerging-markets"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Emerging Markets
            </Link>
            <Link
              href="/markets/market-data/meme-stocks"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Meme Stocks
            </Link>
            <Link
              href="/markets/market-data/factor-smart-beta"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Factor & Smart Beta
            </Link>
            <Link
              href="/markets/market-data/thematic-investing"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Thematic Investing
            </Link>
            <Link
              href="/markets/market-data/global-regional-markets"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Global & Regional Markets
            </Link>
            <Link
              href="/markets/market-data/fixed-income"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Fixed Income Yield Curve
            </Link>
            <Link
              href="/markets/market-data/commodities-futures"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Commodities Futures
            </Link>
            <Link
              href="/markets/market-data/volatility-risk"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Volatility & Risk Metrics
            </Link>
            <Link
              href="/markets/market-data/earnings-fundamentals"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Earnings & Fundamentals
            </Link>
            <Link
              href="/markets/market-data/etf-volume-flow"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              ETF Flows & Volume Data
            </Link>
            <Link
              href="/markets/market-data/ipo-spac"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              IPO & SPAC Acitivty
            </Link>
            <Link
              href="/markets/market-data/insider-institutional"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Insider & Institutional Activity
            </Link>
            <Link
              href="/markets/market-data/interest-rate-monetary-policy"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Interest Rates & Monetary Policy
            </Link>
            <Link
              href="/markets/market-data/inflation-macro-indicators"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Inflation & Macro Indicators
            </Link>
            <Link
              href="/markets/market-data/housing-construction"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Housing & Construction
            </Link>
            <Link
              href="/markets/market-data/commodities-region"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Commodities By Region
            </Link>
            <Link
              href="/markets/market-data/alternative-assets"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Alternative Assets
            </Link>
            <Link
              href="/markets/market-data/esg-sustainable-investing"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              ESG & Sustainable Investing
            </Link>
            <Link
              href="/markets/market-data/market-technicals"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Market Breadth & Technicals
            </Link>
            <Link
              href="/markets/market-data/interest-rate-sensitivity"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Interest Rate Sensitivity
            </Link>
            <Link
              href="/markets/market-data/commodity-producers-related-equities"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Commodity Producers & Related Equities
            </Link>
            <Link
              href="/markets/market-data/regional-bond-markets"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Regional Bond Markets
            </Link>
            <Link
              href="/markets/market-data/cross-asset-correlations"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Cross-Asset Correlations
            </Link>
            <Link
              href="/markets/market-data/global-etf-universe"
              className="w-full block py-2 mr-4 text-sm text-black border-t border-gray-400 border-full text-left hover:underline"
            >
              Global ETF Universe
            </Link>
          </nav>
        </div>
      </aside>
      <main>
        <div className="bg-white p-4">
          <h3 className="text-black text-2xl font-serif">
            Top 30 ETFs by AUM
          </h3>
          <div>
          </div>
        </div>
        <div className="bg-white p-4 mt-4">
          <h3 className="text-black text-2xl font-serif">
            Top Performing ETFs
          </h3>
          <div>
          </div>
        </div>
        <div className="bg-white p-4 mt-4">
          <h3 className="text-black text-2xl font-serif">
            Most Traded ETFs
          </h3>
          <div>
          </div>
        </div>
        <div className="bg-white p-4 mt-4">
          <h3 className="text-black text-2xl font-serif">
            New ETF Launches
          </h3>
          <div>
          </div>
        </div>
        <div className="bg-white p-4 mt-4">
          <h3 className="text-black text-2xl font-serif">
            ETF Categories By Sector/Region
          </h3>
          <div>
          </div>
        </div>
      </main>
</div>
)
}