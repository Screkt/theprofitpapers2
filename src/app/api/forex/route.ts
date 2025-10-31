import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const SYMBOLS = ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCNY'];
const DATE = new Date().toISOString().split('T')[0];

const SYMBOL_MAP: { [key: string]: string } = {
  'EURUSD': 'EUR/USD', 'USDJPY': 'USD/JPY', 'GBPUSD': 'GBP/USD', 'USDCNY': 'USD/CNY'
};

export async function GET() {
  if (!POLYGON_API_KEY) {
    return NextResponse.json({ error: 'Polygon API key not set' }, { status: 500 });
  }

  try {
    const url = `${BASE_URL}/v2/aggs/ticker/${SYMBOLS.join(',')}/range/1/day/${DATE}/${DATE}?adjusted=true&sort=asc&limit=1&apiKey=${POLYGON_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }
    
    const data = await response.json();
    const results = data.results?.results || [];

    const forex = results.flatMap((item: any) => {
      const symbol = SYMBOL_MAP[item.T] || item.T;
      const close = item.c;
      const open = item.o;
      const change = ((close - open) / open * 100);

      return { symbol, price: close, change };
    });

    return NextResponse.json(forex.slice(0, 4));
  } catch (error: any) {
    console.error('Forex fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}