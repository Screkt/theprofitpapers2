"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CryptoData {
    symbol: string;
    price: number;
    change: number;
}

const mockCrypto: CryptoData[] = [
  { symbol: 'BTC', price: 68500, change: 1.2 },
  { symbol: 'ETH', price: 2650, change: -0.5 },
  { symbol: 'BNB', price: 595, change: 0.8 },
  { symbol: 'SOL', price: 155, change: 2.1 },
  { symbol: 'XRP', price: 0.53, change: -1.3 },
  { symbol: 'ADA', price: 0.42, change: 0.9 },
  { symbol: 'DOGE', price: 0.14, change: 3.2 },
  { symbol: 'TRX', price: 0.16, change: -0.7 },
];

const CryptoGrid: React.FC = () => {
    const [crypto, setCrypto] = useState<CryptoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCrypto = async () => {
        setError(null);
        try {
            const response = await fetch('/api/crypto');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: CryptoData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setCrypto(data.slice(0, 8));
            } else {
                setError('No data returned from API');
                setCrypto(mockCrypto);
            }
        } catch (error: any) {
            console.error("Failed to fetch crypto:", error);
            setError(error.message || 'Fetch error - using mock data');
            setCrypto(mockCrypto);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCrypto();
        const intervalId = setInterval(fetchCrypto, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const CryptoCell = ({ symbol, price, change }: CryptoData) => {
        const isPositive = change >= 0;
        const abbreviatePrice = (p: number): string => {
            if (p >= 1e9) return `$${(p / 1e9).toFixed(1)}B`;
            if (p >= 1e6) return `$${(p / 1e6).toFixed(1)}M`;
            if (p >= 1e3) return `$${(p / 1e3).toFixed(1)}K`;
            return `$${p.toFixed(2)}`;
        };
        const displayPrice = abbreviatePrice(price);
        const fullPrice = price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        const formattedChange = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;

        return (
            <Link
                href={`/markets/crypto/${symbol.toLowerCase()}`}
                className="flex flex-col justify-between items-center w-full h-full text-[16px] bg-white border border-black hover:bg-gray-100 rounded p-2 leading-tight min-w-0"
                title={`${symbol}: $${fullPrice} ${formattedChange}`}
            >
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-center w-full">
                    {symbol}
                </div> 
                <div className="flex justify-between items-center gap-1 whitespace-nowrap w-full px-1">
                    <div className="text-gray-700 flex-1 text-left min-w-0">
                        {displayPrice}
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
                [...Array(8)].map((_, index) => (
                    <div key={index} className="h-full w-full">
                        <PlaceholderCell />
                    </div>
                ))
            ) : crypto.length > 0 ? (
                crypto.map((c) => (
                    <div key={c.symbol} className="h-full w-full">
                        <CryptoCell {...c} />
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

export default CryptoGrid;