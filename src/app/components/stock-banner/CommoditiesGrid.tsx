"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CommodityData {
    symbol: string;
    price: number;
    change: number;
}

const CommoditiesGrid: React.FC = () => {
    const [commodities, setCommodities] = useState<CommodityData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCommodities = async () => {
        setError(null);
        try {
            const response = await fetch('/api/commodities');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: CommodityData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setCommodities(data);
            } else {
                setError('No data returned from API');
                setCommodities(commodities);
            }
        } catch (error: any) {
            console.error("Failed to fetch commodities:", error);
            setError(error.message || 'Fetch error - using mock data');
            setCommodities(commodities);
        } finally {
            setIsLoading(false);
        }
    };

   useEffect(() => {
        fetchCommodities();
        const intervalId = setInterval(fetchCommodities, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const CommodityCell = ({ symbol, price, change }: CommodityData) => {
        const isPositive = change >= 0;
        const formattedPrice = `$${price.toFixed(2)}`;
        const formattedChange = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
return (
            <Link
                href={`/markets/commodities/${symbol.toLowerCase()}`}
                className="flex flex-col justify-between items-center w-full h-full text-xs bg-white border border-black hover:bg-gray-100 rounded leading-tight min-w-0"
            >
                <div className="font-bold text-black whitespace-nowrap overflow-hidden text-center w-full">
                    {symbol}
                </div> 
                <div className="flex items-center justify-center gap-1 whitespace-nowrap overflow-hidden w-full">
                    <div className="text-gray-700 min-w-0 truncate">{formattedPrice}</div>  
                    <div className={`font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'} min-w-0 truncate`}>
                        {formattedChange}
                    </div>
                </div>
            </Link>
        );
    };

    const PlaceholderCell = () => (
        <div className="flex flex-col justify-between items-center w-full h-full text-xs bg-white border border-black hover:bg-gray-100 rounded p-2 leading-tight min-w-0">
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
            ) : commodities.length > 0 ? (
                commodities.map((commodity) => (
                    <div key={commodity.symbol} className="h-full w-full">
                        <CommodityCell {...commodity} />
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

export default CommoditiesGrid;