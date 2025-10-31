"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface MunicipalBondData {
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

type SortConfig = { key: keyof MunicipalBondData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof MunicipalBondData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockBonds: MunicipalBondData[] = [
    { name: 'National IG (Broad)', ticker: 'VTEB', price: 50.85, bondYield: 2.85, todayChange: 0.04, fiveDayChange: 0.11, oneMonthChange: 0.25, threeMonthChange: 0.5, ytdChange: 1.20, oneYearChange: 2.50, threeYearChange: 5.5, fiveYearChange: 10.0, tenYearChange: 22.0, dailyRange: "$50.75 • $50.95", oneYearRange: "$49.50 • $51.50" },
    { name: 'National IG Intermediate', ticker: 'MUB', price: 109.10, bondYield: 2.95, todayChange: 0.05, fiveDayChange: 0.15, oneMonthChange: 0.35, threeMonthChange: 0.7, ytdChange: 1.50, oneYearChange: 2.80, threeYearChange: 6.0, fiveYearChange: 11.0, tenYearChange: 24.0, dailyRange: "$108.90 • $109.30", oneYearRange: "$107.00 • $110.50" },
    { name: 'National IG Short-Term', ticker: 'SUB', price: 105.20, bondYield: 2.50, todayChange: 0.02, fiveDayChange: 0.08, oneMonthChange: 0.15, threeMonthChange: 0.3, ytdChange: 0.90, oneYearChange: 2.00, threeYearChange: 4.5, fiveYearChange: 9.0, tenYearChange: 18.0, dailyRange: "$105.15 • $105.25", oneYearRange: "$104.50 • $105.50" },
    { name: 'High Yield National', ticker: 'PZA', price: 92.50, bondYield: 4.50, todayChange: -0.05, fiveDayChange: -0.10, oneMonthChange: -0.25, threeMonthChange: -0.5, ytdChange: 0.80, oneYearChange: 3.20, threeYearChange: 7.0, fiveYearChange: 14.0, tenYearChange: 28.0, dailyRange: "$92.40 • $92.65", oneYearRange: "$89.00 • $94.00" },
    { name: 'High Yield Long-Term', ticker: 'HYD', price: 59.90, bondYield: 4.75, todayChange: -0.07, fiveDayChange: -0.15, oneMonthChange: -0.30, threeMonthChange: -0.6, ytdChange: 0.50, oneYearChange: 3.00, threeYearChange: 6.5, fiveYearChange: 13.0, tenYearChange: 26.0, dailyRange: "$59.80 • $60.00", oneYearRange: "$57.50 • $61.50" },
    { name: 'California IG', ticker: 'CMF', price: 54.30, bondYield: 2.70, todayChange: 0.03, fiveDayChange: 0.10, oneMonthChange: 0.20, threeMonthChange: 0.4, ytdChange: 1.10, oneYearChange: 2.20, threeYearChange: 5.0, fiveYearChange: 9.5, tenYearChange: 20.0, dailyRange: "$54.25 • $54.40", oneYearRange: "$53.00 • $55.00" },
    { name: 'New York IG', ticker: 'NYF', price: 57.80, bondYield: 2.65, todayChange: 0.02, fiveDayChange: 0.09, oneMonthChange: 0.18, threeMonthChange: 0.35, ytdChange: 1.00, oneYearChange: 2.10, threeYearChange: 4.8, fiveYearChange: 9.2, tenYearChange: 19.5, dailyRange: "$57.70 • $57.90", oneYearRange: "$56.50 • $58.50" },
    { name: 'Intermediate MF (VWIUX)', ticker: 'VWIUX', price: 11.55, bondYield: 3.05, todayChange: 0.04, fiveDayChange: 0.12, oneMonthChange: 0.28, threeMonthChange: 0.55, ytdChange: 1.30, oneYearChange: 2.60, threeYearChange: 5.8, fiveYearChange: 10.5, tenYearChange: 23.0, dailyRange: "$11.50 • $11.60", oneYearRange: "$11.20 • $11.80" },
    { name: 'Short-Term MF (VMLUX)', ticker: 'VMLUX', price: 10.50, bondYield: 2.40, todayChange: 0.01, fiveDayChange: 0.05, oneMonthChange: 0.10, threeMonthChange: 0.2, ytdChange: 0.70, oneYearChange: 1.80, threeYearChange: 4.0, fiveYearChange: 8.5, tenYearChange: 17.0, dailyRange: "$10.49 • $10.51", oneYearRange: "$10.40 • $10.60" },
    { name: 'Long-Term MF (VWALX)', ticker: 'VWALX', price: 13.20, bondYield: 3.20, todayChange: 0.06, fiveDayChange: 0.18, oneMonthChange: 0.40, threeMonthChange: 0.8, ytdChange: 1.80, oneYearChange: 3.50, threeYearChange: 7.5, fiveYearChange: 14.5, tenYearChange: 30.0, dailyRange: "$13.15 • $13.25", oneYearRange: "$12.50 • $14.00" },
    { name: 'Taxable Muni (TMLF)', ticker: 'TMLF', price: 48.10, bondYield: 4.90, todayChange: 0.09, fiveDayChange: 0.20, oneMonthChange: 0.45, threeMonthChange: 1.0, ytdChange: 2.50, oneYearChange: 5.00, threeYearChange: 10.0, fiveYearChange: 20.0, tenYearChange: 45.0, dailyRange: "$48.00 • $48.20", oneYearRange: "$46.00 • $50.00" },
    { name: 'Intermediate Muni (SPDR)', ticker: 'TFI', price: 54.15, bondYield: 3.10, todayChange: 0.04, fiveDayChange: 0.14, oneMonthChange: 0.30, threeMonthChange: 0.65, ytdChange: 1.60, oneYearChange: 2.90, threeYearChange: 6.2, fiveYearChange: 11.5, tenYearChange: 25.0, dailyRange: "$54.00 • $54.25", oneYearRange: "$52.50 • $55.00" },
    { name: 'Short Duration HY Muni', ticker: 'SHYD', price: 23.50, bondYield: 4.85, todayChange: -0.01, fiveDayChange: -0.05, oneMonthChange: -0.15, threeMonthChange: -0.3, ytdChange: 1.50, oneYearChange: 3.80, threeYearChange: 8.0, fiveYearChange: 15.0, tenYearChange: 32.0, dailyRange: "$23.45 • $23.55", oneYearRange: "$22.80 • $24.00" },
    { name: 'Short Term Muni (SPDR)', ticker: 'SHM', price: 47.90, bondYield: 2.35, todayChange: 0.02, fiveDayChange: 0.07, oneMonthChange: 0.14, threeMonthChange: 0.25, ytdChange: 0.85, oneYearChange: 1.90, threeYearChange: 4.3, fiveYearChange: 8.8, tenYearChange: 17.5, dailyRange: "$47.85 • $47.95", oneYearRange: "$47.50 • $48.20" },
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

const BondRow: React.FC<MunicipalBondData & { isLast?: boolean }> = ({
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
    const [bonds, setBonds] = useState<MunicipalBondData[]>([]);
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

    const handleSort: HandleSort = (key: keyof MunicipalBondData) => {
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
            const getSortIndicator = (key: keyof MunicipalBondData) => {
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