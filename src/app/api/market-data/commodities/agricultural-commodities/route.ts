import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['DBA', 'CORN', 'SOYB', 'WEAT', 'CAN', 'COW', 'BAL', 'NIB', 'JO', 'MOO', 'TAGS', 'RJA', 'PST', 'RICE', 'USAG', 'TILL'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

interface AgriculturalCommodities {
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
      'DBA': 'Broad Agriculture (Invesco DB Ag Fund)',
      'TAGS': 'Teucrium Agricultural Fund',
      'RJA': 'RICI Agriculture ETN',
      'USAG': 'US Agriculture Index Fund',
      'TILL': 'Teucrium Ag Strategy No K-1 ETF',
      'CORN': 'Corn',
      'SOYB': 'Soybeans',
      'WEAT': 'Wheat',
      'RICE': 'Rice ',
      'PST': 'Grains Subindex',
      'CANE': 'Sugar',
      'BAL': 'Cotton',
      'NIB': 'Cocoa',
      'JO': 'Coffee',
      'COW': 'Livestock (iPath Subindex ETN)',
      'MOO': 'Agribusiness (VanEck Agribusiness ETF - Stocks)',
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

    const agricultural: AgriculturalCommodities[] = TICKERS.map(ticker => {
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

    return NextResponse.json(agricultural.sort((a: AgriculturalCommodities, b: AgriculturalCommodities) => b.oneYearChange - a.oneYearChange).slice(0, 16));
  } catch (error: any) {
    console.error('US Sector fetch error:', error);
    const mockAgricultural: AgriculturalCommodities[] = [
        { name: 'Broad Agriculture (Invesco DB Ag Fund)', ticker: 'DBA', price: 21.50, todayChange: 0.25, fiveDayChange: 1.10, oneMonthChange: 2.50, threeMonthChange: 5.0, ytdChange: 8.0, oneYearChange: 12.0, threeYearChange: 25.0, fiveYearChange: 45.0, tenYearChange: 70.0, dailyRange: "$21.30 - $21.80", oneYearRange: "$19.00 - $23.50" },
        { name: 'Corn', ticker: 'CORN', price: 23.80, todayChange: 0.80, fiveDayChange: 3.50, oneMonthChange: 6.00, threeMonthChange: -2.0, ytdChange: -5.0, oneYearChange: -15.0, threeYearChange: 30.0, fiveYearChange: 60.0, tenYearChange: 90.0, dailyRange: "$23.50 - $24.10", oneYearRange: "$22.00 - $28.00" },
        { name: 'Soybeans', ticker: 'SOYB', price: 27.10, todayChange: -0.15, fiveDayChange: 0.50, oneMonthChange: 1.80, threeMonthChange: 4.5, ytdChange: 7.5, oneYearChange: 10.0, threeYearChange: 20.0, fiveYearChange: 50.0, tenYearChange: 85.0, dailyRange: "$27.00 - $27.30", oneYearRange: "$24.00 - $30.00" },
        { name: 'Wheat', ticker: 'WEAT', price: 7.95, todayChange: 1.50, fiveDayChange: 4.20, oneMonthChange: 8.50, threeMonthChange: 1.0, ytdChange: 3.0, oneYearChange: 5.50, threeYearChange: 15.0, fiveYearChange: 35.0, tenYearChange: 65.0, dailyRange: "$7.80 - $8.05", oneYearRange: "$7.00 - $9.00" },
        { name: 'Sugar', ticker: 'CANE', price: 32.40, todayChange: 0.65, fiveDayChange: 2.10, oneMonthChange: 4.00, threeMonthChange: 9.0, ytdChange: 15.0, oneYearChange: 22.0, threeYearChange: 40.0, fiveYearChange: 90.0, tenYearChange: 180.0, dailyRange: "$32.10 - $32.80", oneYearRange: "$28.00 - $35.00" },
        { name: 'Livestock', ticker: 'COW', price: 35.15, todayChange: -0.30, fiveDayChange: -0.50, oneMonthChange: 0.50, threeMonthChange: 3.0, ytdChange: 6.0, oneYearChange: 9.0, threeYearChange: 18.0, fiveYearChange: 40.0, tenYearChange: 75.0, dailyRange: "$35.00 - $35.50", oneYearRange: "$32.00 - $37.00" },
        { name: 'Cotton ', ticker: 'BAL', price: 68.20, todayChange: 0.90, fiveDayChange: 3.00, oneMonthChange: 5.50, threeMonthChange: 10.0, ytdChange: 16.0, oneYearChange: 24.0, threeYearChange: 50.0, fiveYearChange: 120.0, tenYearChange: 200.0, dailyRange: "$67.80 - $68.50", oneYearRange: "$60.00 - $72.00" },
        { name: 'Cocoa', ticker: 'NIB', price: 40.90, todayChange: 1.20, fiveDayChange: 4.50, oneMonthChange: 9.00, threeMonthChange: 18.0, ytdChange: 35.0, oneYearChange: 60.0, threeYearChange: 150.0, fiveYearChange: 250.0, tenYearChange: 400.0, dailyRange: "$40.50 - $41.30", oneYearRange: "$30.00 - $45.00" },
        { name: 'Coffee ', ticker: 'JO', price: 29.50, todayChange: 0.10, fiveDayChange: 0.80, oneMonthChange: 1.50, threeMonthChange: 3.5, ytdChange: 5.5, oneYearChange: 8.0, threeYearChange: 20.0, fiveYearChange: 50.0, tenYearChange: 95.0, dailyRange: "$29.30 - $29.70", oneYearRange: "$26.00 - $32.00" },
        { name: 'Agribusiness (VanEck Agribusiness ETF - Stocks)', ticker: 'MOO', price: 55.70, todayChange: 0.45, fiveDayChange: 1.50, oneMonthChange: 3.00, threeMonthChange: 7.0, ytdChange: 11.0, oneYearChange: 16.0, threeYearChange: 30.0, fiveYearChange: 65.0, tenYearChange: 120.0, dailyRange: "$55.50 - $56.00", oneYearRange: "$50.00 - $60.00" },
        { name: 'Teucrium Agricultural Fund', ticker: 'TAGS', price: 34.00, todayChange: 0.30, fiveDayChange: 1.20, oneMonthChange: 2.80, threeMonthChange: 5.5, ytdChange: 9.0, oneYearChange: 14.0, threeYearChange: 27.0, fiveYearChange: 55.0, tenYearChange: 100.0, dailyRange: "$33.80 - $34.30", oneYearRange: "$30.00 - $37.00" },
        { name: 'RICI Agriculture ETN', ticker: 'RJA', price: 25.60, todayChange: 0.50, fiveDayChange: 2.00, oneMonthChange: 4.50, threeMonthChange: 8.0, ytdChange: 12.0, oneYearChange: 18.0, threeYearChange: 35.0, fiveYearChange: 70.0, tenYearChange: 130.0, dailyRange: "$25.40 - $25.90", oneYearRange: "$22.00 - $28.00" },
        { name: 'Grains Subindex', ticker: 'PST', price: 15.20, todayChange: 0.70, fiveDayChange: 2.50, oneMonthChange: 5.00, threeMonthChange: 9.5, ytdChange: 14.0, oneYearChange: 20.0, threeYearChange: 45.0, fiveYearChange: 85.0, tenYearChange: 150.0, dailyRange: "$15.00 - $15.40", oneYearRange: "$13.00 - $17.00" },
        { name: 'Rice', ticker: 'RICE', price: 12.50, todayChange: 0.20, fiveDayChange: 1.00, oneMonthChange: 2.00, threeMonthChange: 4.0, ytdChange: 7.0, oneYearChange: 10.0, threeYearChange: 25.0, fiveYearChange: 55.0, tenYearChange: 105.0, dailyRange: "$12.40 - $12.60", oneYearRange: "$11.00 - $14.00" },
        { name: 'US Agriculture Index Fund', ticker: 'USAG', price: 44.50, todayChange: 0.40, fiveDayChange: 1.60, oneMonthChange: 3.20, threeMonthChange: 6.5, ytdChange: 10.0, oneYearChange: 15.0, threeYearChange: 30.0, fiveYearChange: 60.0, tenYearChange: 115.0, dailyRange: "$44.30 - $44.80", oneYearRange: "$40.00 - $47.00" },
        { name: 'Teucrium Ag Strategy No K-1 ETF', ticker: 'TILL', price: 30.00, todayChange: 0.55, fiveDayChange: 2.20, oneMonthChange: 4.50, threeMonthChange: 8.5, ytdChange: 14.0, oneYearChange: 21.0, threeYearChange: 45.0, fiveYearChange: 95.0, tenYearChange: 160.0, dailyRange: "$29.80 - $30.40", oneYearRange: "$26.00 - $33.00" },
    ];

    return NextResponse.json(mockAgricultural);
  }
}