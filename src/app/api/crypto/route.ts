import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const SYMBOLS = ['X:BTCUSD', 'X:ETHUSD', 'X:BNBUSD', 'X:SOLUSD', 'X:XRPUSD', 'X:ADAUSD', 'X:DOGEUSD', 'X:TRXUSD']; // Top 8 crypto/USD
const DATE = new Date().toISOString().split('T')[0];

const SYMBOL_MAP: { [key: string]: string } = {
  'X:BTCUSD': 'BTC', 'X:ETHUSD': 'ETH', 'X:BNBUSD': 'BNB', 'X:SOLUSD': 'SOL',
  'X:XRPUSD': 'XRP', 'X:ADAUSD': 'ADA', 'X:DOGEUSD': 'DOGE', 'X:TRXUSD': 'TRX'
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

    const crypto = results.flatMap((item: any) => {
      const symbol = SYMBOL_MAP[item.T] || item.T;
      const close = item.c;
      const open = item.o;
      const change = ((close - open) / open * 100);

      return { symbol, price: close, change };
    });

    return NextResponse.json(crypto.slice(0, 8));
  } catch (error: any) {
    console.error('Crypto fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}