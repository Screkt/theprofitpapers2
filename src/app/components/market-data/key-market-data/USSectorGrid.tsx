"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface SectorData {
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
    tenYearRange: number; 
    dailyRange: string;
    oneYearRange: string;
}

type SortConfig = { key: keyof SectorData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof SectorData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockSectors: SectorData[] = [
    { name: 'Technology', ticker: 'XLK', price: 220.5, todayChange: 0.65, fiveDayChange: 4.12, oneMonthChange: 7.45, threeMonthChange: 10.2, ytdChange: 28.90, oneYearChange: 32.15, threeYearChange: 55.8, fiveYearChange: 150.2, tenYearRange: 320.4, dailyRange: "219.20 • 222.10", oneYearRange: "165.80 • 225.30" },
    { name: 'Communication Services', ticker: 'XLC', price: 95.2, todayChange: 0.42, fiveDayChange: 2.88, oneMonthChange: 5.67, threeMonthChange: 7.1, ytdChange: 22.34, oneYearChange: 24.76, threeYearChange: 35.2, fiveYearChange: 85.9, tenYearRange: 180.5, dailyRange: "94.80 • 96.00", oneYearRange: "75.40 • 97.20" },
    { name: 'Financials', ticker: 'XLF', price: 45.8, todayChange: 0.35, fiveDayChange: 1.95, oneMonthChange: 4.23, threeMonthChange: 6.3, ytdChange: 18.67, oneYearChange: 20.45, threeYearChange: 28.1, fiveYearChange: 65.4, tenYearRange: 140.8, dailyRange: "45.60 • 46.10", oneYearRange: "36.50 • 46.70" },
    { name: 'Healthcare', ticker: 'XLV', price: 150.3, todayChange: 0.28, fiveDayChange: 1.22, oneMonthChange: 3.89, threeMonthChange: 5.4, ytdChange: 15.82, oneYearChange: 17.23, threeYearChange: 22.9, fiveYearChange: 70.5, tenYearRange: 130.2, dailyRange: "149.90 • 151.20", oneYearRange: "135.10 • 152.40" },
    { name: 'Consumer Discretionary', ticker: 'XLY', price: 195.7, todayChange: -0.15, fiveDayChange: 0.78, oneMonthChange: 2.34, threeMonthChange: 4.1, ytdChange: 12.56, oneYearChange: 14.88, threeYearChange: 18.7, fiveYearChange: 55.3, tenYearRange: 110.6, dailyRange: "195.20 • 196.50", oneYearRange: "160.30 • 198.20" },
    { name: 'Industrials', ticker: 'XLI', price: 135.4, todayChange: 0.12, fiveDayChange: 1.05, oneMonthChange: 2.67, threeMonthChange: 3.8, ytdChange: 11.45, oneYearChange: 13.02, threeYearChange: 16.4, fiveYearChange: 48.7, tenYearRange: 95.1, dailyRange: "135.00 • 136.10", oneYearRange: "115.80 • 137.20" },
    { name: 'Real Estate', ticker: 'XLRE', price: 42.1, todayChange: -0.22, fiveDayChange: 0.45, oneMonthChange: 1.89, threeMonthChange: 2.9, ytdChange: 8.23, oneYearChange: 9.67, threeYearChange: 12.5, fiveYearChange: 35.2, tenYearRange: 70.4, dailyRange: "41.90 • 42.40", oneYearRange: "35.60 • 43.10" },
    { name: 'Utilities', ticker: 'XLU', price: 78.6, todayChange: 0.08, fiveDayChange: 0.67, oneMonthChange: 1.45, threeMonthChange: 2.2, ytdChange: 7.89, oneYearChange: 8.34, threeYearChange: 10.8, fiveYearChange: 25.6, tenYearRange: 50.3, dailyRange: "78.40 • 79.00", oneYearRange: "68.20 • 80.50" },
    { name: 'Materials', ticker: 'XLB', price: 92.3, todayChange: -0.31, fiveDayChange: -0.23, oneMonthChange: 0.78, threeMonthChange: 1.5, ytdChange: 5.12, oneYearChange: 6.45, threeYearChange: 9.2, fiveYearChange: 30.1, tenYearRange: 65.7, dailyRange: "91.80 • 92.70", oneYearRange: "82.40 • 94.10" },
    { name: 'Consumer Staples', ticker: 'XLP', price: 82.4, todayChange: -0.05, fiveDayChange: 0.34, oneMonthChange: 1.12, threeMonthChange: 1.8, ytdChange: 4.67, oneYearChange: 5.23, threeYearChange: 7.5, fiveYearChange: 20.8, tenYearRange: 45.2, dailyRange: "82.20 • 82.80", oneYearRange: "75.30 • 84.00" },
    { name: 'Energy', ticker: 'XLE', price: 88.7, todayChange: -0.48, fiveDayChange: -1.45, oneMonthChange: -2.34, threeMonthChange: -0.5, ytdChange: 2.89, oneYearChange: 4.12, threeYearChange: 5.6, fiveYearChange: 15.3, tenYearRange: 35.8, dailyRange: "88.20 • 89.40", oneYearRange: "78.50 • 91.20" },
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

const SectorRow: React.FC<SectorData & { isLast?: boolean }> = ({
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
    const [sectors, setSectors] = useState<SectorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });    
    const tableContainerRef = useRef<HTMLDivElement>(null); 

    const fetchSectors = async () => {
        setError(null);
        try {

            const data = mockSectors;

            if (Array.isArray(data) && data.length > 0) {
                setSectors(data);
            } else {
                setError('No data returned from API');
                setSectors(mockSectors);
            }
        } catch (err: any) {
            console.error("Failed to fetch US sectors:", err.message);
            setError('Fetch error - using mock data');
            setSectors(mockSectors);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSectors();
        const intervalId = setInterval(fetchSectors, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSort: HandleSort = (key: keyof SectorData) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSectors = useMemo(() => {
        if (!sortConfig.key) return sectors;
        return [...sectors].sort((a, b) => {
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
    }, [sectors, sortConfig]);

    const scrollTable = (direction: 'left' | 'right') => {
        if (tableContainerRef.current) {
            const container = tableContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; 
            const offset = direction === 'left' ? -scrollAmount : scrollAmount;
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

        const Header = ({ sortConfig, handleSort }: { sortConfig: SortConfig; handleSort: HandleSort }) => {        
            const getSortIndicator = (key: keyof SectorData) => {
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
                            Loading sector data...
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {sortedSectors.map((sector, index) => (
                                <SectorRow
                                    key={sector.ticker}
                                    {...sector}
                                    isLast={index === sectors.length - 1}
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