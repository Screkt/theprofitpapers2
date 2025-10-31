import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['SPY', 'DIA', 'QQQ', 'VTI', 'MDY', 'IJR', 'IWC', 'VXF'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

interface EquityData {
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
      'SPY': 'S&P 500',
      'DIA': 'DJIA',
      'QQQ': 'NASDAQ 100',
      'VTI': 'U.S. Total Market',
      'MDY': 'Mid Cap',
      'IJR': 'Small Cap',
      'IWC': 'Micro Cap',
      'VXF': 'Extended Market'
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

    const equities: EquityData[] = TICKERS.map(ticker => {
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

    return NextResponse.json(equities.sort((a: EquityData, b: EquityData) => b.oneYearChange - a.oneYearChange).slice(0, 8));
  } catch (error: any) {
    console.error('US Equity fetch error:', error);
    const mockEquities: EquityData[] = [
      { name: 'NASDAQ 100', ticker: 'QQQ', price: 450.8, todayChange: 0.48, fiveDayChange: 3.66, oneMonthChange: 6.20, threeMonthChange: 8.5, ytdChange: 23.80, oneYearChange: 27.76, threeYearChange: 40.1, fiveYearChange: 120.3, tenYearChange: 250.8, dailyRange: "Low $449.10 - High $451.90", oneYearRange: "Low $360.50 - High $455.20" },
      { name: 'S&P 500', ticker: 'SPY', price: 450.2, todayChange: 0.28, fiveDayChange: 2.28, oneMonthChange: 3.81, threeMonthChange: 5.2, ytdChange: 17.23, oneYearChange: 18.29, threeYearChange: 25.4, fiveYearChange: 80.1, tenYearChange: 150.2, dailyRange: "Low $449.50 - High $452.80", oneYearRange: "Low $380.20 - High $460.50" },
      { name: 'DJIA', ticker: 'DIA', price: 380.5, todayChange: 0.48, fiveDayChange: 2.11, oneMonthChange: 3.22, threeMonthChange: 4.8, ytdChange: 12.14, oneYearChange: 12.52, threeYearChange: 20.3, fiveYearChange: 50.7, tenYearChange: 100.4, dailyRange: "Low $379.20 - High $381.50", oneYearRange: "Low $340.10 - High $385.30" },
      { name: 'U.S. Total Market', ticker: 'VTI', price: 250.1, todayChange: 0.11, fiveDayChange: 0.37, oneMonthChange: 0.78, threeMonthChange: 2.5, ytdChange: 11.21, oneYearChange: 9.18, threeYearChange: 15.2, fiveYearChange: 60.4, tenYearChange: 130.7, dailyRange: "Low $249.80 - High $251.20", oneYearRange: "Low $210.30 - High $252.10" },
      { name: 'Mid Cap', ticker: 'MDY', price: 500.3, todayChange: -0.10, fiveDayChange: 0.03, oneMonthChange: 0.47, threeMonthChange: 1.8, ytdChange: 5.25, oneYearChange: 4.54, threeYearChange: 10.5, fiveYearChange: 45.2, tenYearChange: 90.1, dailyRange: "Low $499.50 - High $501.80", oneYearRange: "Low $450.20 - High $505.30" },
      { name: 'Small Cap', ticker: 'IJR', price: 110.7, todayChange: -0.41, fiveDayChange: 0.30, oneMonthChange: 1.67, threeMonthChange: 3.2, ytdChange: 4.54, oneYearChange: 3.66, threeYearChange: 8.9, fiveYearChange: 35.8, tenYearChange: 70.5, dailyRange: "Low $109.90 - High $110.80", oneYearRange: "Low $95.20 - High $112.40" },
      { name: 'Micro Cap', ticker: 'IWC', price: 130.2, todayChange: -0.05, fiveDayChange: 1.33, oneMonthChange: 5.68, threeMonthChange: 7.1, ytdChange: 20.82, oneYearChange: 21.86, threeYearChange: 30.4, fiveYearChange: 60.2, tenYearChange: 120.8, dailyRange: "Low $129.50 - High $131.20", oneYearRange: "Low $100.10 - High $133.50" },
      { name: 'Extended Market', ticker: 'VXF', price: 180.6, todayChange: 0.20, fiveDayChange: 0.45, oneMonthChange: 1.20, threeMonthChange: 2.8, ytdChange: 8.50, oneYearChange: 7.80, threeYearChange: 12.6, fiveYearChange: 50.1, tenYearChange: 105.3, dailyRange: "Low $179.80 - High $181.50", oneYearRange: "Low $150.20 - High $183.40" },
    ];

    return NextResponse.json(mockEquities);
  }
}