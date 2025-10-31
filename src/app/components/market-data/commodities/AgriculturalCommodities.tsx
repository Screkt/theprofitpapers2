"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface AgriculturalCommodities {
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

type SortConfig = { key: keyof AgriculturalCommodities | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof AgriculturalCommodities) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockAgricultural: AgriculturalCommodities[] = [
        { name: 'Broad Agriculture (Invesco DB Ag Fund)', ticker: 'DBA', price: 21.50, todayChange: 0.25, fiveDayChange: 1.10, oneMonthChange: 2.50, threeMonthChange: 5.0, ytdChange: 8.0, oneYearChange: 12.0, threeYearChange: 25.0, fiveYearChange: 45.0, tenYearChange: 70.0, dailyRange: "$21.30 - $21.80", oneYearRange: "$19.00 - $23.50" },
        { name: 'Corn', ticker: 'CORN', price: 23.80, todayChange: 0.80, fiveDayChange: 3.50, oneMonthChange: 6.00, threeMonthChange: -2.0, ytdChange: -5.0, oneYearChange: -15.0, threeYearChange: 30.0, fiveYearChange: 60.0, tenYearChange: 90.0, dailyRange: "$23.50 - $24.10", oneYearRange: "$22.00 - $28.00" },
        { name: 'Soybeans', ticker: 'SOYB', price: 27.10, todayChange: -0.15, fiveDayChange: 0.50, oneMonthChange: 1.80, threeMonthChange: 4.5, ytdChange: 7.5, oneYearChange: 10.0, threeYearChange: 20.0, fiveYearChange: 50.0, tenYearChange: 85.0, dailyRange: "$27.00 - $27.30", oneYearRange: "$24.00 - $30.00" },
        { name: 'Wheat', ticker: 'WEAT', price: 7.95, todayChange: 1.50, fiveDayChange: 4.20, oneMonthChange: 8.50, threeMonthChange: 1.0, ytdChange: 3.0, oneYearChange: 5.50, threeYearChange: 15.0, fiveYearChange: 35.0, tenYearChange: 65.0, dailyRange: "$7.80 - $8.05", oneYearRange: "$7.00 - $9.00" },
        { name: 'Sugar', ticker: 'CANE', price: 32.40, todayChange: 0.65, fiveDayChange: 2.10, oneMonthChange: 4.00, threeMonthChange: 9.0, ytdChange: 15.0, oneYearChange: 22.0, threeYearChange: 40.0, fiveYearChange: 90.0, tenYearChange: 180.0, dailyRange: "$32.10 - $32.80", oneYearRange: "$28.00 - $35.00" },
        { name: 'Livestock', ticker: 'COW', price: 35.15, todayChange: -0.30, fiveDayChange: -0.50, oneMonthChange: 0.50, threeMonthChange: 3.0, ytdChange: 6.0, oneYearChange: 9.0, threeYearChange: 18.0, fiveYearChange: 40.0, tenYearChange: 75.0, dailyRange: "$35.00 - $35.50", oneYearRange: "$32.00 - $37.00" },
        { name: 'Cotton ', ticker: 'BAL', price: 68.20, todayChange: 0.90, fiveDayChange: 3.00, oneMonthChange: 5.50, threeMonthChange: 10.0, ytdChange: 16.0, oneYearChange: 24.0, threeYearChange: 50.0, fiveYearChange: 120.0, tenYearChange: 200.0, dailyRange: "$67.80 - $68.50", oneYearRange: "$60.00 - $72.00" },
        { name: 'Cocoa', ticker: 'NIB', price: 40.90, todayChange: 1.20, fiveDayChange: 4.50, oneMonthChange: 9.00, threeMonthChange: 18.0, ytdChange: 35.0, oneYearChange: 60.0, threeYearChange: 150.0, fiveYearChange: 250.0, tenYearChange: 400.0, dailyRange: "$40.50 - $41.30", oneYearRange: "$30.00 - $45.00" },
        { name: 'Coffee ', ticker: 'JO', price: 29.50, todayChange: 0.10, fiveDayChange: 0.80, oneMonthChange: 1.50, threeMonthChange: 3.5, ytdChange: 5.5, oneYearChange: 8.0, threeYearChange: 20.0, fiveYearChange: 50.0, tenYearChange: 95.0, dailyRange: "$29.30 - $29.70", oneYearRange: "$26.00 - $32.00" },
        { name: 'Agribusiness (VanEck Agribusiness ETF - Stocks)', ticker: 'MOO', price: 55.70, todayChange: 0.45, fiveDayChange: 1.50, oneMonthChange: 3.00, threeMonthChange: 7.0, ytdChange: 11.0, oneYearChange: 16.0, threeYearChange: 30.0, fiveYearChange: 65.0, tenYearChange: 120.0, dailyRange: "$55.50 - $56.00", oneYearRange: "$50.00 - $60.00" },
        { name: 'Teucrium Agricultural Fund', ticker: 'TAGS', price: 34.00, todayChange: 0.30, fiveDayChange: 1.20, oneMonthChange: 2.80, threeMonthChange: 5.5, ytdChange: 9.0, oneYearChange: 14.0, threeYearChange: 27.0, fiveYearChange: 55.0, tenYearChange: 100.0, dailyRange: "$33.80 - $34.30", oneYearRange: "$30.00 - $37.00" },
        { name: 'RICI Agriculture ETN', ticker: 'RJA', price: 25.60, todayChange: 0.50, fiveDayChange: 2.00, oneMonthChange: 4.50, threeMonthChange: 8.0, ytdChange: 12.0, oneYearChange: 18.0, threeYearChange: 35.0, fiveYearChange: 70.0, tenYearChange: 130.0, dailyRange: "$25.40 - $25.90", oneYearRange: "$22.00 - $28.00" },
        { name: 'Grains Subindex', ticker: 'PST', price: 15.20, todayChange: 0.70, fiveDayChange: 2.50, oneMonthChange: 5.00, threeMonthChange: 9.5, ytdChange: 14.0, oneYearChange: 20.0, threeYearChange: 45.0, fiveYearChange: 85.0, tenYearChange: 150.0, dailyRange: "$15.00 - $15.40", oneYearRange: "$13.00 - $17.00" },
        { name: 'Rice', ticker: 'RICE', price: 12.50, todayChange: 0.20, fiveDayChange: 1.00, oneMonthChange: 2.00, threeMonthChange: 4.0, ytdChange: 7.0, oneYearChange: 10.0, threeYearChange: 25.0, fiveYearChange: 55.0, tenYearChange: 105.0, dailyRange: "$12.40 - $12.60", oneYearRange: "$11.00 - $14.00" },
        { name: 'US Agriculture Index Fund', ticker: 'USAG', price: 44.50, todayChange: 0.40, fiveDayChange: 1.60, oneMonthChange: 3.20, threeMonthChange: 6.5, ytdChange: 10.0, oneYearChange: 15.0, threeYearChange: 30.0, fiveYearChange: 60.0, tenYearChange: 115.0, dailyRange: "$44.30 - $44.80", oneYearRange: "$40.00 - $47.00" },
        { name: 'Teucrium Ag Strategy No K-1 ETF', ticker: 'TILL', price: 30.00, todayChange: 0.55, fiveDayChange: 2.20, oneMonthChange: 4.50, threeMonthChange: 8.5, ytdChange: 14.0, oneYearChange: 21.0, threeYearChange: 45.0, fiveYearChange: 95.0, tenYearChange: 160.0, dailyRange: "$29.80 - $30.40", oneYearRange: "$26.00 - $33.00" },
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

const EquityRow: React.FC<AgriculturalCommodities & { isLast?: boolean }> = ({
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
    const [energyCommodities, setEnergyCommodities] = useState<AgriculturalCommodities[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });    
    const tableContainerRef = useRef<HTMLDivElement>(null); 

    const fetchEnergyCommodities = async () => {
        setError(null);
        try {

            const data = mockAgricultural;

            if (Array.isArray(data) && data.length > 0) {
                setEnergyCommodities(data);
            } else {
                setError('No data returned from API');
                setEnergyCommodities(mockAgricultural);
            }
        } catch (err: any) {
            console.error("Failed to fetch Energy Commodities:", err.message);
            setError('Fetch error - using mock data');
            setEnergyCommodities(mockAgricultural);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnergyCommodities();
        const intervalId = setInterval(fetchEnergyCommodities, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSort: HandleSort = (key: keyof AgriculturalCommodities) => {
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
            const getSortIndicator = (key: keyof AgriculturalCommodities) => {
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
                        "w-full max-w-full overflow-x-auto overflow-y-hidden border-gray-300 shadow-inner max-h-[80vh]"
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