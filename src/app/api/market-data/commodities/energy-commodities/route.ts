import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['USO', 'BNO', 'UNG', 'UGA', 'UHN', 'PALL', 'PPLT', 'GLD'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

interface EnergyCommoditiesData {
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
      'USO': 'Crude Oil (WTI)',
      'BNO': 'Crude Oil (Brent)',
      'UNG': 'Natural Gas',
      'UGA': 'Gasoline',
      'UHN': 'Heating Oil',
      'PALL': 'Palladium',
      'PPLT': 'Platinum',
      'GLD': 'Gold',
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

    const energyCommodities: EnergyCommoditiesData[] = TICKERS.map(ticker => {
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

    return NextResponse.json(energyCommodities.sort((a: EnergyCommoditiesData, b: EnergyCommoditiesData) => b.oneYearChange - a.oneYearChange).slice(0, 11));
  } catch (error: any) {
    console.error('US Sector fetch error:', error);
    const mockEnergyCommodities: EnergyCommoditiesData[] = [
        { name: 'Crude Oil (WTI)', ticker: 'USO', price: 78.50, todayChange: 0.85, fiveDayChange: 2.12, oneMonthChange: 5.45, threeMonthChange: 12.2, ytdChange: 18.90, oneYearChange: 25.15, threeYearChange: 45.8, fiveYearChange: 110.2, tenYearChange: 90.4, dailyRange: "$77.50 - $79.10", oneYearRange: "$65.80 - $85.30" },
        { name: 'Natural Gas', ticker: 'UNG', price: 18.25, todayChange: -1.20, fiveDayChange: -4.88, oneMonthChange: -9.67, threeMonthChange: -15.1, ytdChange: -8.34, oneYearChange: -20.76, threeYearChange: 35.2, fiveYearChange: 85.9, tenYearChange: 180.5, dailyRange: "$18.05 - $18.50", oneYearRange: "$15.40 - $25.20" },
        { name: 'Gasoline', ticker: 'UGA', price: 65.10, todayChange: 0.40, fiveDayChange: 1.55, oneMonthChange: 3.23, threeMonthChange: 7.3, ytdChange: 10.67, oneYearChange: 14.45, threeYearChange: 28.1, fiveYearChange: 65.4, tenYearChange: 140.8, dailyRange: "$64.80 - $65.50", oneYearRange: "$55.50 - $67.70" },
        { name: 'Crude Oil (Brent)', ticker: 'BNO', price: 83.90, todayChange: 0.65, fiveDayChange: 2.00, oneMonthChange: 4.89, threeMonthChange: 11.4, ytdChange: 17.82, oneYearChange: 23.23, threeYearChange: 40.9, fiveYearChange: 105.5, tenYearChange: 85.2, dailyRange: "$83.00 - $84.50", oneYearRange: "$68.10 - $87.40" },
        { name: 'Heating Oil', ticker: 'UHN', price: 55.40, todayChange: 0.22, fiveDayChange: 0.78, oneMonthChange: 2.34, threeMonthChange: 5.1, ytdChange: 8.56, oneYearChange: 10.88, threeYearChange: 18.7, fiveYearChange: 55.3, tenYearChange: 110.6, dailyRange: "Low $55.10 - High $55.70", oneYearRange: "Low $48.30 - High $57.20" },
        { name: 'Gold', ticker: 'GLD', price: 185.00, todayChange: 0.15, fiveDayChange: 0.75, oneMonthChange: 2.10, threeMonthChange: 3.5, ytdChange: 6.20, oneYearChange: 8.10, threeYearChange: 15.0, fiveYearChange: 40.0, tenYearChange: 80.0, dailyRange: "$184.50 - $185.70", oneYearRange: "$170.00 - $190.00" },
    ];

    return NextResponse.json(mockEnergyCommodities);
  }
}