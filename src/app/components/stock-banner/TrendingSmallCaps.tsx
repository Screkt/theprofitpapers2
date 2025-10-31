"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface StockData {
    ticker: string;
    price: number;
    change: number;
    isLast?: boolean;
}

const mockStocks: StockData[] = [
  { ticker: 'GSIT', price: 12.05, change: 30.55 },
  { ticker: 'SUPV', price: 9.96, change: 47.99 },
  { ticker: 'LOMA', price: 10.36, change: 31.97 },
  { ticker: 'ZBIO', price: 31.80, change: 33.08 },
  { ticker: 'KURA', price: 11.04, change: 13.81 },
  { ticker: 'PUMP', price: 7.19, change: 13.95 },
  { ticker: 'DQ', price: 29.69, change: 14.06 },
];

const TrendingSmallCaps: React.FC = () => {
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSmallCaps = async () => {
        setError(null);
        try {
            const response = await fetch('/api/trending-small-caps');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: StockData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setStocks(data.slice(0, 7));
            } else {
                setError('No data returned from API');
                setStocks(mockStocks);
            }
        } catch (error: any) {
            console.error("Failed to fetch trending small caps:", error);
            setError(error.message || 'Fetch error - using mock data');
            setStocks(mockStocks);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSmallCaps();
        const intervalId = setInterval(fetchSmallCaps, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const StockCell = ({ ticker, price, change }: StockData) => {
        const isPositive = change >= 0;
        const formattedPrice = `$${price.toFixed(2)}`;
        const formattedChange = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;

        return (
            <Link
                href={`/stocks/${ticker.toLowerCase()}`}
                className="flex flex-col justify-between items-center w-full h-full text-[15px] bg-white border border-black hover:bg-gray-100 rounded p-2 leading-tight min-w-0"
            >
                <div className="font-bold text-black text-[18px] whitespace-nowrap overflow-hidden">
                    {ticker}
                    </div> 

                <div className="flex items-center justify-center gap-2">
                    <div className="text-gray-700">{formattedPrice}</div>  
                    <div className={`font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                        {formattedChange}
                    </div>
                </div>
            </Link>
        );
    };

    const PlaceholderCell = () => (
        <div className="flex flex-col justify-between items-center w-full h-full text-[15px] bg-white border border-black hover:bg-gray-100 rounded p-2 leading-tight min-w-0">
            <div className="bg-gray-400 h-3 w-3/4 rounded-sm"></div>
            <div className="bg-gray-400 h-3 w-1/2 rounded-sm"></div>
            <div className="bg-gray-400 h-3 w-1/3 rounded-sm"></div>
        </div>
    );

    const displayData = isLoading ? [...Array(7)] : stocks;

    return (
        <div className="flex items-stretch justify-start w-full min-w-0 overflow-x-auto h-full"> 
            <div className="flex-0 bg-green-600 rounded border-2 border-green-900 self-stretch flex items-center px-2 mr-1">
                <h6 className="text-xl font-bold text-black px-2 rounded whitespace-nowrap">
                    Trending Small Caps
                </h6>
            </div>
            <div className="flex-1 grid grid-cols-7 gap-1 h-full items-stretch min-w-0">
                {isLoading ? (
                    [...Array(7)].map((_, index) => (
                        <div key={index} className="h-full w-full min-h-0">
                            <PlaceholderCell />
                        </div>
                    ))
                ) : stocks.length > 0 ? (
                    stocks.map((stock, index) => (
                        <div key={stock.ticker} className="h-full w-full min-h-0">
                            <StockCell {...stock} />
                        </div>
                    ))
                ) : (
                    [...Array(7)].map((_, index) => (
                        <div key={index} className="h-full">
                            <PlaceholderCell />
                        </div>
                    ))
                )} 
            </div>
        </div>
    );  
};

export default TrendingSmallCaps;