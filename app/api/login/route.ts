// /api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();
    const result = await fetch(`${process.env.API_URL}/accounts/login/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    });
    if (!result.ok) {
        return NextResponse.json({ error: 'Authentication failed', ok: ''}, { status: 401 });
    }
    const data = await result.json();
    setCookie('Access', data.access);
    setCookie('Refresh', data.refresh);
    return NextResponse.json({ ok: 'ok' }, { status: 200 });
}