import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'SPY';
    const days = parseInt (searchParams.get('days') || '7');

    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key missing '}, { status: 500 });
    }
    const toDate = new Date ('2025-10-25').toISOString().split('T')[0];
    const fromDate = new Date ();
    fromDate.setDate(fromDate.getDate() - days);
    const fromDateStr = fromDate.toISOString().split('T')[0];

    try {
        const response = await fetch (
            `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDateStr}/${toDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`
        );

        if (!response.ok) {
            return NextResponse.json({ error: 'Polygon API request failed'}, { status: response.status});
        }
        const data = await response.json();

        if (data.resultCount === 0) {
            return NextResponse.json({ error: 'No data found for this symbol and date range'}, { status: 404 });
        }
        const chartData = data.restults.map((bar:any) => ({
            date: new Date(bar.t).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
            close: bar.c,
        }));
        
        return NextResponse.json(chartData); 
    }   catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Internal server error'}, { status: 500});
    } 
}