import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const apiUrl = process.env.VASTRA_API_URL;
  if (!apiUrl) return NextResponse.json({ success: false, message: 'Vastra API is not configured' }, { status: 503 });

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/storefront/checkout`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: await request.text(),
      cache: 'no-store'
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { 'content-type': response.headers.get('content-type') || 'application/json' }
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Checkout service unavailable' }, { status: 502 });
  }
}