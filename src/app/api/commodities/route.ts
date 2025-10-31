import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const SYMBOLS = ['GC=F', 'CL=F', 'SI=F', 'HG=F', 'BZ=F', 'PL=F', 'ZW=F'];
const DATE = new Date().toISOString().split('T')[0];

const SYMBOL_MAP: { [key: string]: string } = {
  'GC=F': 'GOLD', 'CL=F': 'OIL', 'SI=F': 'SILVER', 'HG=F': 'COPPER',
  'NG=F': 'NAT GAS', 'BZ=F': 'BRENT', 'PL=F': 'PLATINUM', 'ZW=F': 'WHEAT'
};

export async function GET() {
    if (!POLYGON_API_KEY) {
        return NextResponse.json({ error: 'API key not set' }, { status: 500 });
    }

    try {
        const url = `${BASE_URL}/v2/aggs/ticker/${SYMBOLS.join(',')}/range/1/day/${DATE}/${DATE}?adjusted=true&sort=asc&limit=1&apiKey=${POLYGON_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Polygon API error: ${response.status}`);
        }
    
    const data = await response.json();
    const results = data.results?.results || [];

    const commodities = results.flatMap((item: any) => {
      const symbol = SYMBOL_MAP[item.T] || item.T;
      const close = item.c;
      const open = item.o;
      const change = ((close - open) / open * 100).toFixed(2);

      return { symbol, price: close, change: parseFloat(change) };
    });

    return NextResponse.json(commodities.slice(0, 4));
  } catch (error: any) {
    console.error('Commodities fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}