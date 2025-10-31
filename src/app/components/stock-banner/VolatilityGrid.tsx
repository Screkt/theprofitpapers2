"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface VolData {
    symbol: string;
    price: number;
    change: number;
}

const mockVol: VolData[] = [
  { symbol: 'VIX', price: 18.5, change: 2.1 },
  { symbol: 'VVIX', price: 85.2, change: 1.5 },
  { symbol: 'MOVE', price: 92.3, change: -0.8 },
  { symbol: 'OVX', price: 25.4, change: 0.3 },
];

const VolatilityGrid: React.FC = () => {
    const [vol, setVol] = useState<VolData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVol = async () => {
        setError(null);
        try {
            const response = await fetch('/api/volatility');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: VolData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setVol(data);
            } else {
                setError('No data returned from API');
                setVol(mockVol);
            }
        } catch (error: any) {
            console.error("Failed to fetch volatility:", error);
            setError(error.message || 'Fetch error - using mock data');
            setVol(mockVol);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVol();
        const intervalId = setInterval(fetchVol, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const VolCell = ({ symbol, price, change }: VolData) => {
        const isPositive = change >= 0;
        const formattedPrice = price.toFixed(1);
        const formattedChange = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;

        return (
            <Link
                href={`/markets/volatility/${symbol.toLowerCase()}`}
                className="flex flex-col justify-between items-center w-full h-full text-[16px] bg-white border border-black hover:bg-gray-100 rounded p-2 leading-tight min-w-0"
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
            ) : vol.length > 0 ? (
                vol.map((v) => (
                    <div key={v.symbol} className="h-full w-full">
                        <VolCell {...v} />
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

export default VolatilityGrid;