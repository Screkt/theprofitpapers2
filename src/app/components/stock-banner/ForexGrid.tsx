"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ForexData {
    symbol: string;
    price: number;
    change: number;
}

const mockForex: ForexData[] = [
  { symbol: 'EUR/USD', price: 1.085, change: -0.3 },
  { symbol: 'USD/JPY', price: 153.20, change: 0.1 },
  { symbol: 'GBP/USD', price: 1.295, change: -0.2 },
  { symbol: 'USD/CNY', price: 7.10, change: 0.4 },
];

const ForexGrid: React.FC = () => {
    const [forex, setForex] = useState<ForexData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchForex = async () => {
        setError(null);
        try {
            const response = await fetch('/api/forex');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: ForexData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setForex(data);
            } else {
                setError('No data returned from API');
                setForex(mockForex);
            }
        } catch (error: any) {
            console.error("Failed to fetch forex:", error);
            setError(error.message || 'Fetch error - using mock data');
            setForex(mockForex);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchForex();
        const intervalId = setInterval(fetchForex, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const ForexCell = ({ symbol, price, change }: ForexData) => {
        const isPositive = change >= 0;
        const formattedPrice = price.toFixed(4);
        const formattedChange = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;

        return (
            <Link
                href={`/markets/forex/${symbol.toLowerCase().replace('/', '')}`}
                className="flex flex-col justify-between items-center w-full h-full text-[14px] bg-white border border-black hover:bg-gray-100 rounded p-2 leading-tight min-w-0"
                title={`${symbol}: ${formattedPrice} ${formattedChange}`}
            >
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-center w-full">
                    {symbol}
                </div> 
                <div className="flex justify-between items-center gap-1 whitespace-nowrap w-full px-1">
                    <div className="text-gray-700 flex-1 text-left min-w-0">
                        {formattedPrice}
                    </div>  
                    <div className={`font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'} flex-1 text-right min-w-0`}>
                        {formattedChange}
                    </div>
                </div>
            </Link>
        );
    };

    const PlaceholderCell = () => (
        <div className="flex flex-col justify-between items-center w-full h-full text-xs bg-white border border-black hover:bg-gray-100 rounded p-2 leading-tight min-w-0">
            <div className="bg-gray-400 h-3 w-full rounded-sm mx-auto mb-1"></div>
            <div className="flex justify-between items-center gap-1 w-full px-1">
                <div className="bg-gray-400 h-3 flex-1 rounded-sm"></div>
                <div className="bg-gray-400 h-3 flex-1 rounded-sm"></div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full grid grid-cols-4 gap-1 items-stretch min-w-0 overflow-x-auto p-1">
            {isLoading ? (
                [...Array(4)].map((_, index) => (
                    <div key={index} className="h-full w-full">
                        <PlaceholderCell />
                    </div>
                ))
            ) : forex.length > 0 ? (
                forex.map((fx) => (
                    <div key={fx.symbol} className="h-full w-full">
                        <ForexCell {...fx} />
                    </div>
                ))
            ) : (
                [...Array(4)].map((_, index) => (
                    <div key={index} className="h-full w-full">
                        <PlaceholderCell />
                    </div>
                ))
            )} 
        </div>
    );  
};

export default ForexGrid;