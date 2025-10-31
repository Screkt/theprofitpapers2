import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['VTEB', 'MUB', 'SUB', 'PLZ', 'HYD', 'CMF', 'NYF', 'VWIUX', 'VMLUX', 'VWALX', 'TMLF', 'TFI', 'SHYD', 'SHM']; 
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

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

export async function GET() {
  if (!POLYGON_API_KEY) {
    return NextResponse.json({ error: 'Polygon API key not set' }, { status: 500 });
  }

  try {
    const tickerNames: { [key: string]: string } = {
      'VTEB': 'National IG (Broad)',
      'MUB': 'National IG Intermediate',
      'SUB': 'National IG Short-Term',
      'PZA': 'High Yield National',
      'HYD': 'High Yield Long-Term',
      'CMF': 'California IG',
      'NYF': 'New York IG',
      'VWIUX': 'Intermediate MF (VWIUX)',
      'VMLUX': 'Short-Term MF (VMLUX)',
      'VWALX': 'Long-Term MF (VWALX)',
      'TMLF': 'Taxable Muni (TMLF)',
      'TFI': 'Intermediate Muni (SPDR)',
      'SHYD': 'Short Duration HY Muni',   
      'SHM': 'Short Term Muni (SPDR)', 
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

    const bonds: MunicipalBondData[] = TICKERS.map(ticker => {
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

    return NextResponse.json(bonds.sort((a: MunicipalBondData, b: MunicipalBondData) => b.oneYearChange - a.oneYearChange).slice(0, 11));
  } catch (error: any) {
    console.error('US Treasury Bonds fetch error:', error);
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

    return NextResponse.json(mockBonds);
  }
}