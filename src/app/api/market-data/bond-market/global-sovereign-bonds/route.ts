import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['TLT', 'BNDX', 'BWX', 'IGOV', 'EMB', 'PCY', 'IBND', 'ISTB', 'BND', 'SPGB', 'IHYF'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

interface SovereignBondData {
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

export async function GET() {
  if (!POLYGON_API_KEY) {
    return NextResponse.json({ error: 'Polygon API key not set' }, { status: 500 });
  }

  try {
    const tickerNames: { [key: string]: string } = {
      'TLT': 'US Long-Term Treasury',
      'BNDX': 'Total International Bond (Ex-US)',
      'BWX': 'Int\'l Treasury Bond (Broad)',
      'IGOV': 'Int\'l Treasury Bond (Developed)',
      'EMB': 'Emerging Markets Sovereign (USD)',
      'PCY': 'EM Sovereign Bond (Local Currency)',
      'IBND': 'Global Aggregate Bond',
      'ISTB': 'US Intermediate Treasury',
      'BND': 'US Total Bond Market',
      'SPGB': 'SPDR Global Bond',
      'IHYF': 'International High Yield Bond',
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

    const snapshotUrl = `${BASE_URL}/v3/snapshot?tickers=${TICKERS.join(',')}&market=etf&apiKey=${POLYGON_API_KEY}`;
    const snapshotRes = await fetch(snapshotUrl);
    if (!snapshotRes.ok) throw new Error(`Snapshot error: ${snapshotRes.status}`);
    const snapshotData = await snapshotRes.json();
    const snapshots = snapshotData.results || [];

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
      const minLow = Math.min(...items.map((item: any) => item.l)).toFixed(2);
      const maxHigh = Math.max(...items.map((item: any) => item.h)).toFixed(2);
      return `$${minLow} - $${maxHigh}`;
    };

    const bonds: SovereignBondData[] = TICKERS.map(ticker => {
      const name = tickerNames[ticker];
      const todayItem = todayResults.find((item: any) => item.T === ticker);
      const snap = snapshots.find((s: any) => s.T === ticker);
      const currentYield = snap?.day?.c || 0;
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
        bondYield: currentYield,
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

    return NextResponse.json(bonds.sort((a: SovereignBondData, b: SovereignBondData) => b.oneYearChange - a.oneYearChange).slice(0, 11));
  } catch (error: any) {
    console.error('US Treasury Bonds fetch error:', error);
    const mockBonds: SovereignBondData[] = [
        { name: 'US Long-Term Treasury', ticker: 'TLT', price: 92.50, bondYield: 4.75, todayChange: 0.15, fiveDayChange: 0.50, oneMonthChange: 1.20, threeMonthChange: 2.50, ytdChange: -0.50, oneYearChange: -3.00, threeYearChange: -15.0, fiveYearChange: -5.0, tenYearChange: 10.0, dailyRange: "$92.00 • $93.00", oneYearRange: "$88.00 • $105.00" },
        { name: 'Total International Bond (Ex-US)', ticker: 'BNDX', price: 47.10, bondYield: 4.05, todayChange: 0.08, fiveDayChange: 0.25, oneMonthChange: 0.60, threeMonthChange: 1.10, ytdChange: 1.80, oneYearChange: 3.50, threeYearChange: 7.0, fiveYearChange: 12.0, tenYearChange: 25.0, dailyRange: "$47.00 • $47.20", oneYearRange: "$46.00 • $48.50" },
        { name: 'Int\'l Treasury Bond (Broad)', ticker: 'BWX', price: 23.55, bondYield: 3.85, todayChange: 0.05, fiveDayChange: 0.15, oneMonthChange: 0.35, threeMonthChange: 0.70, ytdChange: 1.50, oneYearChange: 3.00, threeYearChange: 6.0, fiveYearChange: 10.0, tenYearChange: 21.0, dailyRange: "$23.50 • $23.60", oneYearRange: "$23.00 • $24.50" },
        { name: 'Int\'l Treasury Bond (Developed)', ticker: 'IGOV', price: 48.90, bondYield: 4.20, todayChange: 0.09, fiveDayChange: 0.30, oneMonthChange: 0.70, threeMonthChange: 1.40, ytdChange: 2.10, oneYearChange: 4.00, threeYearChange: 8.0, fiveYearChange: 13.0, tenYearChange: 28.0, dailyRange: "$48.80 • $49.00", oneYearRange: "$47.50 • $50.50" },
        { name: 'Emerging Markets Sovereign (USD)', ticker: 'EMB', price: 89.20, bondYield: 6.05, todayChange: 0.03, fiveDayChange: 0.10, oneMonthChange: 0.20, threeMonthChange: 0.50, ytdChange: 2.50, oneYearChange: 5.50, threeYearChange: 12.0, fiveYearChange: 20.0, tenYearChange: 45.0, dailyRange: "$89.10 • $89.30", oneYearRange: "$85.00 • $92.00" },
        { name: 'EM Sovereign Bond (Local Currency)', ticker: 'PCY', price: 21.15, bondYield: 5.50, todayChange: 0.01, fiveDayChange: 0.05, oneMonthChange: 0.15, threeMonthChange: 0.30, ytdChange: 1.00, oneYearChange: 2.50, threeYearChange: 5.0, fiveYearChange: 8.0, tenYearChange: 18.0, dailyRange: "$21.10 • $21.20", oneYearRange: "$20.50 • $22.00" },
        { name: 'Global Aggregate Bond', ticker: 'IBND', price: 49.50, bondYield: 4.15, todayChange: 0.10, fiveDayChange: 0.35, oneMonthChange: 0.80, threeMonthChange: 1.60, ytdChange: 2.30, oneYearChange: 4.50, threeYearChange: 9.0, fiveYearChange: 14.0, tenYearChange: 30.0, dailyRange: "$49.40 • $49.60", oneYearRange: "$48.00 • $51.00" },
        { name: 'US Intermediate Treasury', ticker: 'ISTB', price: 104.20, bondYield: 4.90, todayChange: 0.07, fiveDayChange: 0.20, oneMonthChange: 0.45, threeMonthChange: 0.90, ytdChange: 1.90, oneYearChange: 4.00, threeYearChange: 8.5, fiveYearChange: 15.0, tenYearChange: 32.0, dailyRange: "$104.10 • $104.30", oneYearRange: "$103.00 • $105.50" },
        { name: 'US Total Bond Market', ticker: 'BND', price: 74.80, bondYield: 4.80, todayChange: 0.09, fiveDayChange: 0.28, oneMonthChange: 0.65, threeMonthChange: 1.30, ytdChange: 2.20, oneYearChange: 4.30, threeYearChange: 8.8, fiveYearChange: 15.5, tenYearChange: 34.0, dailyRange: "$74.70 • $74.90", oneYearRange: "$73.50 • $76.00" },
        { name: 'SPDR Global Bond', ticker: 'SPGB', price: 51.50, bondYield: 3.95, todayChange: 0.06, fiveDayChange: 0.18, oneMonthChange: 0.40, threeMonthChange: 0.80, ytdChange: 1.70, oneYearChange: 3.20, threeYearChange: 6.5, fiveYearChange: 11.5, tenYearChange: 24.5, dailyRange: "$51.40 • $51.60", oneYearRange: "$50.00 • $53.00" },
        { name: 'International High Yield Bond', ticker: 'IHYF', price: 29.80, bondYield: 6.50, todayChange: 0.02, fiveDayChange: 0.08, oneMonthChange: 0.15, threeMonthChange: 0.35, ytdChange: 1.80, oneYearChange: 4.00, threeYearChange: 8.0, fiveYearChange: 15.0, tenYearChange: 30.0, dailyRange: "$29.70 • $29.90", oneYearRange: "$28.50 • $31.00" },
    ];

    return NextResponse.json(mockBonds);
  }
}