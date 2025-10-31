import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['O:EURUSD', 'O:USDJPY', 'O:GPDUSD', 'O:USDCAD', 'O:USDAUD', 'O:USDCHF'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

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

export async function GET() {
  if (!POLYGON_API_KEY) {
    return NextResponse.json({ error: 'Polygon API key not set' }, { status: 500 });
  }

  try {
    const tickerNames: { [key: string]: string } = {
      'O:EURUSD': 'EUR/USD',
      'O:USDJPY': 'USD/JPY',
      'O:GPDUSD': 'GPD/USD',
      'O:USDCAD': 'USD/CAD',
      'O:USDAUD': 'USD/AUD',
      'O:USDCHF': 'USD/CHF',
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
      const low = items[0].l.toFixed(4);
      const high = items[0].h.toFixed(4);
      return `${low} - ${high}`;
    };

    const getOneYearRange = (results: any[], ticker: string) => {
      const items = results.filter((item: any) => item.T === ticker);
      if (items.length === 0) return "N/A";
      const minLow = Math.min(...items.map((item: any) => item.l)).toFixed(4);
      const maxHigh = Math.max(...items.map((item: any) => item.h)).toFixed(4);
      return `${minLow} - ${maxHigh}`;
    };

    const currencies: CurrencyData[] = TICKERS.map(ticker => {
      const name = tickerNames[ticker];
      const todayItem = todayResults.find((item: any) => item.T === ticker);
      const currentRate = todayItem?.c || 0;
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
        rate: currentRate,
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
    }).filter(c => c.rate > 0);

    return NextResponse.json(currencies.sort((a: CurrencyData, b: CurrencyData) => b.oneYearChange - a.oneYearChange).slice(0, 6));
  } catch (error: any) {
    console.error('Currency fetch error:', error);
    const mockCurrencies: CurrencyData[] = [
      { name: 'Total World', ticker: 'VT', rate: 120.5, todayChange: 0.35, fiveDayChange: 2.15, oneMonthChange: 4.20, threeMonthChange: 6.1, ytdChange: 18.50, oneYearChange: 22.30, threeYearChange: 35.2, fiveYearChange: 75.8, tenYearChange: 160.4, dailyRange: "Low $119.80 - High $121.20", oneYearRange: "Low $98.50 - High $122.10" },
      { name: 'Dev. ex-US', ticker: 'VEU', rate: 65.2, todayChange: 0.28, fiveDayChange: 1.85, oneMonthChange: 3.45, threeMonthChange: 5.0, ytdChange: 14.20, oneYearChange: 16.80, threeYearChange: 25.1, fiveYearChange: 55.3, tenYearChange: 110.7, dailyRange: "Low $64.90 - High $65.70", oneYearRange: "Low $55.20 - High $66.00" },
      { name: 'Emerging Mkts', ticker: 'VWO', rate: 48.7, todayChange: 0.42, fiveDayChange: 2.30, oneMonthChange: 5.10, threeMonthChange: 7.2, ytdChange: 12.40, oneYearChange: 15.60, threeYearChange: 22.4, fiveYearChange: 45.9, tenYearChange: 90.2, dailyRange: "Low $48.30 - High $49.10", oneYearRange: "Low $40.80 - High $49.50" },
      { name: 'Japan', ticker: 'EWJ', rate: 72.4, todayChange: -0.15, fiveDayChange: 0.95, oneMonthChange: 2.80, threeMonthChange: 4.3, ytdChange: 10.80, oneYearChange: 13.20, threeYearChange: 18.7, fiveYearChange: 40.1, tenYearChange: 75.6, dailyRange: "Low $72.10 - High $72.80", oneYearRange: "Low $62.50 - High $73.20" },
      { name: 'Europe', ticker: 'VGK', rate: 68.9, todayChange: 0.22, fiveDayChange: 1.40, oneMonthChange: 3.10, threeMonthChange: 4.8, ytdChange: 11.50, oneYearChange: 14.00, threeYearChange: 20.3, fiveYearChange: 48.2, tenYearChange: 95.4, dailyRange: "Low $68.60 - High $69.30", oneYearRange: "Low $58.40 - High $69.80" },
      { name: 'China', ticker: 'FXI', rate: 35.1, todayChange: -0.48, fiveDayChange: -1.20, oneMonthChange: -0.50, threeMonthChange: 1.2, ytdChange: 5.30, oneYearChange: 7.80, threeYearChange: 10.5, fiveYearChange: 25.7, tenYearChange: 50.1, dailyRange: "Low $34.90 - High $35.40", oneYearRange: "Low $30.20 - High $36.00" },
      { name: 'India', ticker: 'INDA', rate: 58.3, todayChange: 0.55, fiveDayChange: 3.10, oneMonthChange: 6.40, threeMonthChange: 9.5, ytdChange: 20.10, oneYearChange: 24.70, threeYearChange: 38.2, fiveYearChange: 85.4, tenYearChange: 170.8, dailyRange: "Low $57.90 - High $58.80", oneYearRange: "Low $46.50 - High $59.20" },
      { name: 'Brazil', ticker: 'EWZ', rate: 28.6, todayChange: -0.32, fiveDayChange: 0.60, oneMonthChange: 1.90, threeMonthChange: 3.1, ytdChange: 8.20, oneYearChange: 10.40, threeYearChange: 14.8, fiveYearChange: 32.5, tenYearChange: 65.3, dailyRange: "Low $28.40 - High $28.90", oneYearRange: "Low $24.10 - High $29.30" },
    ];

    return NextResponse.json(mockCurrencies);
  }
}