import react from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Alice } from 'next/font/google';

const alice = Alice({
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
    variable: '--font-alice',
});

const Footer: React.FC = () => {
    return (
        <footer className={`${alice.variable} w-screen h-180 bg-gray-400 text-sm text-black border-t border-black border-b-2 bottom-0 py-3 font-serif`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="flex items-center gap-3 shrink-0 pb-2">
                        <Image
                            src="/sitelogo.png"
                            alt="The Profit Papers Logo"
                            width={64}
                            height={64}
                            className="shrink-0"
                            priority
                        />
                        <Link href="/" className="no-underline hover:no-underline">
                            <div className="text-[30px] md:text-[30px] font-normal leading-tight tracking-wide">
                                The Profit Papers
                            </div>
                        </Link>
                    </div>
                    <div className="mt-4 md:mt-0 w-full md:w-80 shrink-0">
                        <p className="text-[16px] font-semibold mb-1 text-black">
                        Get the Weekly Profit Report
                        </p>
                        <div className="flex gap-1">
                            <input
                                type="email"
                                placeholder="Your email adress"
                                className="w-full p-2 border border-black rounded text-sm text-black bg-gray-100"
                                aria-label="Email subscription input"
                            />
                            <button
                                type="submit"
                                className="p-2 black text-gray-700 font-semibold border rounded bg-gray-200 hover:bg-gray-300 transition-colors duration-200 shrink-0 cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-6 md:gap-2 lg:gap-2 border-t border-b border-gray-700 pb-2">
                    <div className="px-2">
                        <Link href="/news">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                News
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/news/latest-news" className="hover:underline">Latest News</Link>
                            </li>
                            <li>
                                <Link href="/news/earnings-news" className="hover:underline">Earnings News</Link>
                            </li>
                            <li>
                                <Link href="/news/economic-data" className="hover:underline">Economic Data</Link>
                            </li>
                            <li>
                                <Link href="/news/fed-policy" className="hover:underline">Fed Policy</Link>
                            </li>
                            <li>
                                <Link href="/news/legislation" className="hover:underline">Legislation</Link>
                            </li>
                            <li>
                                <Link href="/news/ma-news" className="hover:underline">M&A News</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/markets">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Markets
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/markets/market-indexes" className="hover:underline">Market Indexes</Link>
                            </li>
                             <li>
                                <Link href="/markets/global-markets" className="hover:underline">Global Markets</Link>
                            </li>
                             <li>
                                <Link href="/markets/market-valuations" className="hover:underline">Market Valuations</Link>
                            </li>
                            <li>
                                <Link href="/markets/market-data" className="hover:underline">Market Data</Link>
                            </li>
                             <li>
                                <Link href="/markets/sectors" className="hover:underline">Sectors</Link>
                            </li>
                             <li>
                                <Link href="/markets/commodities" className="hover:underline">Commodities</Link>
                            </li>
                             <li>
                                <Link href="/markets/currencies" className="hover:underline">Currencies</Link>
                            </li>
                             <li>
                                <Link href="/markets/market-news" className="hover:underline">Market News</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/stocks">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Stocks
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                             <li>
                                <Link href="/stocks/stock-screener" className="hover:underline">Stock Screener</Link>
                            </li>
                             <li>
                                <Link href="/stocks/stock-analysis" className="hover:underline">Stock Analysis</Link>
                            </li>
                             <li>
                                <Link href="/stocks/earings-calender" className="hover:underline">Earnings-Calender</Link>
                            </li>
                             <li>
                                <Link href="/stocks/earnings-reports" className="hover:underline">Earnings Reports</Link>
                            </li>
                                <li>
                                <Link href="/stocks/ipo-calender" className="hover:underline">IPO Calender</Link>
                            </li>
                                <li>
                                <Link href="/stocks/dividend-stocks" className="hover:underline">Dividend Stocks</Link>
                            </li>
                                <li>
                                <Link href="/stocks/growth-stocks" className="hover:underline">Growth Stocks</Link>
                            </li>
                                <li>
                                <Link href="/stocks/value-stocks" className="hover:underline">Value Stocks</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/portfolios">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Portfolios
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/portfolio/hot-picks" className="hover:underline">Hot Picks</Link>
                            </li>
                            <li>
                                <Link href="/portfolio/model-portfolios" className="hover:underline">Model Portfolios</Link>
                            </li>
                            <li>
                                <Link href="/portfolio/weekly-trades" className="hover:underline">Weekly Trades</Link>
                            </li>
                            <li>
                                <Link href="/portfolio/watchlists" className="hover:underline">Watchlists</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/rankings-lists">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Rankings & Lists
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/rankings-lists/top-gainers" className="hover:underline">Top Gainers</Link>
                            </li>
                            <li>
                                <Link href="/rankings-lists/top-losers" className="hover:underline">Top Losers</Link>
                            </li>
                            <li>
                                <Link href="/rankings-lists/most-active-stocks" className="hover:underline">Most Active Stocks</Link>
                            </li>
                            <li>
                                <Link href="/rankings-lists/best-fundamentals" className="hover:underline">Best Fundamentals</Link>
                            </li>
                            <li>
                                <Link href="/rankings-lists/52-week" className="hover:underline">52 Week High/Lows</Link>
                            </li>
                            <li>
                                <Link href="/rankings-lists/overvalued-undervalued" className="hover:underline">Overvalued & Undervalued</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/analysis-ideas">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Analysis & Ideas
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/analysis-ideas/market-outlook" className="hover:underline">Market Outlook</Link>
                            </li>
                            <li>
                                <Link href="/analysis-ideas/industry-reports" className="hover:underline">Industry Reports</Link>
                            </li>
                            <li>
                                <Link href="/analysis-ideas/investment-strategies" className="hover:underline">Investment Strategies</Link>
                            </li>
                            <li>
                                <Link href="/analysis-ideas/technical-analysis" className="hover:underline">Technical Analysis</Link>
                            </li>
                            <li>
                                <Link href="/analysis-ideas/fundamental-analysis" className="hover:underline">Fundamental Analysis</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/insider-trading">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Insider Trading
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/insider-trading/recent-insider-buys" className="hover:underline">Recent Insider Buys</Link>
                            </li>
                            <li>
                                <Link href="/insider-trading/recent-insider-sells" className="hover:underline">Recent Insider Sells</Link>
                            </li>
                            <li>
                                <Link href="/insider-trading/insider-trading-news" className="hover:underline">Insider Trading News</Link>
                            </li>
                            <li>
                                <Link href="/insider-trading/top-insider-trades" className="hover:underline">Top Insider Trades</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/hedge-funds">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Hedge Funds
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/hedge-funds/top-hedge-funds" className="hover:underline">Top Hedge Funds</Link>
                            </li>
                            <li>
                                <Link href="/hedge-funds/hedge-fund-holdings" className="hover:underline">Hedge Fund Holdings</Link>
                            </li>
                            <li>
                                <Link href="/hedge-funds/institutional-ownership" className="hover:underline">Institutional Ownership</Link>
                            </li>
                            <li>
                                <Link href="/hedge-funds/13f-filings" className="hover:underline">13F Filings</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/tools">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Tools
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/tools/portfolio-tracker" className="hover:underline">Portfolio Tracker</Link>
                            </li>
                            <li>
                                <Link href="/tools/dcf-calculator" className="hover:underline">DCF Calculator</Link>
                            </li>
                            <li>
                                <Link href="/tools/dividend-calculator" className="hover:underline">Dividend Calculator</Link>
                            </li>
                            <li>
                                <Link href="/tools/retirement-calculator" className="hover:underline">Retirement Calculator</Link>
                            </li>
                            <li>
                                <Link href="/tools/market-cap-calculator" className="hover:underline">Market Cap Calculator</Link>
                            </li>
                            <li>
                                <Link href="/tools/currency-converter" className="hover:underline">Currency Converter</Link>
                            </li>
                            <li>
                                <Link href="/tools/compound-interest-calculator" className="hover:underline">Compound Interest Calculator</Link>
                            </li>
                            <li>
                                <Link href="/tools/stock-comparison-tool" className="hover:underline">Stock Comparison Tool</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/education">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Education
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/education/investing-basics" className="hover:underline">Investing Basics</Link>
                            </li>
                            <li>
                                <Link href="/education/valuation-methods" className="hover:underline">Valuation Methods</Link>
                            </li>
                            <li>
                                <Link href="/education/financial-ratios" className="hover:underline">Financial Ratios</Link>
                            </li>
                            <li>
                                <Link href="/education/investment-strategies" className="hover:underline">Investment Strategies</Link>
                            </li>
                            <li>
                                <Link href="/education/reading-financial-statements" className="hover:underline">Reading Financial Statements</Link>
                            </li>
                            <li>
                                <Link href="/education/glossary" className="hover:underline">Glossary</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/personal-finance">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                Personal Finance
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/personal-finance/credit-cards" className="hover:underline">Credit Cards</Link>
                            </li>
                            <li>
                                <Link href="/personal-finance/loans-mortgages" className="hover:underline">Loans & Mortgages</Link>
                            </li>
                            <li>
                                <Link href="/personal-finance/savings-banking" className="hover:underline">Savings & Banking</Link>
                            </li>
                            <li>
                                <Link href="/personal-finance/retirement-planning" className="hover:underline">Retirement Planning</Link>
                            </li>
                            <li>
                                <Link href="/personal-finance/tax-planning" className="hover:underline">Tax Planning</Link>
                            </li>
                            <li>
                                <Link href="/personal-finance/budgeting" className="hover:underline">Budgeting</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Link href="/about">
                            <h4 className="text-[16px] font-semibold hover:underline pt-2 pb-2">
                                About
                            </h4>
                        </Link>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about/about-us" className="hover:underline">About Us</Link>
                            </li>
                            <li>
                                <Link href="/about/contact" className="hover:underline">Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex justify-between items-center mx-auto px-2 pt-6 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 shrink-0">
                        <Link href="/about/advertise" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Advertise
                        </Link>
                        <Link href="/about/disclaimer" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Disclaimer
                        </Link>
                        <Link href="/about/privacy-policy" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Privacy Policy
                        </Link>
                        <Link href="/about/terms-of-service" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Terms of Service
                        </Link>
                        <Link href="/about/cookie-policy" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Cookie Policy
                        </Link>
                        <Link href="/sitemap" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Sitemap
                        </Link>
                        <Link href="/rss-feeds" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            RSS Feeds
                        </Link>
                    </div> 
                    <div className="flex items-center gap-3 shirnk-0 border-l border-r px-6">
                        <Link href="/careers" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Careers
                        </Link>
                        <Link href="/data-sources" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Data Sources
                        </Link>
                        <Link href="/help" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            Help
                        </Link>
                        <Link href="/account" className="text-[14px] font-semibold hover:underline pt-2 pb-2">
                            My Account
                        </Link>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-black text-center">
                            Copyright 2025
                        </p>
                        <p className="text-[10px] font-semibold text-black text-center">
                            The Profit Papers
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer