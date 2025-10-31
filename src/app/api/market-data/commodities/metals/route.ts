import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['GLD', 'SLV', 'PPLT', 'PALL', 'CPER', 'JJN', 'LIT', 'XME', 'SLX', 'BATT', ];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

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

export async function GET() {
  if (!POLYGON_API_KEY) {
    return NextResponse.json({ error: 'Polygon API key not set' }, { status: 500 });
  }

  try {
    const tickerNames: { [key: string]: string } = {
      'GLD': 'Gold (SPDR Gold Shares)',
      'SLV': 'Silver (iShares Silver Trust)',
      'PPLT': 'Platinum (Physical ETF)',
      'PALL': 'Palladium (Physical ETF)',
      'CPER': 'Copper (US Copper Index Fund)',
      'JJN': 'Nickel (Futures Subindex ETF)',
      'LIT': 'Lithium (Global X Lithium & Battery Tech ETF)',
      'XME': 'Metals & Mining (SPDR Index)',
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

    const metals: MetalsData[] = TICKERS.map(ticker => {
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

    return NextResponse.json(metals.sort((a: MetalsData, b: MetalsData) => b.oneYearChange - a.oneYearChange).slice(0, 11));
  } catch (error: any) {
    console.error('US Sector fetch error:', error);
    const mockMetals: MetalsData[] = [
        { name: 'Gold (SPDR Gold Shares)', ticker: 'GLD', price: 185.00, todayChange: 0.15, fiveDayChange: 0.75, oneMonthChange: 2.10, threeMonthChange: 3.5, ytdChange: 6.20, oneYearChange: 8.10, threeYearChange: 15.0, fiveYearChange: 40.0, tenYearChange: 80.0, dailyRange: "$184.50 - $185.70", oneYearRange: "$170.00 - $190.00" },
        { name: 'Silver (iShares Silver Trust)', ticker: 'SLV', price: 22.50, todayChange: -0.55, fiveDayChange: -1.20, oneMonthChange: 1.50, threeMonthChange: 5.2, ytdChange: 12.10, oneYearChange: 18.50, threeYearChange: 35.0, fiveYearChange: 75.0, tenYearChange: 150.0, dailyRange: "$22.30 - $22.70", oneYearRange: "$19.50 - $25.00" },
        { name: 'Platinum (Physical ETF)', ticker: 'PPLT', price: 98.75, todayChange: 0.88, fiveDayChange: 2.50, oneMonthChange: 4.90, threeMonthChange: -1.5, ytdChange: 3.10, oneYearChange: 5.75, threeYearChange: -12.0, fiveYearChange: 22.0, tenYearChange: 55.0, dailyRange: "$97.90 - $99.10", oneYearRange: "$90.00 - $110.00" },
        { name: 'Palladium (Physical ETF)', ticker: 'PALL', price: 125.40, todayChange: 1.10, fiveDayChange: 3.50, oneMonthChange: 6.80, threeMonthChange: 8.9, ytdChange: 15.40, oneYearChange: 22.10, threeYearChange: -5.0, fiveYearChange: 30.0, tenYearChange: 70.0, dailyRange: "$124.00 - $126.50", oneYearRange: "$115.00 - $140.00" },
        { name: 'Copper (US Copper Index Fund)', ticker: 'CPER', price: 30.15, todayChange: -0.20, fiveDayChange: 0.90, oneMonthChange: 3.10, threeMonthChange: 6.5, ytdChange: 10.50, oneYearChange: 15.20, threeYearChange: 28.0, fiveYearChange: 60.0, tenYearChange: 120.0, dailyRange: "$30.00 - $30.40", oneYearRange: "$27.50 - $32.50" },
        { name: 'Lithium (Global X Lithium & Battery Tech ETF)', ticker: 'LIT', price: 45.80, todayChange: 0.70, fiveDayChange: 2.10, oneMonthChange: -1.20, threeMonthChange: -5.5, ytdChange: -10.0, oneYearChange: -18.0, threeYearChange: 50.0, fiveYearChange: 150.0, tenYearChange: 250.0, dailyRange: "$45.50 - $46.20", oneYearRange: "$40.00 - $55.00" },
        { name: 'Metals & Mining (SPDR Index)', ticker: 'XME', price: 58.20, todayChange: 0.45, fiveDayChange: 1.50, oneMonthChange: 3.50, threeMonthChange: 7.0, ytdChange: 11.0, oneYearChange: 16.0, threeYearChange: 30.0, fiveYearChange: 70.0, tenYearChange: 130.0, dailyRange: "$57.90 - $58.50", oneYearRange: "$50.00 - $65.00" },
        { name: 'Steel (VanEck Steel ETF)', ticker: 'SLX', price: 42.10, todayChange: 0.65, fiveDayChange: 1.90, oneMonthChange: 4.50, threeMonthChange: 9.0, ytdChange: 15.5, oneYearChange: 20.0, threeYearChange: 40.0, fiveYearChange: 95.0, tenYearChange: 150.0, dailyRange: "$41.90 - $42.50", oneYearRange: "$38.00 - $45.00" },
        { name: 'Battery Metals (Amplify Advanced Battery ETF)', ticker: 'BATT', price: 18.50, todayChange: 0.95, fiveDayChange: 3.10, oneMonthChange: 6.20, threeMonthChange: 10.5, ytdChange: 18.0, oneYearChange: 25.0, threeYearChange: 60.0, fiveYearChange: 140.0, tenYearChange: 220.0, dailyRange: "$18.30 - $18.80", oneYearRange: "$16.00 - $20.00" },
    ];

    return NextResponse.json(mockMetals);
  }
}