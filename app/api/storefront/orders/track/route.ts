import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const apiUrl = process.env.VASTRA_API_URL;
  const requestUrl = new URL(request.url);
  const orderNumber = requestUrl.searchParams.get('orderNumber');
  const email = requestUrl.searchParams.get('email');

  if (!apiUrl || !orderNumber || !email) {
    return NextResponse.json({ success: false, message: 'Order number and email are required' }, { status: 400 });
  }

  try {
    const target = `${apiUrl.replace(/\/$/, '')}/storefront/orders/track/${encodeURIComponent(orderNumber)}?email=${encodeURIComponent(email)}`;
    const response = await fetch(target, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { 'content-type': response.headers.get('content-type') || 'application/json' }
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Tracking service unavailable' }, { status: 502 });
  }
}