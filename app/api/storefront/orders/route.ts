import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, data: null, message: 'Please log in to view your orders.' }, { status: 401 });
  }

  const apiUrl = process.env.VASTRA_API_URL;
  if (!apiUrl) return NextResponse.json({ success: false, data: null, message: 'Vastra API is not configured' }, { status: 503 });

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/storefront/orders`, {
      headers: { Accept: 'application/json', Authorization: authorization },
      cache: 'no-store'
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { 'content-type': response.headers.get('content-type') || 'application/json' }
    });
  } catch {
    return NextResponse.json({ success: false, data: null, message: 'Order service unavailable' }, { status: 502 });
  }
}
