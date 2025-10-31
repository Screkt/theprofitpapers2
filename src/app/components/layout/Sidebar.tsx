"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

interface StockData {
    ticker: string;
    price: number;
    change: number;
    isLast?: boolean;
}

const Sidebar: React.FC = () => {
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    const fetchStocks = async () => {
        try {
            const response = await fetch('/api/trending-stocks');
            const data: StockData[] = await response.json();
            if (Array.isArray(data)) {
                setStocks(data);
            } else {
                console.warn("API returned non-array data (possibly rate limit message):", data);
            }
        } catch (error) {
            console.error("Failed to fetch trending stocks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateWatchlistClick = async () => {
        if (status === 'loading') return;
        if (!session) {
            const result = await signIn('google', {
                callbackUrl: '/portfolios/watchlists',
                redirect: false
            });
            if (result?.error) {
                console.error("Sing-in error:", result.error);
            } else {
                router.push('/portfolios/watchlists');
            }
        } else {
            router.push('/portfolios/watchlists');
        }
    };

    useEffect(() => {
        fetchStocks();
        const intervalId= setInterval(fetchStocks, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const StockRow = ({ ticker, price, change, isLast }: StockData) => {
        const isPositive = change >= 0;
        const formattedPrice = `$${price.toFixed(2)}`;
        const formattedChange = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;

        return (
            <div className={`grid grid-cols-3 text-sm text-black py-2 bg-gray-300 p-2 border-l border-r border-t border-black ${isLast ? 'border-b rounded-b': ''}`}>
                <Link
                    href={`/stocks/${ticker.toLowerCase()}`}
                    className="font-bold text-left hover:underline"
                >
                    {ticker}
                </Link>
                <span className="text-center">{formattedPrice}</span>
                <span
                    className={`text-right font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'}`}
                >
                    {formattedChange}
                </span>
            </div>
        );
    }

    const PlaceholderRow = ({ isLast }: { isLast?: boolean }) => (
        <div className={`grid grid-cols-3 text-sm text-black py-2 bg-gray-300 p-2 border-l border-r border-t border-black ${isLast ? 'border-b rounded-b': ''}`}>
            <div className="animate-pulse bg-gray-400 h-4 w-3/4 rounded-sm"></div>
            <div className="animate-pulse bg-gray-400 h-4 w-1/2 rounded-sm mx-auto"></div>
            <div className="animate-pulse bg-gray-400 h-4 w-1/3 rounded-sm ml-auto"></div>
        </div>        
        );

    return (
        <aside className="w-60 min-h-screen bg-gray-200 text-white flex flex-col border-r border-gray-500 font-serif">
            <div className="flex-1 flex flex-col">
                <div className="text-center">
                    <h6 className="text-[20px] text-black bg-gray-400 m-2">
                        Trending Stocks
                    </h6>
                    <div className="p-2">
                        <div className="grid grid-cols-3 text-xs font-bold bg-gray-400 text-black border-l border-r border-t border-black rounded-t p-2">
                            <span className="text-left">Ticker</span>
                            <span className="text-center">Price</span>
                            <span className="text-right">Change</span>
                        </div>

                        <div className="flex flex-col space-y-0">
                            {isLoading ? (
                                <div className="text-sm text-gray-600 bg-gray-300 p-2 border border-black rounded-b">
                                    Loading data...
                                </div>
                            ) : Array.isArray(stocks) && stocks.length > 0 ? (
                                stocks.map((stock, index) => (
                                    <StockRow
                                        key={stock.ticker}
                                        ticker={stock.ticker}
                                        price={stock.price}
                                        change={stock.change}
                                        isLast={index === stocks.length - 1}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col">
                                    {[...Array(8)].map((_, index) => (
                                        <PlaceholderRow 
                                              key={index} 
                                              isLast={index === 7} 
                                           />
                                        ))}
                                  </div>
                                )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col m-2 mb-4">
                    <div className="text-center justify-center mb-2">
                        <h6 className="text-[20px] text-black bg-gray-400">
                            Your Watchlist
                        </h6>
                    </div>
                    <div className=" bg-gray-300 flex items-center justify-center p-4 border border-black rounded">
                        <button
                            onClick={handleCreateWatchlistClick}
                            disabled={status === 'loading'}
                            className="py-2 bg-white text-gray-700 border-2 border-gray-400 rounded hover:bg-gray-200 transition colors font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-48"
                            aria-label={session ? "View your watchlist" : "Sign in to create watchlists"}
                        >
                            {status === 'loading' ? (
                                'Signing in...'
                            ) : session ? (
                                'View your watchlists'
                            ) : (
                                'Create your watchlists'
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col m-2 mb-4">
                    <div className="text-center justify-center mb-2">
                        <h6 className="text-[20px] text-black bg-gray-400">
                            Portfolios
                        </h6>
                    </div>
                    <div className=" bg-gray-300 flex items-center justify-center p-4 border border-black rounded">
                        <button
                            onClick={handleCreateWatchlistClick}
                            disabled={status === 'loading'}
                            className="px-2 py-2 bg-white text-gray-700 border-2 border-gray-400 rounded hover:bg-gray-200 transition colors font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-48"
                            aria-label={session ? "View your watchlist" : "Sign in to create watchlists"}
                        >
                            {status === 'loading' ? (
                                'Signing in...'
                            ) : session ? (
                                'View your portfolio'
                            ) : (
                                'Create your portfolio'
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
        </aside>
    )

}

export default Sidebar;