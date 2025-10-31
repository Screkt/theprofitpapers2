"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface CommodityETFData {
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

type SortConfig = { key: keyof CommodityETFData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof CommodityETFData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockCommodityETFs: CommodityETFData[] = [
    { name: 'Gold bullion (SPDR)', ticker: 'GLD', price: 185.00, todayChange: 0.20, fiveDayChange: 0.90, oneMonthChange: 2.15, threeMonthChange: 3.60, ytdChange: 6.50, oneYearChange: 8.25, threeYearChange: 15.2, fiveYearChange: 40.5, tenYearChange: 82.0, dailyRange: "$184.50 - $185.70", oneYearRange: "$170.00 - $190.00" },
    { name: 'Broad commodities index (iShares)', ticker: 'GSG', price: 25.40, todayChange: 0.10, fiveDayChange: 0.50, oneMonthChange: 1.20, threeMonthChange: 2.50, ytdChange: 4.80, oneYearChange: 6.90, threeYearChange: 18.5, fiveYearChange: 35.2, tenYearChange: 70.0, dailyRange: "$25.10 - $25.60", oneYearRange: "$20.50 - $27.30" },
    { name: 'Commodity futures strategy (iShares)', ticker: 'COMT', price: 32.75, todayChange: -0.05, fiveDayChange: 0.15, oneMonthChange: 0.80, threeMonthChange: 1.90, ytdChange: 3.25, oneYearChange: 5.10, threeYearChange: 14.0, fiveYearChange: 28.0, tenYearChange: 60.0, dailyRange: "$32.50 - $33.00", oneYearRange: "$28.20 - $34.80" },
    { name: 'Natural resources & commodities (SPDR)', ticker: 'GNR', price: 42.10, todayChange: 0.30, fiveDayChange: 1.20, oneMonthChange: 2.90, threeMonthChange: 5.00, ytdChange: 9.00, oneYearChange: 12.50, threeYearChange: 25.0, fiveYearChange: 50.5, tenYearChange: 95.0, dailyRange: "$41.80 - $42.40", oneYearRange: "$35.00 - $45.60" },
    { name: 'Metals & mining producers (iShares)', ticker: 'PICK', price: 110.25, todayChange: 1.10, fiveDayChange: 2.50, oneMonthChange: 5.20, threeMonthChange: 10.5, ytdChange: 15.75, oneYearChange: 20.0, threeYearChange: 45.5, fiveYearChange: 90.0, tenYearChange: 180.0, dailyRange: "$109.00 - $111.20", oneYearRange: "$95.50 - $115.80" },
    { name: 'Actively managed commodities (Vanguard)', ticker: 'VCMDX', price: 28.40, todayChange: 0.25, fiveDayChange: 0.95, oneMonthChange: 2.10, threeMonthChange: 4.30, ytdChange: 7.25, oneYearChange: 9.80, threeYearChange: 20.0, fiveYearChange: 38.5, tenYearChange: 75.0, dailyRange: "$28.10 - $28.70", oneYearRange: "$24.50 - $30.50" },
    { name: 'Gasoline futures (United States Commodity Funds, LLC)', ticker: 'UGA', price: 65.10, todayChange: 0.40, fiveDayChange: 1.55, oneMonthChange: 3.23, threeMonthChange: 7.3, ytdChange: 10.67, oneYearChange: 14.45, threeYearChange: 28.1, fiveYearChange: 65.4, tenYearChange: 140.8, dailyRange: "$64.80 - $65.50", oneYearRange: "$55.50 - $67.70" },
    { name: 'Natural gas futures (United States Commodity Funds, LLC)', ticker: 'UNG', price: 18.25, todayChange: -1.20, fiveDayChange: -4.88, oneMonthChange: -9.67, threeMonthChange: -15.1, ytdChange: -8.34, oneYearChange: -20.76, threeYearChange: 35.2, fiveYearChange: 85.9, tenYearChange: 180.5, dailyRange: "$18.05 - $18.50", oneYearRange: "$15.40 - $25.20" },
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

const EquityRow: React.FC<CommodityETFData & { isLast?: boolean }> = ({
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
    const [energyCommodities, setEnergyCommodities] = useState<CommodityETFData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });    
    const tableContainerRef = useRef<HTMLDivElement>(null); 

    const fetchEnergyCommodities = async () => {
        setError(null);
        try {

            const data = mockCommodityETFs;

            if (Array.isArray(data) && data.length > 0) {
                setEnergyCommodities(data);
            } else {
                setError('No data returned from API');
                setEnergyCommodities(mockCommodityETFs);
            }
        } catch (err: any) {
            console.error("Failed to fetch Energy Commodities:", err.message);
            setError('Fetch error - using mock data');
            setEnergyCommodities(mockCommodityETFs);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnergyCommodities();
        const intervalId = setInterval(fetchEnergyCommodities, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSort: HandleSort = (key: keyof CommodityETFData) => {
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
            const getSortIndicator = (key: keyof CommodityETFData) => {
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