import { NextResponse } from 'next/server';

const TARGET_TICKERS = ['TSLA', 'AAPL', 'AMZN', 'NVDA', 'UNH', 'SPOT'];

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

interface StockData {
    ticker: string;
    price: number;
    change: number;
}

async function fetchStockData(ticker: string): Promise<StockData | null> {
    if (!API_KEY) {
        console.error ("ALPHA_VANTAGE_API_KEY is not set.");
        return null;
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url, { next: {revalidate: 300 }});
        const data = await response.json();

        const quote = data['Global Quote'];

        if (quote && quote['05. price'] && quote['10. change percent']) {
            return {
                ticker: quote['01. symbol'],
                price: parseFloat(quote['05. price']),
                change: parseFloat(quote['10. change percent'].replace('%', '')),
            };
        }
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
    }
    return null;
}


export async function GET() {
    const promises = TARGET_TICKERS.map(ticker => fetchStockData(ticker));
    const results = await Promise.all(promises);
    const finalData = results.filter((stock): stock is StockData => stock !== null);
    if (finalData.length === 0) {
        return new NextResponse(JSON.stringify({ error: "Failed to fetch all stock data." }), {
            status: 500,
            headers: {'Content-Type': 'applications/json' },
        });
    }

    return NextResponse.json(finalData);
}