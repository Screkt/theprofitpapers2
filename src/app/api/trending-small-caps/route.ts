import { NextResponse } from 'next/server';

interface StockData {
    ticker: string;
    price: number;
    change: number;
}

interface PolygonGainer {
    T: string;
    d: {
        P: number;
        chp: number;
    };
    market_cap: number;
}


export async function GET() {
  try {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }
    
    const url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?limit=50&apiKey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 429 ) {
            return NextResponse.json({ error: 'Rate limited-try again later'}, { status: 429 });
        }
        const errText = await response.text();
        throw new Error(`Polygon error ${response.status} - ${errText}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
        return NextResponse.json({ error: 'Invalid response from Polygon' }, { status: 500 });
    }

    const stocks: StockData[] = data.results
        .filter((item: PolygonGainer) => item.market_cap && item.market_cap < 2000000000)
        .map((item: PolygonGainer) => ({
            ticker: item.T,
            price: item.d.P,
            change: item.d.chp,
        }))
        .slice(0, 7);
    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Trending small caps fetch error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}