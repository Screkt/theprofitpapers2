"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Alice } from 'next/font/google';
import { useSession, signIn, signOut } from 'next-auth/react';

const alice = Alice({
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
    variable: '--font-alice',
});

const Header: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();    
    const [searchQuery, setSearchQuery] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved).slice(-5));
        }
    }, []);

    const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const updated = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowDropdown(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');

    };

    const handleInputFocus = () => setShowDropdown(true);
    const handleInputBlur = () => {
        setTimeout(() => setShowDropdown(false), 50);
    };
    
    const popularTickers = [
        { symbol: 'AAPL', price: '$230.45', change: '+1.2%' },
    ];

    const handleGoogleSignIn = () => {
        signIn('google', {
            callbackUrl: '/',
            redirect: false
        })
        .then((result) => {
            if (result?.error) {
                console.error("Sign-in error:", result.error);
            } else {
            }
        })
        .catch((error) => {
            console.error("Sign-in failed:", error);
        });
    };

    const handleSignOut = () => signOut({ callbackUrl: '/' });

    const getInitial = (name: string | null | undefined): string => {
        return name ? name.trim().charAt(0).toUpperCase() : '?';
    };

    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    const getColorClass = (name: string | null | undefined): string => {
        if (!name) return 'bg-gray-500';
        const charCodeSum = name.split ('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return colors[charCodeSum % colors.length];
    };

    return (
        <header className={`${alice.variable} w-full h-16 md:h-40 border-b bg-white border-gray-400 flex flex-col justify-end font-serif z-50 shadow-1g`}>
            <div className="flex items-center px-4 md:px-6 py-1 md:py-3">
                <div className="flex items-center gap-3 ml-[170px] shrink-0">
                    <Image
                        src="/sitelogo.png"
                        alt="The Profit Papers Logo"
                        width={64}
                        height={64}
                        className="shrink-0"
                        priority
                    />
                    <Link href="/" className="no-underline hover:no-underline">
                        <div className="text-[40px] md:text-[40px] font-normal leading-tight tracking-wide">
                            The Profit Papers
                        </div>
                    </Link>
                </div>
                <div className="flex items-center ml-auto gap-4">
                    <form onSubmit={handleSearch} className="relative flex items-center" role="search" aria-label="Search stocks, news and keywords">
                        <input 
                            ref={inputRef}
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            placeholder="Search stocks, news, and tools..."
                            className="w-80 md:w-80 pl-4 pr-10 py-2 text-sm border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                            aria-describedby="search-help"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-10 text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label="Clear search"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="submit"
                            onClick={handleSearch}
                            className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                            aria-label="Search"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M21 21L15.0001 15M17 10C17 13.3137 14.3137 16 11 16C7.68629 16 5 13.3137 5 10C5 6.68629 7.68629 4 11 4C14.3137 4 17 6.68629 17 10Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        {showDropdown && (
                            <div className="absolute top-full left-0 mt-[1.5px] w-80 md:w-80 bg-white border-2 border-gray-400 rounded-md z-50 max-h-60 overflow-y-auto">
                                {recentSearches.length > 0 && (
                                    <div className="p-2 border-b border-gray-200">
                                        <h4 className="text-xs font-semibold text-gray-500 mb-1">Recent Searches</h4>
                                        {recentSearches.map((search, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSearchQuery(search);
                                                    handleSearch(e);
                                                }}
                                                className="w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="p-2">
                                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Popular Tickers</h4>
                                    {popularTickers.map((ticker, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSearchQuery(ticker.symbol);
                                                handleSearch(e);
                                            }}
                                            className="w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded flex justify-between items-center"
                                        >
                                            <span>{ticker.symbol}</span>
                                            <div className="text-right">
                                               <div className="text-xs">{ticker.price}</div>
                                               <div className={`text-xs ${ticker.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                    {ticker.change}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                    <small id="search-help" className="sr-only">Press Enter to search or click the icon</small> 
                    <div className="flex items-center gap-4 ml-auto">
                    {status === 'loading' ? (
                        <div className="text-sm text-gray-500">Loading...</div>
                    ) : session ? (
                        <div className="flex items-center gap-2">
                            {(() => {
                                const user = session.user;

                                const initial = getInitial(user?.name);
                                const colorClass = getColorClass(user?.name);
                                const hasImage = !!user?.image;

                                if (!user) {
                             
                                    return (
                                        <div className={`w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-base font-medium ${colorClass}`}>
                                            {initial}
                                        </div>
                                    );
                                }
                                
                                if (hasImage) {
                                    return (
                                        <div className="relative w-10 h-10 mr-2">
                                            <img
                                                src={user.image || undefined}
                                                alt={user.name || 'User Profile'}
                                                className="w-full h-full rounded-full border-2 border-gray-800 object-cover"
                                                onError={(e) => {
                                                    console.warn ('User image failed to load, falling back to initials');
                                                    e.currentTarget.style.display = 'none';

                                                    const fallbackDiv = e.currentTarget.nextElementSibling;
                                                    if (fallbackDiv) {
                                                        fallbackDiv.classList.remove('hidden');
                                                    }
                                                }}
                                            />
                                            <div 
                                                className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center text-white text-base font-medium ${colorClass} hidden`}
                                                onClick={() => {}}
                                            >
                                                {initial}
                                        </div>
                                    </div>
                                    );
                                }
                            })()}
                            <button
                                onClick={handleSignOut}     
                                className="px-4 py-2 bg-white border border-gray-600 text-gray-600 rounded hover:bg-red-50 transiton-colors cursor-pointer"                       >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleGoogleSignIn}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-400 rounded-md hover:bg-gray-200 transition-colors text-semibold flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                xmlns="https://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22.56 12.03c0-.77-.07-1.51-.2-2.24H12v4.26h6.05c-.25 1.34-1.02 2.53-2.13 3.32v2.77h3.58c2.09-1.93 3.3-4.75 3.3-8.11z" 
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c3.24 0 5.92-1.07 7.9-2.92l-3.58-2.77c-.98.65-2.22 1.05-4.32 1.05-3.35 0-6.2-2.26-7.23-5.27H.89v2.85C2.92 20.89 7.15 23 12 23z" 
                                    fill="#34A853"
                                />
                                <path
                                    d="M4.77 14.17c-.24-.66-.37-1.35-.37-2.14s.13-1.48.37-2.14V7.07H.89c-.77 1.57-.88 3.33-.88 4.93s.11 3.36.88 4.93L4.77 14.17z" 
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 4.99c1.77 0 3.34.61 4.58 1.74l3.15-3.15C17.92 1.83 15.24.77 12 .77c-4.85 0-9.08 2.11-11.11 5.48l3.88 3.01c1.03-3.01 3.88-5.27 7.23-5.27z" 
                                    fill="#EA4335"
                                />
                            </svg>

                            Sign in
                        </button>
                    )}
                </div>
            </div>
            </div>
                <nav className="w-full flex justify-center border-gray-200 md:px-0">
                 <ul className="flex space-x-0 md:space-x-0">
                    <li className="relative group"  
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
                    <li className="relative group"  
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
                                    <Link href="/markets/market-data" className="block px-2 py-2 md:px-4 md:py-2 text-gray-700 hover:text-black text-[11px] md:text-[11px]">
                                        Market Data
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
                    <li className="relative group"  
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
                    <li className="relative group"  
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
                    <li className="relative group"  
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
                    <li className="relative group"  
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
                    <li className="relative group"  
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
                    <li className="relative group"  
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
                    <li className="relative group"  
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
                    <li className="relative group"  
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
                                        Investment Strategies
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
                    <li className="relative group"  
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
                    <li className="relative group"  
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