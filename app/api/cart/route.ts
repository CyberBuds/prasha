import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function forward(request: Request) {
  const apiUrl = process.env.VASTRA_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ success: false, data: null, message: 'Vastra API is not configured' }, { status: 503 });
  }

  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/cart${new URL(request.url).search}`, {
    method: request.method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body,
    cache: 'no-store'
  });

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { 'content-type': response.headers.get('content-type') || 'application/json' }
  });
}

export async function GET(request: Request) {
  try {
    return await forward(request);
  } catch {
    return NextResponse.json({ success: false, data: null, message: 'Cart service unavailable' }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    return await forward(request);
  } catch {
    return NextResponse.json({ success: false, data: null, message: 'Cart service unavailable' }, { status: 502 });
  }
}