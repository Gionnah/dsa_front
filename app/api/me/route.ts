// /api/me/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    // Simulated user data
    const result = await fetch(`${process.env.API_URL}/accounts/me/`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
    if (!result.ok)
        return NextResponse.json({ok: ''}, {status: 500})
    const data = await result.json();
    return NextResponse.json({ok: 'ok', data}, {status: 200});
}