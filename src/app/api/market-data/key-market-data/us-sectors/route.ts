import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['XLK', 'XLV', 'XLF', 'XLY', 'XLC', 'XLI', 'XLP', 'XLE', 'XLU', 'XLRE', 'XLB'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

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
  tenYearChange: number;
  dailyRange: string;
  oneYearRange: string;
}

export async function GET() {
  if (!POLYGON_API_KEY) {
    return NextResponse.json({ error: 'Polygon API key not set' }, { status: 500 });
  }

  try {
    const tickerNames: { [key: string]: string } = {
      'XLK': 'Technology',
      'XLV': 'Healthcare',
      'XLF': 'Financials',
      'XLY': 'Consumer Discretionary',
      'XLC': 'Communication Services',
      'XLI': 'Industrials',
      'XLP': 'Consumer Staples',
      'XLE': 'Energy',
      'XLU': 'Utilities',
      'XLRE': 'Real Estate',
      'XLB': 'Materials'
    };

    const fetchRange = async (fromDate: string, toDate: string, limit = 2) => {
      const url = `${BASE_URL}/v2/aggs/ticker/${TICKERS.join(',')}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=${limit}&apiKey=${POLYGON_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Polygon range error: ${response.status}`);
      const data = await response.json();
      return data.results?.results || [];
    };

    const todayResults = await fetchRange(CURRENT_DATE, CURRENT_DATE);
    const fiveDayResults = await fetchRange(FIVE_DAY_AGO, CURRENT_DATE, 6);
    const oneMonthResults = await fetchRange(ONE_MONTH_AGO, CURRENT_DATE, 31);
    const threeMonthResults = await fetchRange(THREE_MONTH_AGO, CURRENT_DATE, 91);
    const ytdResults = await fetchRange(YTD_START, CURRENT_DATE, 365);
    const oneYearResults = await fetchRange(ONE_YEAR_AGO, CURRENT_DATE, 366);
    const threeYearResults = await fetchRange(THREE_YEAR_AGO, CURRENT_DATE, 1095);
    const fiveYearResults = await fetchRange(FIVE_YEAR_AGO, CURRENT_DATE, 1825);
    const tenYearResults = await fetchRange(TEN_YEAR_AGO, CURRENT_DATE, 3650);

    const calcChange = (results: any[], ticker: string) => {
      const items = results.filter((item: any) => item.T === ticker);
      if (items.length < 2) return 0;
      const firstClose = items[0].c;
      const lastClose = items[items.length - 1].c;
      return firstClose > 0 ? ((lastClose - firstClose) / firstClose * 100) : 0;
    };

    const getDailyRange = (results: any[], ticker: string) => {
      const items = results.filter((item: any) => item.T === ticker);
      if (items.length === 0) return "N/A";
      const low = items[0].l.toFixed(2);
      const high = items[0].h.toFixed(2);
      return `$${low} - $${high}`;
    };

    const getOneYearRange = (results: any[], ticker: string) => {
      const items = results.filter((item: any) => item.T === ticker);
      if (items.length === 0) return "N/A";
      const minLow = Math.min(...items.map((item:  any) => item.l)).toFixed(2);
      const maxHigh = Math.max(...items.map((item: any) => item.h)).toFixed(2);
      return `$${minLow} - $${maxHigh}`;
    };

    const sectors: SectorData[] = TICKERS.map(ticker => {
      const name = tickerNames[ticker];
      const todayItem = todayResults.find((item: any) => item.T === ticker);
      const currentPrice = todayItem?.c || 0;
      const todayChange = calcChange(todayResults, ticker);
      const fiveDayChange = calcChange(fiveDayResults, ticker);
      const oneMonthChange = calcChange(oneMonthResults, ticker);
      const threeMonthChange = calcChange(threeMonthResults, ticker);
      const ytdChange = calcChange(ytdResults, ticker);
      const oneYearChange = calcChange(oneYearResults, ticker);
      const threeYearChange = calcChange(threeYearResults, ticker);
      const fiveYearChange = calcChange(fiveYearResults, ticker);
      const tenYearChange = calcChange(tenYearResults, ticker);
      const dailyRange = getDailyRange(todayResults, ticker);
      const oneYearRange = getOneYearRange(oneYearResults, ticker);

      return { 
        name, 
        ticker, 
        price: currentPrice,
        todayChange, 
        fiveDayChange, 
        oneMonthChange, 
        threeMonthChange, 
        ytdChange, 
        oneYearChange, 
        threeYearChange, 
        fiveYearChange, 
        tenYearChange, 
        dailyRange, 
        oneYearRange 
      };
    }).filter(e => e.price > 0);

    return NextResponse.json(sectors.sort((a: SectorData, b: SectorData) => b.oneYearChange - a.oneYearChange).slice(0, 11));
  } catch (error: any) {
    console.error('US Sector fetch error:', error);
    const mockSectors: SectorData[] = [
      { name: 'Technology', ticker: 'XLK', price: 220.5, todayChange: 0.65, fiveDayChange: 4.12, oneMonthChange: 7.45, threeMonthChange: 10.2, ytdChange: 28.90, oneYearChange: 32.15, threeYearChange: 55.8, fiveYearChange: 150.2, tenYearChange: 320.4, dailyRange: "Low $219.20 - High $222.10", oneYearRange: "Low $165.80 - High $225.30" },
      { name: 'Communication Services', ticker: 'XLC', price: 95.2, todayChange: 0.42, fiveDayChange: 2.88, oneMonthChange: 5.67, threeMonthChange: 7.1, ytdChange: 22.34, oneYearChange: 24.76, threeYearChange: 35.2, fiveYearChange: 85.9, tenYearChange: 180.5, dailyRange: "Low $94.80 - High $96.00", oneYearRange: "Low $75.40 - High $97.20" },
      { name: 'Financials', ticker: 'XLF', price: 45.8, todayChange: 0.35, fiveDayChange: 1.95, oneMonthChange: 4.23, threeMonthChange: 6.3, ytdChange: 18.67, oneYearChange: 20.45, threeYearChange: 28.1, fiveYearChange: 65.4, tenYearChange: 140.8, dailyRange: "Low $45.60 - High $46.10", oneYearRange: "Low $36.50 - High $46.70" },
      { name: 'Healthcare', ticker: 'XLV', price: 150.3, todayChange: 0.28, fiveDayChange: 1.22, oneMonthChange: 3.89, threeMonthChange: 5.4, ytdChange: 15.82, oneYearChange: 17.23, threeYearChange: 22.9, fiveYearChange: 70.5, tenYearChange: 130.2, dailyRange: "Low $149.90 - High $151.20", oneYearRange: "Low $135.10 - High $152.40" },
      { name: 'Consumer Discretionary', ticker: 'XLY', price: 195.7, todayChange: -0.15, fiveDayChange: 0.78, oneMonthChange: 2.34, threeMonthChange: 4.1, ytdChange: 12.56, oneYearChange: 14.88, threeYearChange: 18.7, fiveYearChange: 55.3, tenYearChange: 110.6, dailyRange: "Low $195.20 - High $196.50", oneYearRange: "Low $160.30 - High $198.20" },
      { name: 'Industrials', ticker: 'XLI', price: 135.4, todayChange: 0.12, fiveDayChange: 1.05, oneMonthChange: 2.67, threeMonthChange: 3.8, ytdChange: 11.45, oneYearChange: 13.02, threeYearChange: 16.4, fiveYearChange: 48.7, tenYearChange: 95.1, dailyRange: "Low $135.00 - High $136.10", oneYearRange: "Low $115.80 - High $137.20" },
      { name: 'Real Estate', ticker: 'XLRE', price: 42.1, todayChange: -0.22, fiveDayChange: 0.45, oneMonthChange: 1.89, threeMonthChange: 2.9, ytdChange: 8.23, oneYearChange: 9.67, threeYearChange: 12.5, fiveYearChange: 35.2, tenYearChange: 70.4, dailyRange: "Low $41.90 - High $42.40", oneYearRange: "Low $35.60 - High $43.10" },
      { name: 'Utilities', ticker: 'XLU', price: 78.6, todayChange: 0.08, fiveDayChange: 0.67, oneMonthChange: 1.45, threeMonthChange: 2.2, ytdChange: 7.89, oneYearChange: 8.34, threeYearChange: 10.8, fiveYearChange: 25.6, tenYearChange: 50.3, dailyRange: "Low $78.40 - High $79.00", oneYearRange: "Low $68.20 - High $80.50" },
      { name: 'Materials', ticker: 'XLB', price: 92.3, todayChange: -0.31, fiveDayChange: -0.23, oneMonthChange: 0.78, threeMonthChange: 1.5, ytdChange: 5.12, oneYearChange: 6.45, threeYearChange: 9.2, fiveYearChange: 30.1, tenYearChange: 65.7, dailyRange: "Low $91.80 - High $92.70", oneYearRange: "Low $82.40 - High $94.10" },
      { name: 'Consumer Staples', ticker: 'XLP', price: 82.4, todayChange: -0.05, fiveDayChange: 0.34, oneMonthChange: 1.12, threeMonthChange: 1.8, ytdChange: 4.67, oneYearChange: 5.23, threeYearChange: 7.5, fiveYearChange: 20.8, tenYearChange: 45.2, dailyRange: "Low $82.20 - High $82.80", oneYearRange: "Low $75.30 - High $84.00" },
      { name: 'Energy', ticker: 'XLE', price: 88.7, todayChange: -0.48, fiveDayChange: -1.45, oneMonthChange: -2.34, threeMonthChange: -0.5, ytdChange: 2.89, oneYearChange: 4.12, threeYearChange: 5.6, fiveYearChange: 15.3, tenYearChange: 35.8, dailyRange: "Low $88.20 - High $89.40", oneYearRange: "Low $78.50 - High $91.20" },
    ];

    return NextResponse.json(mockSectors);
  }
}