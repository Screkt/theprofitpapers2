"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface EquityData {
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

type SortConfig = { key: keyof EquityData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof EquityData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockEquities: EquityData[] = [
    { name: 'S&P 500', ticker: 'SPY', price: 520.25, todayChange: 0.28, fiveDayChange: 2.28, oneMonthChange: 3.81, threeMonthChange: 5.2, ytdChange: 17.23, oneYearChange: 18.29, threeYearChange: 25.4, fiveYearChange: 80.1, tenYearChange: 150.2, dailyRange: "518.80 • 521.37", oneYearRange: "400.32 • 522.41" },
    { name: 'NASDAQ 100', ticker: 'QQQ', price: 450.8, todayChange: 0.48, fiveDayChange: 3.66, oneMonthChange: 6.20, threeMonthChange: 8.5, ytdChange: 23.80, oneYearChange: 27.76, threeYearChange: 40.1, fiveYearChange: 120.3, tenYearChange: 250.8, dailyRange: "448.57 • 451.70", oneYearRange: "350.80 • 452.91" },
    { name: 'DJIA', ticker: 'DIA', price: 380.5, todayChange: 0.48, fiveDayChange: 2.11, oneMonthChange: 3.22, threeMonthChange: 4.8, ytdChange: 12.14, oneYearChange: 12.52, threeYearChange: 20.3, fiveYearChange: 50.7, tenYearChange: 100.4, dailyRange: "379.03 • 381.00", oneYearRange: "320.39 • 382.68" },
    { name: 'Mid Cap', ticker: 'MDY', price: 500.3, todayChange: -0.10, fiveDayChange: 0.03, oneMonthChange: 0.47, threeMonthChange: 1.8, ytdChange: 5.25, oneYearChange: 4.54, threeYearChange: 10.5, fiveYearChange: 45.2, tenYearChange: 90.1, dailyRange: "498.70 • 501.82", oneYearRange: "410.22 • 502.61" },
    { name: 'Small Cap', ticker: 'IJR', price: 110.7, todayChange: -0.41, fiveDayChange: 0.30, oneMonthChange: 1.67, threeMonthChange: 3.2, ytdChange: 4.54, oneYearChange: 3.66, threeYearChange: 8.9, fiveYearChange: 35.8, tenYearChange: 70.5, dailyRange: "109.35 • 111.88", oneYearRange: "95.25 • 112.95" },
    { name: 'Micro Cap', ticker: 'IWC', price: 130.2, todayChange: -0.05, fiveDayChange: 1.33, oneMonthChange: 5.68, threeMonthChange: 7.1, ytdChange: 20.82, oneYearChange: 21.86, threeYearChange: 30.4, fiveYearChange: 60.2, tenYearChange: 120.8, dailyRange: "128.80 • 131.37", oneYearRange: "105.32 • 132.41" },
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

const EquityRow: React.FC<EquityData & { isLast?: boolean }> = ({
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
    const [equities, setEquities] = useState<EquityData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });    
    const tableContainerRef = useRef<HTMLDivElement>(null); 

    const fetchEquities = async () => {
        setError(null);
        try {

            const data = mockEquities;

            if (Array.isArray(data) && data.length > 0) {
                setEquities(data);
            } else {
                setError('No data returned from API');
                setEquities(mockEquities);
            }
        } catch (err: any) {
            console.error("Failed to fetch US equities:", err.message);
            setError('Fetch error - using mock data');
            setEquities(mockEquities);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEquities();
        const intervalId = setInterval(fetchEquities, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSort: HandleSort = (key: keyof EquityData) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedEquities = useMemo(() => {
        if (!sortConfig.key) return equities;
        return [...equities].sort((a, b) => {
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
    }, [equities, sortConfig]);

    const scrollTable = (direction: 'left' | 'right') => {
        if (tableContainerRef.current) {
            const container = tableContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; 
            const offset = direction === 'left' ? -scrollAmount : scrollAmount;
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

        const Header = ({ sortConfig, handleSort }: { sortConfig: SortConfig; handleSort: HandleSort }) => {        
            const getSortIndicator = (key: keyof EquityData) => {
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
                            {sortedEquities.map((equity, index) => (
                                <EquityRow
                                    key={equity.ticker}
                                    {...equity}
                                    isLast={index === equities.length - 1}
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