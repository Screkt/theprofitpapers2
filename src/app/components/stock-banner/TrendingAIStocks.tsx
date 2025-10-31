"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AIStockData {
    ticker: string;
    price: number;
    change: number;
    return1y: number;
}

const mockAIStocks: AIStockData[] = [
  { ticker: 'PLTR', price: 32.1, change: 1.5, return1y: 200.9 },
  { ticker: 'ARM', price: 85.3, change: 2.3, return1y: 150.6 },
  { ticker: 'NRDY', price: 3.1, change: 1.5, return1y: 200.9 },
  { ticker: 'REKR', price: 1.2, change: 2.3, return1y: 150.6 },
  { ticker: 'VERI', price: 3.7, change: -0.4, return1y: 30.7 },
  { ticker: 'UPST', price: 25.2, change: 0.8, return1y: 60.4 },
  { ticker: 'BBAI', price: 1.5, change: 1.1, return1y: 120.1 },
  { ticker: 'SOUN', price: 4.8, change: -0.2, return1y: 45.3 },
];

const TrendingAIStocks: React.FC = () => {
    const [aiStocks, setAIStocks] = useState<AIStockData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAIStocks = async () => {
        setError(null);
        try {
            const response = await fetch('/api/ai-stocks');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: AIStockData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setAIStocks(data); 
            } else {
                setError('No data returned from API');
                setAIStocks(mockAIStocks);
            }
        } catch (error: any) {
            console.error("Failed to fetch AI stocks:", error);
            setError(error.message || 'Fetch error - using mock data');
            setAIStocks(mockAIStocks);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAIStocks();
        const intervalId = setInterval(fetchAIStocks, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const AIStockRow = ({ ticker, price, change, return1y, isLast }: AIStockData & { isLast?: boolean }) => {
        const isPositiveChange = change >= 0;
        const isPositiveReturn = return1y >= 0;
        const formattedPrice = `$${price.toFixed(2)}`;
        const formattedChange = `${isPositiveChange ? '+' : ''}${change.toFixed(2)}%`;
        const formattedReturn1y = `${isPositiveReturn ? '+' : ''}${return1y.toFixed(2)}%`;

        return (
            <div className={`grid grid-cols-4 text-sm text-black py-2 bg-white p-2 border-l border-r border-t border-black ${isLast ? 'border-b rounded-b' : ''}`}>
                <Link
                    href={`/stocks/${ticker.toLowerCase()}`}
                    className="font-bold text-left hover:underline"
                >
                    {ticker}
                </Link>
                <span className="text-center">{formattedPrice}</span>
                <span className={`text-right font-semibold ${isPositiveChange ? 'text-green-700' : 'text-red-700'}`}>
                    {formattedChange}
                </span>
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
            <h6 className="text-3xl text-black bg-gray-300 m-2 rounded text-center font-serif">
                Trending AI Stocks
            </h6>
            <div className="m-2 mt-0">
                <div className="grid grid-cols-4 text-m font-bold bg-gray-200 text-black border-l border-r border-t border-black rounded-t p-2">
                    <span className="text-left">Ticker</span>
                    <span className="text-center">Price</span>
                    <span className="text-right">Change</span>
                    <span className="text-right">1Y Return</span>
                </div>

                <div className="flex flex-col space-y-0">
                    {isLoading ? (
                        <div className="text-sm text-gray-600 bg-gray-300 p-2 border border-black rounded-b">
                            Loading data...
                        </div>
                    ) : Array.isArray(aiStocks) && aiStocks.length > 0 ? (
                        aiStocks.map((stock, index) => (
                            <AIStockRow
                                key={stock.ticker}
                                ticker={stock.ticker}
                                price={stock.price}
                                change={stock.change}
                                return1y={stock.return1y}
                                isLast={index === aiStocks.length - 1}
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

export default TrendingAIStocks;