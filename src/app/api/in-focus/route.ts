import { NextResponse } from 'next/server';

interface StockData {
    ticker: string, 
    price: number,
    change: number;
}

interface PolygonLoser {
    T: string;
    d: {
        P: number, 
        chp: number;
    };
    market_cap: number;
}

interface PolygonSnapshotResponse {
    results?: PolygonLoser[];
}


export async function GET() {
    try {
        const apiKey = process.env.POLYGON_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'POLYGON_API_KEY is missing' }, { status: 500 });
        }

        const url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/losers?limit=50&apiKey=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 429) {
                return NextResponse.json({ error: 'Rate limited - try again later' }, { status: 429 });
            }
            
            const errorDetails = await response.text();
            console.error(`Polygon API Error (${response.status}):`, errorDetails);
            return NextResponse.json({ error: `Failed to fetch data from Polygon API: Status ${response.status}` }, { status: response.status });
        }

        const data: PolygonSnapshotResponse = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
            return NextResponse.json({ error: 'Invalid response format from Polygon or missing results array' }, { status: 500 });
        }

        const stocks: StockData[] = data.results
            .filter((item: PolygonLoser) => item.market_cap && item.market_cap > 10000000)
            .map((item: PolygonLoser) => ({
                ticker: item.T,
                price: item.d.P,
                change: item.d.chp,
            }))
            .slice(0, 7);

        return NextResponse.json(stocks);
    } catch (error) {
        console.error('In Focus Stocks (Losers) fetch error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}   