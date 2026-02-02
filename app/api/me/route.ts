// /api/me/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Simulated user data
    const result = await fetch(`${process.env.API_URL}/my-stats/`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        },
    });
    const challengesList = await fetch(`${process.env.API_URL}/challenges/my-challenges/`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        },
    });
    if (!result.ok)
        return NextResponse.json({ok: ''}, {status: 500})
    const stat = await result.json();
    const challenges = await challengesList.json();
    return NextResponse.json({ok: 'ok', stat, challenges, api_url: process.env.API_URL?.split('/api')[0] || ''}, {status: 200});
}