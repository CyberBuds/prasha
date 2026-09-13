import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, data: null, message: 'Please log in to your account to proceed with checkout.' },
      { status: 401 }
    );
  }

  const apiUrl = process.env.VASTRA_API_URL;
  if (!apiUrl) return NextResponse.json({ success: false, message: 'Vastra API is not configured' }, { status: 503 });

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/storefront/checkout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: authorization } : {})
      },
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
