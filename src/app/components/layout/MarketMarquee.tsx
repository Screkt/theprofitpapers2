"use client";

import React, { useState, useEffect } from 'react';

interface IndexData {
    ticker: string;
    name: string;
    price: number;
    changePercent: number;
    change: number;
}

const marqueeStyle = (speed: number) => ({
    animation: `marquee ${speed}s linear infinite`,
});

const cssStyles = `
    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); } 
    }
    .marquee-container {
        white-space: nowrap; 
        overflow: hidden;    
        width: 100%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .marquee-content {
        display: inline-block;
        animation: marquee 30s linear infinite; 
        padding-right: 1rem; 
    }
    .index-item {
        display: inline-block;
        margin-right: 2rem;
        padding: 0.5rem 0;
    }
    .index-item > span {
        font-weight: 700;
    }
`;


const IndexItem: React.FC<IndexData> = ({ name, price, changePercent }) => {
    if (typeof price !== 'number' || typeof changePercent !== 'number') {
        return null;
    }
    
    const isPositive = changePercent >= 0;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    const sign = isPositive ? '+' : '';

    return (
        <div className="index-item text-sm sm:text-base text-gray-800">
            <span className="font-bold uppercase text-gray-900 mr-2">{name}:</span>
            <span className="mr-4">${price.toFixed(2)}</span>
            <span className={`${colorClass} font-semibold`}>
                {sign}{changePercent.toFixed(2)}%
            </span>
        </div>
    );
};


const MarketMarquee: React.FC = () => {
    const [indexData, setIndexData] = useState<IndexData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchIndexData = async () => {
        try {
            const response = await fetch('/api/market-data');
            const data: IndexData[] | any = await response.json(); 
            
            if (Array.isArray(data) && data.length > 0) {
                setIndexData(data);
            } else {
                console.warn("Market Marquee: API returned non-array data or empty data.", data);
                setIndexData([]); 
            }
        } catch (error) {
            console.error("Market Marquee: Failed to fetch index data:", error);
            setIndexData([]); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIndexData();
        const intervalId = setInterval(fetchIndexData, 60000); 
        return () => clearInterval(intervalId);
    }, []);

    if (!isLoading && indexData.length === 0) {
        return (
            <div className="w-full bg-white border-b border-red-300 text-center py-2 text-sm text-red-300">
                ⚠️ **Index Data Unavailable.** Please check your API key and rate limits.
            </div>
        );
    }
    
    const MarqueeContent = (
        <div className="marquee-content flex items-center h-full">
            {indexData.map((item, index) => (
                <IndexItem key={index} {...item} />
            ))}
            {indexData.map((item, index) => (
                <IndexItem key={`dup-${index}`} {...item} />
            ))}
        </div>
    );

    return (
        <header className="w-full bg-gray-100 border-b border-gray-300 shadow-sm">
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
            
            <div className="marquee-container h-10 flex items-center overflow-hidden">
                <div 
                    className="h-full flex items-center" 
                    style={marqueeStyle(40)} 
                >
                    {MarqueeContent}
                </div>
            </div>
        </header>
    );
};

export default MarketMarquee;