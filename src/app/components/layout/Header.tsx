"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    const [showMarketsDropDown, setShowMarketsDropDown] = useState(false);
    return (
        <header className="w-full h-18 md:h-35 border-b bg-white border-gray-400 flex flex-col justify-end font-serif">
            <nav className="w-full flex justify-center border-gray-200 md:px-0">
                <ul className="flex space-x-0 md:space-x-0">
                    <li className="relative group"  // NEWS
                    >
                        <Link 
                        href="/news" 
                        className="text-gray-800 px-8 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            News
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-0 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/news/latest-news" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Latest News
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/news/earnings-news" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Earnings News
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/news/ma-news" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        M&A News
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/news/economic-data" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Economic Data
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/news/fed-policy" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Fed & Policy
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/news/legislation" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Legislation
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // MARKETS
                    >
                        <Link 
                        href="/markets" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Markets
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/markets/market-indexes" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Market Indexes
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/markets/global-markets" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Global Markets
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/markets/market-valuations" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Market Valuations
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/markets/sectors" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Sectors
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/markets/commodities" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Commodities
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/markets/currencies" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Currencies
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/markets/market-news" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Market News
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // Stocks
                    >
                        <Link 
                        href="/stocks" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Stocks
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/stocks/stock-screener" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Stock Screener
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/stocks/stock-analysis" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Stock Analysis
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/stocks/earnings-calender" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Earnings Calender
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/stocks/earnings-reports" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Earnings Reports
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/stocks/ipo-calender" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        IPO Calender
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/stocks/dividend-stocks" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Dividend Stocks
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/stocks/growth-stocks" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Growth Stocks
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/stocks/value-stocks" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Value Stocks
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  //Portfolios
                    >
                        <Link 
                        href="/portfolios" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Portfolios
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/portfolios/hot-picks" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Hot-Picks
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/portfolios/model-portfolios" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Model Portfolios
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/portfolios/weekly-trades" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Weekly Trades
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/portfolios/watchlists" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Watchlists
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // Rankings & Lists
                    >
                        <Link 
                        href="/rankings-lists" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Rankings & Lists
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/rankings-lists/top-gainers" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Top Gainers
                                    </Link>
                                </div>
                                 <div>
                                    <Link href="/rankings-lists/top-losers" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Top Losers
                                    </Link>
                                </div>
                                 <div>
                                    <Link href="/rankings-lists/most-active-stocks" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Most Active Stocks
                                    </Link>
                                </div>
                                 <div>
                                    <Link href="/rankings-lists/best-fundamentals" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Best Fundamentals
                                    </Link>
                                </div>
                                 <div>
                                    <Link href="/rankings-lists/52-week" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        52-Week Highs/Lows
                                    </Link>
                                </div>
                                 <div>
                                    <Link href="/rankings-lists/overvalued-undervalued" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Overvalued & Undervalued
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // Analysis & Ideas
                    >
                        <Link 
                        href="/analysis-ideas" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Analysis & Ideas
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/analysis-ideas/market-outlook" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Market Outlook
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/analysis-ideas/industry-reports" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Industry Reports
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/analysis-ideas/investment-strategies" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Investment Strategies
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/analysis-ideas/technical-analysis" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Technical Analysis
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/analysis-ideas/fundamental-analysis" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Fundamental Analysis
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // Insider Trading
                    >
                        <Link 
                        href="/insider-trading" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Insider Trading
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/insider-trading/recent-insider-buys" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Recent Insider Buys
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/insider-trading/recent-insider-sells" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Recent Insider Sells
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/insider-trading/insider-trading-news" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Insider Trading News
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/insider-trading/top-insider-traders" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Top Insider Traders
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // Hedge Funds
                    >
                        <Link 
                        href="/hedge-funds" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Hedge Funds
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/hedge-funds/top-hedge-funds" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Top Hedge Funds
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/hedge-funds/hedge-fund-holdings" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Hedge Fund Holdings
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/hedge-funds/institutional-ownership" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Institutional Ownerships
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/hedge-funds/13f-filings" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        13F Filings
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // Tools
                    >
                        <Link 
                        href="/tools" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Tools
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/tools/portfolio-tracker" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Portfolio Tracker
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/tools/dcf-calculator" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        DCF Calculator
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/tools/dividend-calculator" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Dividend Calculator
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/tools/retirement-calculator" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Retirement Calculator
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/tools/market-cap-calculator" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Market Cap Calculator
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/tools/currency-converter" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Currency Converter
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/tools/compound-interest-calculator" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Compound Interest Calculator
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/tools/stock-comparison-tool" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Stock Comparison Tool
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  //Education
                    >
                        <Link 
                        href="/education" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Education
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/education/investing-basics" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Investing Basics
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/education/valuation-methods" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Valuation Methods
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/education/financial-ratios" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Financial Ratios
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/education/investment-strategies" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Investment-strategies
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/education/reading-financial-statements" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Reading Financial Statements
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/education/glossary" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Glossary
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // Personal Finance
                    >
                        <Link 
                        href="/personal-finance" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            Personal Finance
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/personal-finance/credit-cards" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Credit Cards
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/personal-finance/loans-mortgages" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Loans & Mortgages
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/personal-finance/savings-banking" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Savings & Banking
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/personal-finance/retirement-planning" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Retirement Planning
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/personal-finance/tax-planning" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Tax Planning
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/personal-finance/budgeting" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Budgeting
                                    </Link>
                                </div>
                            </div>
                    </li>
                    <li className="relative group"  // About
                    >
                        <Link 
                        href="/about" 
                        className="text-gray-800 px-3 py-2 border-transparent border-l border-r border-t group-hover:border-gray-400 group-hover:bg-stone-100 rounded-t text-[13px] md:text-[13px]"
                        >
                            About
                        </Link>
                            <div className="hidden group-hover:grid absolute top-[calc(100%+1px)] right-0 min-w-max rounded-b md:grid-cols-2 grid-cols-1 gap-4 md:gap-1 p-3 md:p-1 border border-gray-400 bg-stone-100 border-t-0">
                                <div>
                                    <Link href="/about/about-us" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        About Us
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/about/contact" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Contact
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/about/advertise" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Advertise
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/about/disclaimer" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Disclaimer
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/about/privacy-policy" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Privacy Policy
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/about/terms-of-service" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Terms Of Service
                                    </Link>
                                </div>
                            </div>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header