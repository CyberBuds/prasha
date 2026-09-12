import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const apiUrl = process.env.VASTRA_API_URL;

  if (!apiUrl) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const requestUrl = new URL(request.url);
  const query = requestUrl.search;

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/storefront/products${query}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const payload = await response.json();
    return NextResponse.json(payload.data ?? { items: [] });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}