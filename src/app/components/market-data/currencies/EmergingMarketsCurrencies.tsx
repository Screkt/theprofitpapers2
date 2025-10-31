"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

const Link = ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
    </a>
);

interface CurrencyData {
    name: string;
    ticker: string;
    rate: number;
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

type SortConfig = { key: keyof CurrencyData | null; direction: 'asc' | 'desc' };
type HandleSort = (key: keyof CurrencyData) => void;

const CUSTOM_GRID_COLUMNS = "grid-cols-[260px_80px_90px_90px_90px_90px_90px_90px_90px_90px_200px_200px]";

const mockCurrencies: CurrencyData[] = [
  { name: 'EUR/USD', ticker: 'O:EURUSD', rate: 1.085, todayChange: 0.12, fiveDayChange: 0.65, oneMonthChange: 1.40, threeMonthChange: 2.1, ytdChange: 4.25, oneYearChange: 6.10, threeYearChange: 8.5, fiveYearChange: 15.3, tenYearChange: 22.8, dailyRange: "1.081 • 1.088", oneYearRange: "1.045 • 1.115" },
  { name: 'USD/JPY', ticker: 'O:USDJPY', rate: 148.25, todayChange: -0.08, fiveDayChange: 0.35, oneMonthChange: 0.80, threeMonthChange: 1.5, ytdChange: 3.75, oneYearChange: 6.20, threeYearChange: 12.8, fiveYearChange: 25.1, tenYearChange: 38.4, dailyRange: "147.80 • 148.70", oneYearRange: "138.00 • 151.50" },
  { name: 'GBP/USD', ticker: 'O:GBPUSD', rate: 1.268, todayChange: 0.10, fiveDayChange: 0.50, oneMonthChange: 1.10, threeMonthChange: 1.8, ytdChange: 3.10, oneYearChange: 5.25, threeYearChange: 9.4, fiveYearChange: 18.6, tenYearChange: 30.2, dailyRange: "1.263 • 1.272", oneYearRange: "1.205 • 1.285" },
  { name: 'USD/CHF', ticker: 'O:USDCHF', rate: 0.905, todayChange: -0.06, fiveDayChange: -0.20, oneMonthChange: 0.45, threeMonthChange: 0.9, ytdChange: 2.00, oneYearChange: 3.25, threeYearChange: 7.1, fiveYearChange: 14.8, tenYearChange: 20.9, dailyRange: "0.902 • 0.908", oneYearRange: "0.875 • 0.925" },
  { name: 'AUD/USD', ticker: 'O:AUDUSD', rate: 0.658, todayChange: 0.05, fiveDayChange: 0.40, oneMonthChange: 1.05, threeMonthChange: 2.3, ytdChange: 3.50, oneYearChange: 5.60, threeYearChange: 10.5, fiveYearChange: 19.8, tenYearChange: 29.1, dailyRange: "0.654 • 0.660", oneYearRange: "0.630 • 0.675" },
  { name: 'USD/CAD', ticker: 'O:USDCAD', rate: 1.357, todayChange: -0.03, fiveDayChange: 0.20, oneMonthChange: 0.75, threeMonthChange: 1.2, ytdChange: 2.65, oneYearChange: 4.10, threeYearChange: 8.2, fiveYearChange: 16.4, tenYearChange: 25.7, dailyRange: "1.354 • 1.360", oneYearRange: "1.315 • 1.382" },
  { name: 'NZD/USD', ticker: 'O:NZDUSD', rate: 0.610, todayChange: 0.07, fiveDayChange: 0.50, oneMonthChange: 1.30, threeMonthChange: 2.8, ytdChange: 4.00, oneYearChange: 6.25, threeYearChange: 9.8, fiveYearChange: 18.5, tenYearChange: 26.0, dailyRange: "0.606 • 0.613", oneYearRange: "0.585 • 0.635" },
  { name: 'EUR/JPY', ticker: 'O:EURJPY', rate: 160.85, todayChange: 0.09, fiveDayChange: 0.55, oneMonthChange: 1.15, threeMonthChange: 2.4, ytdChange: 5.10, oneYearChange: 7.80, threeYearChange: 13.4, fiveYearChange: 27.9, tenYearChange: 41.5, dailyRange: "160.20 • 161.10", oneYearRange: "149.00 • 163.50" },
  { name: 'GBP/JPY', ticker: 'O:GBPJPY', rate: 188.30, todayChange: 0.15, fiveDayChange: 0.75, oneMonthChange: 1.45, threeMonthChange: 3.0, ytdChange: 5.90, oneYearChange: 9.20, threeYearChange: 16.3, fiveYearChange: 30.8, tenYearChange: 48.6, dailyRange: "187.70 • 188.90", oneYearRange: "175.50 • 190.10" },
  { name: 'EUR/GBP', ticker: 'O:EURGBP', rate: 0.855, todayChange: 0.01, fiveDayChange: 0.10, oneMonthChange: 0.35, threeMonthChange: 0.8, ytdChange: 1.20, oneYearChange: 2.15, threeYearChange: 4.4, fiveYearChange: 7.8, tenYearChange: 11.3, dailyRange: "0.852 • 0.857", oneYearRange: "0.840 • 0.870" },
  { name: 'EUR/CHF', ticker: 'O:EURCHF', rate: 0.982, todayChange: 0.02, fiveDayChange: 0.25, oneMonthChange: 0.70, threeMonthChange: 1.3, ytdChange: 2.40, oneYearChange: 3.90, threeYearChange: 6.9, fiveYearChange: 13.7, tenYearChange: 19.5, dailyRange: "0.980 • 0.984", oneYearRange: "0.950 • 0.990" },
  { name: 'AUD/JPY', ticker: 'O:AUDJPY', rate: 97.50, todayChange: 0.12, fiveDayChange: 0.65, oneMonthChange: 1.50, threeMonthChange: 2.7, ytdChange: 4.70, oneYearChange: 8.00, threeYearChange: 14.6, fiveYearChange: 28.9, tenYearChange: 45.3, dailyRange: "97.00 • 97.80", oneYearRange: "90.20 • 99.10" },
];

const RangeBar: React.FC<{ range: string, rate: number }> = ({ range, rate }) => {
    const [lowStr, highStr] = range.split(' • ');
    const low = parseFloat(lowStr);
    const high = parseFloat(highStr);
    const currentRate = rate;

    if (isNaN(low) || isNaN(high) || isNaN(currentRate) || high === low) {
        return <span className="text-gray-500 text-xs">N/A</span>;
    }

    const rangeValue = high - low;
    let position = 0;
    if (rangeValue > 0) {
        position = ((currentRate - low) / rangeValue) * 100;
    }
    position = Math.max(0, Math.min(100, position));

    return (
        <div className="flex flex-col w-full text-xs">
            <div className="relative h-2 bg-gray-200 rounded-full my-1 border border-gray-300">
                <div
                    className="absolute top-1/2 w-2 h-2 bg-black rounded-full transition-all duration-300"
                    style={{ left: `${position}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                    title={`Current Rate: $${currentRate.toFixed(3)}`}
                ></div>
            </div>
            <div className="flex justify-between font-medium text-[10px] text-gray-500">
                <span className="truncate">${low.toFixed(3)}</span>
                <span className="truncate">${high.toFixed(3)}</span>
            </div>
        </div>
    );
};

const CurrencyRow: React.FC<CurrencyData & { isLast?: boolean }> = ({
    name, ticker, rate, todayChange, fiveDayChange, oneMonthChange,
    threeMonthChange, ytdChange, oneYearChange, threeYearChange,
    dailyRange, oneYearRange, isLast
}) => {
    const isPositive = (value: number) => value >= 0;
    const formatChange = (value: number) => `${isPositive(value) ? '+' : ''}${value.toFixed(3)}%`;
    const changeColor = (value: number) => isPositive(value) ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`grid ${CUSTOM_GRID_COLUMNS} text-sm text-gray-800 py-1 space-x-2 bg-white border-b border-gray-200 hover:bg-gray-100 transition-colors ${isLast ? 'border-b-0' : ''}`}>
            <span className="text-left font-bold text-gray-900 truncate">{name}</span>

            <span className="text-left font-medium">
                <Link href={`#${ticker}`} className="text-blue-800 font-bold hover:underline transition-colors">
                    {ticker}
                </Link>
            </span>

            <span className="text-right font-semibold text-gray-900">${rate.toFixed(3)}</span>

            <span className={`text-right font-medium ${changeColor(todayChange)}`}>{formatChange(todayChange)}</span>
            <span className={`text-right font-medium ${changeColor(fiveDayChange)}`}>{formatChange(fiveDayChange)}</span>
            <span className={`text-right font-medium ${changeColor(oneMonthChange)}`}>{formatChange(oneMonthChange)}</span>
            <span className={`text-right font-medium ${changeColor(threeMonthChange)}`}>{formatChange(threeMonthChange)}</span>
            <span className={`text-right font-medium ${changeColor(ytdChange)}`}>{formatChange(ytdChange)}</span>
            <span className={`text-right font-medium ${changeColor(oneYearChange)}`}>{formatChange(oneYearChange)}</span>
            <span className={`text-right font-medium ${changeColor(threeYearChange)}`}>{formatChange(threeYearChange)}</span>
            
            <div className="flex justify-end px-4">
                <RangeBar range={dailyRange} rate={rate} />
            </div>

            <div className="flex justify-end px-4">
                <RangeBar range={oneYearRange} rate={rate} />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });    
    const tableContainerRef = useRef<HTMLDivElement>(null); 

    const fetchCurrencies = async () => {
        setError(null);
        try {

            const data = mockCurrencies;

            if (Array.isArray(data) && data.length > 0) {
                setCurrencies(data);
            } else {
                setError('No data returned from API');
                setCurrencies(mockCurrencies);
            }
        } catch (err: any) {
            console.error("Failed to fetch currencies:", err.message);
            setError('Fetch error - using mock data');
            setCurrencies(mockCurrencies);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
        const intervalId = setInterval(fetchCurrencies, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSort: HandleSort = (key: keyof CurrencyData) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedCurrencies = useMemo(() => {
        if (!sortConfig.key) return currencies;
        return [...currencies].sort((a, b) => {
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
    }, [currencies, sortConfig]);

    const scrollTable = (direction: 'left' | 'right') => {
        if (tableContainerRef.current) {
            const container = tableContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; 
            const offset = direction === 'left' ? -scrollAmount : scrollAmount;
            container.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

        const Header = ({ sortConfig, handleSort }: { sortConfig: SortConfig; handleSort: HandleSort }) => {        
            const getSortIndicator = (key: keyof CurrencyData) => {
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
                <button onClick={() => handleSort('rate')} className="text-right hover:bg-gray-200 px-1 rounded cursor-pointer transition-colors">
                    Rate{getSortIndicator('rate')}
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
                <span className="text-right px-6">Day Range</span>
                <span className="text-right px-6">52 Week Range</span>
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
                            Loading currency data...
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {sortedCurrencies.map((currency, index) => (
                                <CurrencyRow
                                    key={currency.ticker}
                                    {...currency}
                                    isLast={index === currencies.length - 1}
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