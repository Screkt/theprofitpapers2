"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface USBondData {
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

type SortConfig = { key: keyof USBondData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof USBondData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockBonds: USBondData[] = [
    { name: '6 Month', ticker: 'TBIL', price: 100.1, bondYield: 4.80, todayChange: 0.02, fiveDayChange: 0.10, oneMonthChange: 0.20, threeMonthChange: 0.40, ytdChange: 2.80, oneYearChange: 5.20, threeYearChange: 10.5, fiveYearChange: 22.1, tenYearChange: 48.3, dailyRange: "100.05 • 100.15", oneYearRange: "99.50 • 100.50" },
    { name: '1 Year', ticker: 'SHY', price: 82.1, bondYield: 4.60, todayChange: 0.05, fiveDayChange: 0.20, oneMonthChange: 0.40, threeMonthChange: 0.8, ytdChange: 2.50, oneYearChange: 3.10, threeYearChange: 5.2, fiveYearChange: 12.4, tenYearChange: 25.7, dailyRange: "81.90 • 82.30", oneYearRange: "80.50 • 83.20" },
    { name: '2 Year', ticker: 'IEI', price: 95.4, bondYield: 4.20, todayChange: -0.08, fiveDayChange: -0.40, oneMonthChange: -0.70, threeMonthChange: -1.5, ytdChange: -1.20, oneYearChange: -2.80, threeYearChange: -6.1, fiveYearChange: 5.3, tenYearChange: 18.9, dailyRange: "95.20 • 95.70", oneYearRange: "92.10 • 98.50" },
    { name: '5 Year', ticker: 'IEF', price: 95.8, bondYield: 4.00, todayChange: -0.12, fiveDayChange: -0.60, oneMonthChange: -1.00, threeMonthChange: -2.0, ytdChange: -2.50, oneYearChange: -4.20, threeYearChange: -8.5, fiveYearChange: 2.1, tenYearChange: 16.4, dailyRange: "95.50 • 96.10", oneYearRange: "93.20 • 99.80" },
    { name: '10 Year', ticker: 'VGIT', price: 58.3, bondYield: 3.90, todayChange: -0.10, fiveDayChange: -0.50, oneMonthChange: -0.80, threeMonthChange: -1.8, ytdChange: -3.00, oneYearChange: -5.00, threeYearChange: -10.2, fiveYearChange: -1.5, tenYearChange: 12.8, dailyRange: "58.10 • 58.50", oneYearRange: "55.40 • 61.20" },
    { name: '20 Year', ticker: 'TLT', price: 92.5, bondYield: 4.30, todayChange: -0.15, fiveDayChange: -0.80, oneMonthChange: -1.20, threeMonthChange: -2.5, ytdChange: -3.10, oneYearChange: -5.40, threeYearChange: 18.7, fiveYearChange: -8.5, tenYearChange: 15.3, dailyRange: "92.10 • 93.00", oneYearRange: "85.20 • 100.50" },
    { name: '30 Year', ticker: 'EDV', price: 68.7, bondYield: 4.40, todayChange: -0.20, fiveDayChange: -1.00, oneMonthChange: -1.50, threeMonthChange: -3.0, ytdChange: -4.20, oneYearChange: -6.80, threeYearChange: -15.1, fiveYearChange: -12.3, tenYearChange: 10.5, dailyRange: "68.40 • 69.00", oneYearRange: "62.50 • 75.80" },
    { name: 'Total (1-30 Yr)', ticker: 'GOVT', price: 22.4, bondYield: 4.10, todayChange: -0.03, fiveDayChange: -0.20, oneMonthChange: -0.40, threeMonthChange: -0.9, ytdChange: -1.50, oneYearChange: -3.00, threeYearChange: -7.0, fiveYearChange: 4.2, tenYearChange: 20.1, dailyRange: "22.35 • 22.45", oneYearRange: "21.80 • 23.50" },
];

const RangeBar: React.FC<{ range: string, price: number }> = ({ range, price }) => {
    const [lowStr, highStr] = range.split(' • ');
    const low = parseFloat(lowStr);
    const high = parseFloat(highStr);
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

const BondRow: React.FC<USBondData & { isLast?: boolean }> = ({
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
    const [bonds, setBonds] = useState<USBondData[]>([]);
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

    const handleSort: HandleSort = (key: keyof USBondData) => {
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
            const getSortIndicator = (key: keyof USBondData) => {
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