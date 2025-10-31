import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['GLD', 'GSG', 'COMT', 'GNR', 'PICK', 'VCMDX', 'UGA', 'UNG'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

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

export async function GET() {
  if (!POLYGON_API_KEY) {
    return NextResponse.json({ error: 'Polygon API key not set' }, { status: 500 });
  }

  try {
    const tickerNames: { [key: string]: string } = {
    'GLD': 'Gold bullion (SPDR)',
    'GSG': 'Broad commodities index (iShares)',
    'COMT': 'Commodity futures strategy (iShares)',
    'GNR': 'Natural resources & commodities (SPDR)',
    'PICK': 'Metals & mining producers (iShares)',
    'VCMDX': 'Actively managed commodities (Vanguard)',
    'UGA': 'Gasoline - United States Commodity Funds)',
    'UNG': 'Natural gas - United States Commodity Funds)',
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

    const energyCommodities: CommodityETFData[] = TICKERS.map(ticker => {
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

    return NextResponse.json(energyCommodities.sort((a: CommodityETFData, b: CommodityETFData) => b.oneYearChange - a.oneYearChange).slice(0, 11));
  } catch (error: any) {
    console.error('US Sector fetch error:', error);
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

    return NextResponse.json(mockCommodityETFs);
  }
}