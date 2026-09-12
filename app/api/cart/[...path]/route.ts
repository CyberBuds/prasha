import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function forward(request: Request, path: string[]) {
  const apiUrl = process.env.VASTRA_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ success: false, data: null, message: 'Vastra API is not configured' }, { status: 503 });
  }

  const target = `${apiUrl.replace(/\/$/, '')}/cart/${path.join('/')}`;
  const headers = new Headers({ Accept: 'application/json' });
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
  const response = await fetch(target + new URL(request.url).search, {
    method: request.method,
    headers,
    body,
    cache: 'no-store'
  });

  const responseBody = await response.text();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: { 'content-type': response.headers.get('content-type') || 'application/json' }
  });
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    return await forward(request, (await context.params).path);
  } catch {
    return NextResponse.json({ success: false, data: null, message: 'Cart service unavailable' }, { status: 502 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    return await forward(request, (await context.params).path);
  } catch {
    return NextResponse.json({ success: false, data: null, message: 'Cart service unavailable' }, { status: 502 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    return await forward(request, (await context.params).path);
  } catch {
    return NextResponse.json({ success: false, data: null, message: 'Cart service unavailable' }, { status: 502 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    return await forward(request, (await context.params).path);
  } catch {
    return NextResponse.json({ success: false, data: null, message: 'Cart service unavailable' }, { status: 502 });
  }
}