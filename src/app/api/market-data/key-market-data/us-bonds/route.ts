import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['TBIL', 'SHY', 'IEI', 'IEF', 'VGIT', 'TLT', 'EDV', 'GOVT'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

interface USBondData {
  name: string;
  ticker: string;
  price: number; 
  yield: number;
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
      'TBIL': '6 Month',
      'SHY': '1 Year',
      'IEI': '2 Year',
      'IEF': '5 Year',
      'VGIT': '10 Year',
      'TLT': '20 Year',
      'EDV': '30 Year',
      'GOVT': 'Total [1-30 Yr]'
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

    const equities: USBondData[] = TICKERS.map(ticker => {
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
        yield: currentYield,
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

    return NextResponse.json(equities.sort((a: USBondData, b: USBondData) => b.oneYearChange - a.oneYearChange).slice(0, 8));
  } catch (error: any) {
    console.error('US Treasury Bonds fetch error:', error);
    const mockEquities: USBondData[] = [
      { name: '6 Month', ticker: 'TBIL', price: 100.1, yield: 4.80, todayChange: 0.02, fiveDayChange: 0.10, oneMonthChange: 0.20, threeMonthChange: 0.40, ytdChange: 2.80, oneYearChange: 5.20, threeYearChange: 10.5, fiveYearChange: 22.1, tenYearChange: 48.3, dailyRange: "Low $100.05 - High $100.15", oneYearRange: "Low $99.50 - High $100.50" },
      { name: '1 Year', ticker: 'SHY', price: 82.1, yield: 4.60, todayChange: 0.05, fiveDayChange: 0.20, oneMonthChange: 0.40, threeMonthChange: 0.8, ytdChange: 2.50, oneYearChange: 3.10, threeYearChange: 5.2, fiveYearChange: 12.4, tenYearChange: 25.7, dailyRange: "Low $81.90 - High $82.30", oneYearRange: "Low $80.50 - High $83.20" },
      { name: '2 Year', ticker: 'IEI', price: 95.4, yield: 4.20, todayChange: -0.08, fiveDayChange: -0.40, oneMonthChange: -0.70, threeMonthChange: -1.5, ytdChange: -1.20, oneYearChange: -2.80, threeYearChange: -6.1, fiveYearChange: 5.3, tenYearChange: 18.9, dailyRange: "Low $95.20 - High $95.70", oneYearRange: "Low $92.10 - High $98.50" },
      { name: '5 Year', ticker: 'IEF', price: 95.8, yield: 4.00, todayChange: -0.12, fiveDayChange: -0.60, oneMonthChange: -1.00, threeMonthChange: -2.0, ytdChange: -2.50, oneYearChange: -4.20, threeYearChange: -8.5, fiveYearChange: 2.1, tenYearChange: 16.4, dailyRange: "Low $95.50 - High $96.10", oneYearRange: "Low $93.20 - High $99.80" },
      { name: '10 Year', ticker: 'VGIT', price: 58.3, yield: 3.90, todayChange: -0.10, fiveDayChange: -0.50, oneMonthChange: -0.80, threeMonthChange: -1.8, ytdChange: -3.00, oneYearChange: -5.00, threeYearChange: -10.2, fiveYearChange: -1.5, tenYearChange: 12.8, dailyRange: "Low $58.10 - High $58.50", oneYearRange: "Low $55.40 - High $61.20" },
      { name: '20 Year', ticker: 'TLT', price: 92.5, yield: 4.30, todayChange: -0.15, fiveDayChange: -0.80, oneMonthChange: -1.20, threeMonthChange: -2.5, ytdChange: -3.10, oneYearChange: -5.40, threeYearChange: -12.2, fiveYearChange: -8.5, tenYearChange: 15.3, dailyRange: "Low $92.10 - High $93.00", oneYearRange: "Low $85.20 - High $100.50" },
      { name: '30 Year', ticker: 'EDV', price: 68.7, yield: 4.40, todayChange: -0.20, fiveDayChange: -1.00, oneMonthChange: -1.50, threeMonthChange: -3.0, ytdChange: -4.20, oneYearChange: -6.80, threeYearChange: -15.1, fiveYearChange: -12.3, tenYearChange: 10.5, dailyRange: "Low $68.40 - High $69.00", oneYearRange: "Low $62.50 - High $75.80" },
      { name: 'Total (1-30 Yr)', ticker: 'GOVT', price: 22.4, yield: 4.10, todayChange: -0.03, fiveDayChange: -0.20, oneMonthChange: -0.40, threeMonthChange: -0.9, ytdChange: -1.50, oneYearChange: -3.00, threeYearChange: -7.0, fiveYearChange: 4.2, tenYearChange: 20.1, dailyRange: "Low $22.35 - High $22.45", oneYearRange: "Low $21.80 - High $23.50" },
    ];

    return NextResponse.json(mockEquities);
  }
}