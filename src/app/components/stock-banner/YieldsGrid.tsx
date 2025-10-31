"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface YieldData {
    symbol: string;
    yield: number; 
    change: number; 
}

const mockYields: YieldData[] = [
  { symbol: '3M', yield: 4.82, change: 1 },
  { symbol: '1Y', yield: 4.18, change: -2 },
  { symbol: '2Y', yield: 4.12, change: 0 },
  { symbol: '3Y', yield: 4.15, change: -1 },
  { symbol: '5Y', yield: 4.20, change: -3 },
  { symbol: '5Y', yield: 4.20, change: -3 },
  { symbol: '10Y', yield: 4.23, change: -4 },
  { symbol: '30Y', yield: 4.42, change: 2 },
];

const YieldsGrid: React.FC = () => {
    const [yields, setYields] = useState<YieldData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchYields = async () => {
        setError(null);
        try {
            const response = await fetch('/api/yields');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: YieldData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setYields(data);
            } else {
                setError('No data returned from API');
                setYields(mockYields);
            }
        } catch (error: any) {
            console.error("Failed to fetch yields:", error);
            setError(error.message || 'Fetch error - using mock data');
            setYields(mockYields);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchYields();
        const intervalId = setInterval(fetchYields, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const YieldCell = ({ symbol, yield: yld, change }: YieldData) => {
        const isPositive = change >= 0;
        const formattedYield = `${yld.toFixed(2)}%`;
        const formattedChange = `${isPositive ? '+' : ''}${change}bps`;

        return (
            <Link
                href={`/markets/yields/${symbol.toLowerCase()}`}
                className="flex flex-col justify-between items-center w-full h-full text-[16px] bg-white border border-black hover:bg-gray-100 rounded p-2 leading-tight min-w-0"
                title={`${symbol} Yield: ${formattedYield} ${formattedChange}`}
            >
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-center w-full text-[18px]">
                    {symbol}
                </div> 
                <div className="flex items-center justify-center gap-1 whitespace-nowrap overflow-hidden w-full">
                    <div className="text-gray-700 min-w-0 truncate">{formattedYield}</div>  
                    <div className={`font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'} min-w-0 truncate`}>
                        {formattedChange}
                    </div>
                </div>
            </Link>
        );
    };

    const PlaceholderCell = () => (
        <div className="flex flex-col justify-between items-center w-full h-full text-xs bg-white border border-black hover:bg-gray-100 rounded p-1 leading-tight min-w-0">
            <div className="bg-gray-400 h-3 w-full rounded-sm mx-auto mb-1"></div>
            <div className="flex items-center justify-center gap-1 w-full">
                <div className="bg-gray-400 h-3 flex-1 rounded-sm"></div>
                <div className="bg-gray-400 h-3 flex-1 rounded-sm"></div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full grid grid-cols-4 gap-1 items-stretch min-w-0 overflow-x-auto p-1">

            {isLoading ? (
                [...Array(8)].map((_, index) => (
                    <div key={index} className="h-full w-full">
                        <PlaceholderCell />
                    </div>
                ))
            ) : yields.length > 0 ? (
                yields.map((yld) => (
                    <div key={yld.symbol} className="h-full w-full">
                        <YieldCell {...yld} />
                    </div>
                ))
            ) : (
                [...Array(8)].map((_, index) => (
                    <div key={index} className="h-full w-full">
                        <PlaceholderCell />
                    </div>
                ))
            )} 
        </div>
    );  
};

export default YieldsGrid;