"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ValuationData {
    name: string;
    value: number;
    vsAvg: number;
}

const mockValuations: ValuationData[] = [
  { name: 'S&P 500 Fwd P/E', value: 23.5, vsAvg: 18 },
  { name: 'Shiller CAPE', value: 40.5, vsAvg: 35 },
  { name: 'Buffett Ind.', value: 200, vsAvg: 33 },
  { name: 'Nasdaq P/E', value: 35, vsAvg: 25 },
];

const ValuationsGrid: React.FC = () => {
    const [valuations, setValuations] = useState<ValuationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchValuations = async () => {
        setError(null);
        try {
            const response = await fetch('/api/valuations');
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }
            const data: ValuationData[] = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setValuations(data);
            } else {
                setError('No data returned from API');
                setValuations(mockValuations);
            }
        } catch (error: any) {
            console.error("Failed to fetch valuations:", error);
            setError(error.message || 'Fetch error - using mock data');
            setValuations(mockValuations);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchValuations();
        const intervalId = setInterval(fetchValuations, 300000);
        return () => clearInterval(intervalId);
    }, []);

    const ValuationCell = ({ name, value, vsAvg }: ValuationData) => {
        const formattedValue = name.includes('P/E') ? `${value.toFixed(1)}x` : name.includes('Buffett') ? `${value}%` : `${value.toFixed(1)}`;
        const sign = vsAvg >= 0 ? '+' : '';
        const formattedVsAvg = `${sign}${vsAvg.toFixed(0)}% vs. 5Y Avg`;        
        const isOvervalued = vsAvg > 0;

        return (
            <Link
                href={`/markets/valuations/${name.toLowerCase().replace(/ /g, '-')}`}
                className="flex flex-col justify-between items-center w-full h-full text-[22px] bg-white border border-black hover:bg-gray-100 rounded p-2 leading-[1.1] min-w-0"
                title={`${name}: ${formattedValue} (${sign}${vsAvg}% vs. 5Y Avg)`}
            >
                <div className="font-bold text-black overflow-hidden text-center w-full text-[16px]">
                    {name}
                </div> 
                <div className="flex justify-between items-center gap-1 w-full">
                    <div className="text-gray-700 flex-1 text-left min-w-0 text-[14px]">
                        {formattedValue}
                    </div>  
                    <div className={`font-semibold ${isOvervalued ? 'text-red-700' : 'text-green-700'} flex-1 text-right min-w-0 text-[14px]`}>
                        {formattedVsAvg}
                    </div>
                </div>
            </Link>
        );
    };

    const PlaceholderCell = () => (
        <div className="flex flex-col justify-between items-center w-full h-full text-xs bg-white border border-black hover:bg-gray-100 rounded leading-tight min-w-0">
            <div className="bg-gray-400 h-full rounded-sm mx-auto"></div>
            <div className="flex justify-between items-center w-full">
                <div className="bg-gray-400 h-10 flex-1 rounded-sm"></div>
                <div className="bg-gray-400 h-10 flex-1 rounded-sm"></div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full grid grid-cols-2 gap-1 items-stretch min-w-0 overflow-x-auto p-1">
            {isLoading ? (
                [...Array(4)].map((_, index) => (
                    <div key={index} className="h-full w-full">
                        <PlaceholderCell />
                    </div>
                ))
            ) : valuations.length > 0 ? (
                valuations.map((val) => (
                    <div key={val.name} className="h-full w-full">
                        <ValuationCell {...val} />
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

export default ValuationsGrid;