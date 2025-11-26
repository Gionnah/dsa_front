// /api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();
    
    try {
        const result = await fetch(`${process.env.API_URL}/accounts/login/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        });
        
        if (!result.ok) {
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
        }
        
        const data = await result.json();
        
        const response = NextResponse.json({ ok: 'ok' }, { status: 200 });

        response.cookies.set({
            name: 'Access',
            value: data.access,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            domain: 'dsa.insi.mg',
            path: '/',
            maxAge: 60 * 60 * 2,
        });

        response.cookies.set({
            name: 'Refresh',
            value: data.refresh,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            domain: 'dsa.insi.mg',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
        
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}