// /api/contests/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const data = await fetch(`${process.env.API_URL}/contests`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            }
        }
    );
    const contests = await data.json();
    return NextResponse.json(contests);
}
