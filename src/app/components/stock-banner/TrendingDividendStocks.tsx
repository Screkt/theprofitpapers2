"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DividendData {
    ticker: string;
    yield: number; 
    price: number;
    return1y: number;
}

const TrendingDividendStocks: React.FC = () => {
    const [dividends, setDividends] = useState<DividendData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDividends = async () => {
        setError(null);
        try {
            const response = await fetch('/api/dividend-stocks');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: DividendData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setDividends(data);
            } else {
                setError('No data returned from API');
                setDividends(dividends);
            }
        } catch (error: any) {
            console.error("Failed to fetch dividend stocks:", error);
            setError(error.message || 'Fetch error - using mock data');
            setDividends(dividends);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDividends();
        const intervalId = setInterval(fetchDividends, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const DividendRow = ({ ticker, yield: yld, price, return1y, isLast }: DividendData & { isLast?: boolean }) => {
        const formattedYield = `${yld.toFixed(2)}%`;
        const formattedPrice = `$${price.toFixed(2)}`;
        const isPositiveReturn = return1y >= 0;
        const formattedReturn1y = `${isPositiveReturn ? '+' : ''}${return1y.toFixed(2)}%`;

        return (
            <div className={`grid grid-cols-4 text-sm text-black py-2 bg-white p-2 border-l border-r border-t border-black ${isLast ? 'border-b rounded-b' : ''}`}>
                <Link
                    href={`/stocks/${ticker.toLowerCase()}`}
                    className="font-bold text-left hover:underline"
                >
                    {ticker}
                </Link>
                <span className="text-center">{formattedYield}</span>
                <span className="text-right">{formattedPrice}</span>
                <span className={`text-right font-semibold ${isPositiveReturn ? 'text-green-700' : 'text-red-700'}`}>
                    {formattedReturn1y}
                </span>
            </div>
        );
    };

    const PlaceholderRow = ({ isLast }: { isLast?: boolean }) => (
        <div className={`grid grid-cols-4 text-sm text-black py-2 bg-white p-2 border-l border-r border-t border-black ${isLast ? 'border-b rounded-b' : ''}`}>
            <div className="animate-pulse bg-gray-400 h-4 w-3/4 rounded-sm"></div>
            <div className="animate-pulse bg-gray-400 h-4 w-1/2 rounded-sm mx-auto"></div>
            <div className="animate-pulse bg-gray-400 h-4 w-1/3 rounded-sm ml-auto"></div>
            <div className="animate-pulse bg-gray-400 h-4 w-1/4 rounded-sm mr-auto"></div>
        </div>
    );

    return (
        <div className="flex flex-col w-full">
            <h5 className="text-3xl text-black bg-gray-300 rounded text-center font-serif m-2">
                Trending Dividend Stocks
            </h5>
            <div className="m-2 mt-0">
                <div className="grid grid-cols-4 text-m font-bold bg-gray-200 text-black border-l border-r border-t border-black rounded-t p-2">
                    <span className="text-left">Ticker</span>
                    <span className="text-center">Yield</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">1Y Return</span>
                </div>

                <div className="flex flex-col space-y-0">
                    {isLoading ? (
                        <div className="text-sm text-gray-600 bg-white p-2 border border-black rounded-b">
                            Loading data...
                        </div>
                    ) : Array.isArray(dividends) && dividends.length > 0 ? (
                        dividends.map((dividend, index) => (
                            <DividendRow
                                key={dividend.ticker}
                                ticker={dividend.ticker}
                                yield={dividend.yield}
                                price={dividend.price}
                                return1y={dividend.return1y}
                                isLast={index === dividends.length - 1}
                            />
                        ))
                    ) : (
                        [...Array(8)].map((_, index) => (
                            <PlaceholderRow 
                                key={index} 
                                isLast={index === 7} 
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );  
};

export default TrendingDividendStocks;
