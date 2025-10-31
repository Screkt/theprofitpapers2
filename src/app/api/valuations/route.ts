import { NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const MULTPL_BASE = 'https://www.multpl.com';

interface ValuationData {
    name: string;
    value: number;
    vsAvg: number;
}

export async function GET() {
  if (!POLYGON_API_KEY) {
    return NextResponse.json({ error: 'Polygon API key not set' }, { status: 500 });
  }

  try {
    const [spPeRes, nasdaqPeRes, shillerRes, buffettRes] = await Promise.all([
      fetch(`https://api.polygon.io/v2/reference/metrics?metric=pe_forward&universe=SPX&apikey=${POLYGON_API_KEY}`),
      fetch(`https://api.polygon.io/v2/reference/metrics?metric=pe_forward&universe=NDX&apikey=${POLYGON_API_KEY}`),
      fetch(`${MULTPL_BASE}/shiller-pe`),
      fetch(`${MULTPL_BASE}/buffett-index`),
    ]);

    if (!spPeRes.ok || !nasdaqPeRes.ok || !shillerRes.ok || !buffettRes.ok) {
      throw new Error('API fetch failed');
    }

    const spData = await spPeRes.json();
    const nasdaqData = await nasdaqPeRes.json();
    const spPe = parseFloat(spData.metrics?.[0]?.value) || 23.5;
    const nasdaqPe = parseFloat(nasdaqData.metrics?.[0]?.value) || 35;

    const shillerText = await shillerRes.text();
    const buffettText = await buffettRes.text();
    const shillerMatch = shillerText.match(/<strong>(\d+\.?\d*)<\/strong>/);
    const buffettMatch = buffettText.match(/<strong>(\d+\.?\d*(?:,\d{3})?)%?<\/strong>/);
    const shiller = shillerMatch?.[1] ? parseFloat(shillerMatch[1]) : 40.5;
    const buffett = buffettMatch?.[1] ? parseFloat(buffettMatch[1].replace(/,/g, '')) : 200;

    const valuations: ValuationData[] = [
      { name: 'S&P 500 Fwd P/E', value: spPe, vsAvg: Math.round((spPe - 20) / 20 * 100) },
      { name: 'Shiller CAPE', value: shiller, vsAvg: Math.round((shiller - 30) / 30 * 100) },
      { name: 'Buffett Ind.', value: buffett, vsAvg: Math.round((buffett - 150) / 150 * 100) }, 
      { name: 'Nasdaq P/E', value: nasdaqPe, vsAvg: Math.round((nasdaqPe - 28) / 28 * 100) },
    ];

    return NextResponse.json(valuations);
  } catch (error: any) {
    console.error('Valuations fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}