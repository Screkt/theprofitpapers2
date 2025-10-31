"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface CorporateBondData {
    name: string;
    ticker: string;
    price: number;
    bondYield: number;
    todayChange: number;
    fiveDayChange: number;
    oneMonthChange: number;
    threeMonthChange: number;
    ytdChange: number;
    oneYearChange: number;
    threeYearChange: number;
    fiveYearChange: number; 
    tenYearChange: number; 
    dailyRange: string;
    oneYearRange: string;
}

type SortConfig = { key: keyof CorporateBondData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof CorporateBondData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockBonds: CorporateBondData[] = [
    { name: 'IG Core Aggregate (4-15 Yr)', ticker: 'LQD', price: 105.50, bondYield: 5.20, todayChange: 0.15, fiveDayChange: 0.40, oneMonthChange: 0.85, threeMonthChange: 1.5, ytdChange: 4.50, oneYearChange: 7.20, threeYearChange: 15.8, fiveYearChange: 30.0, tenYearChange: 65.5, dailyRange: "$105.10 • $105.70", oneYearRange: "$102.00 • $108.50" },
    { name: 'IG Short-Term (1-5 Yr)', ticker: 'VCSH', price: 78.90, bondYield: 4.80, todayChange: 0.05, fiveDayChange: 0.15, oneMonthChange: 0.35, threeMonthChange: 0.7, ytdChange: 3.80, oneYearChange: 6.50, threeYearChange: 13.0, fiveYearChange: 26.5, tenYearChange: 55.2, dailyRange: "$78.80 • $79.00", oneYearRange: "$77.50 • $80.50" },
    { name: 'IG Intermediate-Term (5-10 Yr)', ticker: 'VCIT', price: 82.50, bondYield: 5.00, todayChange: 0.08, fiveDayChange: 0.25, oneMonthChange: 0.50, threeMonthChange: 1.0, ytdChange: 2.50, oneYearChange: 5.00, threeYearChange: 10.0, fiveYearChange: 20.0, tenYearChange: 45.0, dailyRange: "$82.30 • $82.70", oneYearRange: "$80.00 • $85.00" },
    { name: 'IG Long-Term (10+ Yr)', ticker: 'VCLT', price: 85.20, bondYield: 5.50, todayChange: -0.20, fiveDayChange: -0.80, oneMonthChange: -1.50, threeMonthChange: -3.2, ytdChange: -1.00, oneYearChange: -3.50, threeYearChange: -8.0, fiveYearChange: 5.5, tenYearChange: 22.1, dailyRange: "$84.90 • $85.50", oneYearRange: "$80.00 • $89.50" },
    { name: 'HY Core Benchmark (Broad)', ticker: 'HYG', price: 76.10, bondYield: 7.50, todayChange: -0.10, fiveDayChange: -0.30, oneMonthChange: -0.50, threeMonthChange: -1.0, ytdChange: 1.50, oneYearChange: 4.00, threeYearChange: 7.5, fiveYearChange: 15.0, tenYearChange: 30.0, dailyRange: "$75.90 • $76.30", oneYearRange: "$72.00 • $79.00" },
    { name: 'HY Core Alternative (Broad)', ticker: 'JNK', price: 95.80, bondYield: 7.60, todayChange: -0.12, fiveDayChange: -0.35, oneMonthChange: -0.60, threeMonthChange: -1.2, ytdChange: 1.30, oneYearChange: 3.80, threeYearChange: 7.0, fiveYearChange: 14.5, tenYearChange: 29.5, dailyRange: "$95.60 • $96.00", oneYearRange: "$91.00 • $98.50" },
    { name: 'HY Short Duration (1-5 Yr)', ticker: 'SHYG', price: 50.10, bondYield: 7.00, todayChange: 0.03, fiveDayChange: 0.10, oneMonthChange: 0.20, threeMonthChange: 0.4, ytdChange: 2.00, oneYearChange: 5.00, threeYearChange: 10.0, fiveYearChange: 20.0, tenYearChange: 40.0, dailyRange: "$50.00 • $50.20", oneYearRange: "$48.50 • $51.50" },
    { name: 'HY Intermediate Duration (5-10 Yr)', ticker: 'PBTB', price: 65.50, bondYield: 7.20, todayChange: 0.05, fiveDayChange: 0.15, oneMonthChange: 0.30, threeMonthChange: 0.6, ytdChange: 1.80, oneYearChange: 4.50, threeYearChange: 8.5, fiveYearChange: 17.5, tenYearChange: 35.0, dailyRange: "$65.40 • $65.60", oneYearRange: "$63.00 • $67.00" },
    { name: 'Broad Short-Term (1-5 Yr)', ticker: 'BSV', price: 79.50, bondYield: 4.70, todayChange: 0.04, fiveDayChange: 0.12, oneMonthChange: 0.30, threeMonthChange: 0.6, ytdChange: 3.50, oneYearChange: 6.00, threeYearChange: 12.0, fiveYearChange: 25.0, tenYearChange: 52.0, dailyRange: "$79.40 • $79.60", oneYearRange: "$77.00 • $80.00" },
    { name: 'Broad Intermediate-Term (5-10 Yr)', ticker: 'BIV', price: 81.20, bondYield: 4.90, todayChange: 0.07, fiveDayChange: 0.22, oneMonthChange: 0.45, threeMonthChange: 0.9, ytdChange: 2.80, oneYearChange: 5.50, threeYearChange: 11.0, fiveYearChange: 22.0, tenYearChange: 48.0, dailyRange: "$81.00 • $81.40", oneYearRange: "$78.50 • $83.50" },
    { name: 'Broad Long-Term (10-25 Yr)', ticker: 'BLV', price: 92.10, bondYield: 5.40, todayChange: -0.18, fiveDayChange: -0.70, oneMonthChange: -1.30, threeMonthChange: -2.8, ytdChange: -0.80, oneYearChange: -3.00, threeYearChange: -7.5, fiveYearChange: 4.5, tenYearChange: 20.0, dailyRange: "$91.80 • $92.40", oneYearRange: "$88.00 • $96.00" },
];

const RangeBar: React.FC<{ range: string, price: number }> = ({ range, price }) => {
    const [lowStr, highStr] = range.split(' • ');
    
    
    const low = parseFloat(lowStr.replace('$', '').trim());
    const high = parseFloat(highStr.replace('$', '').trim());

    const currentPrice = price;

    if (isNaN(low) || isNaN(high) || isNaN(currentPrice) || high === low) {
        return <span className="text-gray-500 text-xs">N/A</span>;
    }

    const rangeValue = high - low;
    let position = 0;
    if (rangeValue > 0) {
        position = ((currentPrice - low) / rangeValue) * 100;
    }
    position = Math.max(0, Math.min(100, position));

    return (
        <div className="flex flex-col w-full text-xs">
            <div className="relative h-2 bg-gray-200 rounded-full my-1 border border-gray-300">
                <div
                    className="absolute top-1/2 w-2 h-2 bg-black rounded-full transition-all duration-300"
                    style={{ left: `${position}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                    title={`Current Price: $${currentPrice.toFixed(2)}`}
                ></div>
            </div>
            <div className="flex justify-between font-medium text-[10px] text-gray-500">
                <span className="truncate">${low.toFixed(2)}</span>
                <span className="truncate">${high.toFixed(2)}</span>
            </div>
        </div>
    );
};

const BondRow: React.FC<CorporateBondData & { isLast?: boolean }> = ({
    name, ticker, price, bondYield, todayChange, fiveDayChange, oneMonthChange,
    threeMonthChange, ytdChange, oneYearChange, threeYearChange,
    dailyRange, oneYearRange, isLast
}) => {
    const isPositive = (value: number) => value >= 0;
    const formatChange = (value: number) => `${isPositive(value) ? '+' : ''}${value.toFixed(2)}%`;
    const changeColor = (value: number) => isPositive(value) ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`grid ${CUSTOM_GRID_COLUMNS} text-sm text-gray-800 py-1 space-x-2 bg-white border-b border-gray-200 hover:bg-gray-100 transition-colors ${isLast ? 'border-b-0' : ''}`}>
            <span className="text-left font-bold text-gray-900">{name}</span>

            <span className="text-left font-medium">
                <Link href={`#${ticker}`} className="text-blue-800 font-bold hover:underline transition-colors">
                    {ticker}
                </Link>
            </span>

            <span className="text-right font-semibold text-gray-900">${price.toFixed(2)}</span>

            <span className="text-right font-semibold text-gray-900">{bondYield.toFixed(2)}%</span>

            <span className={`text-right font-medium ${changeColor(todayChange)}`}>{formatChange(todayChange)}</span>
            <span className={`text-right font-medium ${changeColor(fiveDayChange)}`}>{formatChange(fiveDayChange)}</span>
            <span className={`text-right font-medium ${changeColor(oneMonthChange)}`}>{formatChange(oneMonthChange)}</span>
            <span className={`text-right font-medium ${changeColor(threeMonthChange)}`}>{formatChange(threeMonthChange)}</span>
            <span className={`text-right font-medium ${changeColor(ytdChange)}`}>{formatChange(ytdChange)}</span>
            <span className={`text-right font-medium ${changeColor(oneYearChange)}`}>{formatChange(oneYearChange)}</span>
            <span className={`text-right font-medium ${changeColor(threeYearChange)}`}>{formatChange(threeYearChange)}</span>

            
            <div className="flex justify-end px-3">
                <RangeBar range={dailyRange} price={price} />
            </div>

            <div className="flex justify-end px-3">
                <RangeBar range={oneYearRange} price={price} />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [bonds, setBonds] = useState<CorporateBondData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });    
    const tableContainerRef = useRef<HTMLDivElement>(null); 

    const fetchBonds = async () => {
        setError(null);
        try {
            const response = await fetch('/api/us-bonds');
            if (!response.ok) throw new Error('API error');
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                setBonds(data);
            } else {
                setError('No data returned from API');
                setBonds(mockBonds);
            }
        } catch (err: any) {
            console.error("Failed to fetch US bonds:", err.message);
            setError('Fetch error - using mock data');
            setBonds(mockBonds);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBonds();
        const intervalId = setInterval(fetchBonds, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSort: HandleSort = (key: keyof CorporateBondData) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedBonds = useMemo(() => {
        if (!sortConfig.key) return bonds;
        return [...bonds].sort((a, b) => {
            const aVal = a[sortConfig.key!];
            const bVal = b[sortConfig.key!];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortConfig.direction === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            } else {
                const numA = Number(aVal);
                const numB = Number(bVal);
                return sortConfig.direction === 'asc'
                    ? numA - numB
                    : numB - numA;
            }
        });
    }, [bonds, sortConfig]);

    const scrollTable = (direction: 'left' | 'right') => {
        if (tableContainerRef.current) {
            const container = tableContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; 
            const offset = direction === 'left' ? -scrollAmount : scrollAmount;
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

        const Header = ({ sortConfig, handleSort }: { sortConfig: SortConfig; handleSort: HandleSort }) => {        
            const getSortIndicator = (key: keyof CorporateBondData) => {
            if (sortConfig.key === key) {
                return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
            }
            return '';
        };

        return (
            <div className={`grid ${CUSTOM_GRID_COLUMNS} text-xs font-bold text-gray-600 uppercase border-b border-t border-gray-300 py-3 sticky top-0 z-10`}>
                <button onClick={() => handleSort('name')} className="text-left hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    Name{getSortIndicator('name')}
                </button>
                <button onClick={() => handleSort('ticker')} className="text-left hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    Symbol{getSortIndicator('ticker')}
                </button>
                <button onClick={() => handleSort('price')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    Price{getSortIndicator('price')}
                </button>
                <button onClick={() => handleSort('bondYield')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    Yield{getSortIndicator('bondYield')}
                </button>
                <button onClick={() => handleSort('todayChange')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    Today{getSortIndicator('todayChange')}
                </button>
                <button onClick={() => handleSort('fiveDayChange')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    5 Day{getSortIndicator('fiveDayChange')}
                </button>
                <button onClick={() => handleSort('oneMonthChange')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    1 Month{getSortIndicator('oneMonthChange')}
                </button>
                <button onClick={() => handleSort('threeMonthChange')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    3 Month{getSortIndicator('threeMonthChange')}
                </button>
                <button onClick={() => handleSort('ytdChange')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    YTD{getSortIndicator('ytdChange')}
                </button>
                <button onClick={() => handleSort('oneYearChange')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    1 Year{getSortIndicator('oneYearChange')}
                </button>
                <button onClick={() => handleSort('threeYearChange')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    3 Year{getSortIndicator('threeYearChange')}
                </button>
                <span className="text-right px-5">Day Range</span>
                <span className="text-right px-5">52 Week Range</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full h-full font-sans bg-white overflow-hidden overscroll-contain">
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => scrollTable('left')}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-xl font-bold text-gray-700 focus:outline-none z-10 cursor-pointer"
                    aria-label="Scroll Left"
                >
                    ‹
                </button>
                <button
                    onClick={() => scrollTable('right')}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-xl font-bold text-gray-700 focus:outline-none z-10 cursor-pointer"
                    aria-label="Scroll Right"
                >
                    ›
                </button>
            </div>

            <div 
                ref={tableContainerRef} 
                className={
                        "w-full max-w-full overflow-auto border-gray-300 shadow-inner max-h-[80vh]"
                    }
            >
                <div className="min-w-[1560px]">
                    
                    <Header sortConfig={sortConfig} handleSort={handleSort} />

                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            Loading market data...
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {sortedBonds.map((bond, index) => (
                                <BondRow
                                    key={bond.ticker}
                                    {...bond}
                                    isLast={index === bonds.length - 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App; 