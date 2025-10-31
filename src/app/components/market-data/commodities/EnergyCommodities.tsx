"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface EnergyCommoditiesData {
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

type SortConfig = { key: keyof EnergyCommoditiesData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof EnergyCommoditiesData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockEnergyCommodities: EnergyCommoditiesData[] = [
        { name: 'Crude Oil (WTI)', ticker: 'USO', price: 78.50, todayChange: 0.85, fiveDayChange: 2.12, oneMonthChange: 5.45, threeMonthChange: 12.2, ytdChange: 18.90, oneYearChange: 25.15, threeYearChange: 45.8, fiveYearChange: 110.2, tenYearChange: 90.4, dailyRange: "$77.50 - $79.10", oneYearRange: "$65.80 - $85.30" },
        { name: 'Natural Gas', ticker: 'UNG', price: 18.25, todayChange: -1.20, fiveDayChange: -4.88, oneMonthChange: -9.67, threeMonthChange: -15.1, ytdChange: -8.34, oneYearChange: -20.76, threeYearChange: 35.2, fiveYearChange: 85.9, tenYearChange: 180.5, dailyRange: "$18.05 - $18.50", oneYearRange: "$15.40 - $25.20" },
        { name: 'Gasoline', ticker: 'UGA', price: 65.10, todayChange: 0.40, fiveDayChange: 1.55, oneMonthChange: 3.23, threeMonthChange: 7.3, ytdChange: 10.67, oneYearChange: 14.45, threeYearChange: 28.1, fiveYearChange: 65.4, tenYearChange: 140.8, dailyRange: "$64.80 - $65.50", oneYearRange: "$55.50 - $67.70" },
        { name: 'Crude Oil (Brent)', ticker: 'BNO', price: 83.90, todayChange: 0.65, fiveDayChange: 2.00, oneMonthChange: 4.89, threeMonthChange: 11.4, ytdChange: 17.82, oneYearChange: 23.23, threeYearChange: 40.9, fiveYearChange: 105.5, tenYearChange: 85.2, dailyRange: "$83.00 - $84.50", oneYearRange: "$68.10 - $87.40" },
        { name: 'Heating Oil', ticker: 'UHN', price: 55.40, todayChange: 0.22, fiveDayChange: 0.78, oneMonthChange: 2.34, threeMonthChange: 5.1, ytdChange: 8.56, oneYearChange: 10.88, threeYearChange: 18.7, fiveYearChange: 55.3, tenYearChange: 110.6, dailyRange: "Low $55.10 - High $55.70", oneYearRange: "Low $48.30 - High $57.20" },
        { name: 'Gold', ticker: 'GLD', price: 185.00, todayChange: 0.15, fiveDayChange: 0.75, oneMonthChange: 2.10, threeMonthChange: 3.5, ytdChange: 6.20, oneYearChange: 8.10, threeYearChange: 15.0, fiveYearChange: 40.0, tenYearChange: 80.0, dailyRange: "$184.50 - $185.70", oneYearRange: "$170.00 - $190.00" },
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

const EquityRow: React.FC<EnergyCommoditiesData & { isLast?: boolean }> = ({
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
    const [energyCommodities, setEnergyCommodities] = useState<EnergyCommoditiesData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });    
    const tableContainerRef = useRef<HTMLDivElement>(null); 

    const fetchEnergyCommodities = async () => {
        setError(null);
        try {

            const data = mockEnergyCommodities;

            if (Array.isArray(data) && data.length > 0) {
                setEnergyCommodities(data);
            } else {
                setError('No data returned from API');
                setEnergyCommodities(mockEnergyCommodities);
            }
        } catch (err: any) {
            console.error("Failed to fetch Energy Commodities:", err.message);
            setError('Fetch error - using mock data');
            setEnergyCommodities(mockEnergyCommodities);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnergyCommodities();
        const intervalId = setInterval(fetchEnergyCommodities, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSort: HandleSort = (key: keyof EnergyCommoditiesData) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedEnergyCommodities = useMemo(() => {
        if (!sortConfig.key) return energyCommodities;
        return [...energyCommodities].sort((a, b) => {
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
    }, [energyCommodities, sortConfig]);

    const scrollTable = (direction: 'left' | 'right') => {
        if (tableContainerRef.current) {
            const container = tableContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; 
            const offset = direction === 'left' ? -scrollAmount : scrollAmount;
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

        const Header = ({ sortConfig, handleSort }: { sortConfig: SortConfig; handleSort: HandleSort }) => {        
            const getSortIndicator = (key: keyof EnergyCommoditiesData) => {
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
                            {sortedEnergyCommodities.map((commodity, index) => (
                                <EquityRow
                                    key={commodity.ticker}
                                    {...commodity}
                                    isLast={index === energyCommodities.length - 1}
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