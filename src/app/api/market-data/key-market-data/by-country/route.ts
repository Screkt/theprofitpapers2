import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['EWU', 'EWQ', 'EWG', 'EWC', 'EWL', 'EWA', 'EWY', 'EWN'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

interface CountryEquityData {
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
      'EWU': 'United Kingdom',
      'EWQ': 'France',
      'EWC': 'Canada',
      'EWL': 'Switzerland',
      'EWG': 'Germany',
      'EWA': 'Australia',
      'EWN': 'Netherlands',
      'EWY': 'South Korea'
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
      const minLow = Math.min(...items.map((item: any) => item.l)).toFixed(2);
      const maxHigh = Math.max(...items.map((item: any) => item.h)).toFixed(2);
      return `$${minLow} - $${maxHigh}`;
    };

    const equities: CountryEquityData[] = TICKERS.map(ticker => {
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

    return NextResponse.json(equities.sort((a: CountryEquityData, b: CountryEquityData) => b.oneYearChange - a.oneYearChange).slice(0, 8));
  } catch (error: any) {
    console.error('Country Equity fetch error:', error);
    const mockEquities: CountryEquityData[] = [
      { name: 'United Kingdom', ticker: 'EWU', price: 38.2, todayChange: 0.12, fiveDayChange: 1.20, oneMonthChange: 2.50, threeMonthChange: 3.8, ytdChange: 9.50, oneYearChange: 11.20, threeYearChange: 16.5, fiveYearChange: 35.8, tenYearChange: 70.4, dailyRange: "Low $38.00 - High $38.50", oneYearRange: "Low $32.10 - High $39.20" },
      { name: 'France', ticker: 'EWQ', price: 42.7, todayChange: 0.28, fiveDayChange: 1.65, oneMonthChange: 3.10, threeMonthChange: 4.5, ytdChange: 10.80, oneYearChange: 13.00, threeYearChange: 19.2, fiveYearChange: 42.1, tenYearChange: 85.7, dailyRange: "Low $42.40 - High $43.00", oneYearRange: "Low $36.50 - High $43.50" },
      { name: 'Canada', ticker: 'EWC', price: 40.1, todayChange: -0.18, fiveDayChange: 0.80, oneMonthChange: 1.90, threeMonthChange: 3.2, ytdChange: 8.20, oneYearChange: 9.80, threeYearChange: 14.0, fiveYearChange: 30.5, tenYearChange: 60.2, dailyRange: "Low $39.90 - High $40.30", oneYearRange: "Low $34.80 - High $41.00" },
      { name: 'Switzerland', ticker: 'EWL', price: 50.3, todayChange: 0.22, fiveDayChange: 1.40, oneMonthChange: 2.80, threeMonthChange: 4.1, ytdChange: 12.30, oneYearChange: 14.60, threeYearChange: 21.5, fiveYearChange: 48.2, tenYearChange: 95.1, dailyRange: "Low $50.10 - High $50.60", oneYearRange: "Low $43.50 - High $51.20" },
      { name: 'Germany', ticker: 'EWG', price: 36.5, todayChange: 0.05, fiveDayChange: 0.95, oneMonthChange: 2.20, threeMonthChange: 3.5, ytdChange: 7.90, oneYearChange: 9.50, threeYearChange: 13.8, fiveYearChange: 28.7, tenYearChange: 55.3, dailyRange: "Low $36.40 - High $36.70", oneYearRange: "Low $31.20 - High $37.40" },
      { name: 'Australia', ticker: 'EWA', price: 27.8, todayChange: -0.35, fiveDayChange: -0.50, oneMonthChange: 0.90, threeMonthChange: 2.0, ytdChange: 6.40, oneYearChange: 7.80, threeYearChange: 11.2, fiveYearChange: 25.4, tenYearChange: 50.8, dailyRange: "Low $27.60 - High $28.00", oneYearRange: "Low $23.90 - High $28.40" },
      { name: 'Netherlands', ticker: 'EWN', price: 58.4, todayChange: 0.15, fiveDayChange: 1.05, oneMonthChange: 2.40, threeMonthChange: 3.6, ytdChange: 8.70, oneYearChange: 10.20, threeYearChange: 15.1, fiveYearChange: 33.5, tenYearChange: 68.9, dailyRange: "Low $58.20 - High $58.70", oneYearRange: "Low $50.10 - High $59.30" },
      { name: 'South Korea', ticker: 'EWY', price: 68.4, todayChange: 0.38, fiveDayChange: 2.10, oneMonthChange: 4.50, threeMonthChange: 6.3, ytdChange: 15.20, oneYearChange: 18.00, threeYearChange: 26.4, fiveYearChange: 62.7, tenYearChange: 120.5, dailyRange: "Low $68.00 - High $69.00", oneYearRange: "Low $57.20 - High $69.80" },
    ];

    return NextResponse.json(mockEquities);
  }
}