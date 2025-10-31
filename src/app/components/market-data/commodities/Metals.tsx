"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface MetalsData {
    name: string;
    ticker: string;
    price: number;
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

type SortConfig = { key: keyof MetalsData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof MetalsData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockMetals: MetalsData[] = [
        { name: 'Gold', ticker: 'GLD', price: 185.00, todayChange: 0.15, fiveDayChange: 0.75, oneMonthChange: 2.10, threeMonthChange: 3.5, ytdChange: 6.20, oneYearChange: 8.10, threeYearChange: 15.0, fiveYearChange: 40.0, tenYearChange: 80.0, dailyRange: "$184.50 - $185.70", oneYearRange: "$170.00 - $190.00" },
        { name: 'Silver', ticker: 'SLV', price: 22.50, todayChange: -0.55, fiveDayChange: -1.20, oneMonthChange: 1.50, threeMonthChange: 5.2, ytdChange: 12.10, oneYearChange: 18.50, threeYearChange: 35.0, fiveYearChange: 75.0, tenYearChange: 150.0, dailyRange: "$22.30 - $22.70", oneYearRange: "$19.50 - $25.00" },
        { name: 'Platinum', ticker: 'PPLT', price: 98.75, todayChange: 0.88, fiveDayChange: 2.50, oneMonthChange: 4.90, threeMonthChange: -1.5, ytdChange: 3.10, oneYearChange: 5.75, threeYearChange: -12.0, fiveYearChange: 22.0, tenYearChange: 55.0, dailyRange: "$97.90 - $99.10", oneYearRange: "$90.00 - $110.00" },
        { name: 'Palladium', ticker: 'PALL', price: 125.40, todayChange: 1.10, fiveDayChange: 3.50, oneMonthChange: 6.80, threeMonthChange: 8.9, ytdChange: 15.40, oneYearChange: 22.10, threeYearChange: -5.0, fiveYearChange: 30.0, tenYearChange: 70.0, dailyRange: "$124.00 - $126.50", oneYearRange: "$115.00 - $140.00" },
        { name: 'Copper', ticker: 'CPER', price: 30.15, todayChange: -0.20, fiveDayChange: 0.90, oneMonthChange: 3.10, threeMonthChange: 6.5, ytdChange: 10.50, oneYearChange: 15.20, threeYearChange: 28.0, fiveYearChange: 60.0, tenYearChange: 120.0, dailyRange: "$30.00 - $30.40", oneYearRange: "$27.50 - $32.50" },
        { name: 'Lithium ', ticker: 'LIT', price: 45.80, todayChange: 0.70, fiveDayChange: 2.10, oneMonthChange: -1.20, threeMonthChange: -5.5, ytdChange: -10.0, oneYearChange: -18.0, threeYearChange: 50.0, fiveYearChange: 150.0, tenYearChange: 250.0, dailyRange: "$45.50 - $46.20", oneYearRange: "$40.00 - $55.00" },
        { name: 'Metals & Mining', ticker: 'XME', price: 58.20, todayChange: 0.45, fiveDayChange: 1.50, oneMonthChange: 3.50, threeMonthChange: 7.0, ytdChange: 11.0, oneYearChange: 16.0, threeYearChange: 30.0, fiveYearChange: 70.0, tenYearChange: 130.0, dailyRange: "$57.90 - $58.50", oneYearRange: "$50.00 - $65.00" },
        { name: 'Steel', ticker: 'SLX', price: 42.10, todayChange: 0.65, fiveDayChange: 1.90, oneMonthChange: 4.50, threeMonthChange: 9.0, ytdChange: 15.5, oneYearChange: 20.0, threeYearChange: 40.0, fiveYearChange: 95.0, tenYearChange: 150.0, dailyRange: "$41.90 - $42.50", oneYearRange: "$38.00 - $45.00" },
        { name: 'Battery Metals (Amplify Advanced Battery ETF)', ticker: 'BATT', price: 18.50, todayChange: 0.95, fiveDayChange: 3.10, oneMonthChange: 6.20, threeMonthChange: 10.5, ytdChange: 18.0, oneYearChange: 25.0, threeYearChange: 60.0, fiveYearChange: 140.0, tenYearChange: 220.0, dailyRange: "$18.30 - $18.80", oneYearRange: "$16.00 - $20.00" },
    ];

const RangeBar: React.FC<{ range: string, price: number }> = ({ range, price }) => {
    const numbers = range.match(/(\d+\.?\d*)/g); 
    
    let low = NaN;
    let high = NaN;

    if (numbers && numbers.length >= 2) {
        low = parseFloat(numbers[0]);
        high = parseFloat(numbers[1]);
    }
    
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

const EquityRow: React.FC<MetalsData & { isLast?: boolean }> = ({
    name, ticker, price, todayChange, fiveDayChange, oneMonthChange,
    threeMonthChange, ytdChange, oneYearChange, threeYearChange,
    dailyRange, oneYearRange, isLast
}) => {
    const isPositive = (value: number) => value >= 0;
    const formatChange = (value: number) => `${isPositive(value) ? '+' : ''}${value.toFixed(2)}%`;
    const changeColor = (value: number) => isPositive(value) ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`grid ${CUSTOM_GRID_COLUMNS} text-sm text-gray-800 py-1 space-x-2 bg-white border-b border-gray-200 hover:bg-gray-100 transition-colors ${isLast ? 'border-b-0' : ''}`}>
            <span className="text-left font-bold text-gray-900 truncate">{name}</span>

            <span className="text-left font-medium">
                <Link href={`#${ticker}`} className="text-blue-800 font-bold hover:underline transition-colors">
                    {ticker}
                </Link>
            </span>

            <span className="text-right font-semibold text-gray-900">${price.toFixed(2)}</span>

            <span className={`text-right font-medium ${changeColor(todayChange)}`}>{formatChange(todayChange)}</span>
            <span className={`text-right font-medium ${changeColor(fiveDayChange)}`}>{formatChange(fiveDayChange)}</span>
            <span className={`text-right font-medium ${changeColor(oneMonthChange)}`}>{formatChange(oneMonthChange)}</span>
            <span className={`text-right font-medium ${changeColor(threeMonthChange)}`}>{formatChange(threeMonthChange)}</span>
            <span className={`text-right font-medium ${changeColor(ytdChange)}`}>{formatChange(ytdChange)}</span>
            <span className={`text-right font-medium ${changeColor(oneYearChange)}`}>{formatChange(oneYearChange)}</span>
            <span className={`text-right font-medium ${changeColor(threeYearChange)}`}>{formatChange(threeYearChange)}</span>
            
            <div className="flex justify-end px-4">
                <RangeBar range={dailyRange} price={price} />
            </div>

            <div className="flex justify-end px-4">
                <RangeBar range={oneYearRange} price={price} />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [metals, setMetals] = useState<MetalsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });    
    const tableContainerRef = useRef<HTMLDivElement>(null); 

    const fetchMetals = async () => {
        setError(null);
        try {

            const data = mockMetals;

            if (Array.isArray(data) && data.length > 0) {
                setMetals(data);
            } else {
                setError('No data returned from API');
                setMetals(mockMetals);
            }
        } catch (err: any) {
            console.error("Failed to fetch Metals:", err.message);
            setError('Fetch error - using mock data');
            setMetals(mockMetals);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMetals();
        const intervalId = setInterval(fetchMetals, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSort: HandleSort = (key: keyof MetalsData) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedMetals = useMemo(() => {
        if (!sortConfig.key) return metals;
        return [...metals].sort((a, b) => {
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
    }, [metals, sortConfig]);

    const scrollTable = (direction: 'left' | 'right') => {
        if (tableContainerRef.current) {
            const container = tableContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; 
            const offset = direction === 'left' ? -scrollAmount : scrollAmount;
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

        const Header = ({ sortConfig, handleSort }: { sortConfig: SortConfig; handleSort: HandleSort }) => {        
            const getSortIndicator = (key: keyof MetalsData) => {
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
                <div className="min-w-[1470px]">
                    
                    <Header sortConfig={sortConfig} handleSort={handleSort} />

                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            Loading market data...
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {sortedMetals.map((metal, index) => (
                                <EquityRow
                                    key={metal.ticker}
                                    {...metal}
                                    isLast={index === metals.length - 1}
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