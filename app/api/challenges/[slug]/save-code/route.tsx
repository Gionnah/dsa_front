// /api/challenges/[slug]/save-code/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, {params} :  { params: Promise<{ slug: string }>}) {
    const { slug } = await params;

    const { code } = await req.json();
    const res = await fetch(`${process.env.API_URL}/challenges/${slug}/save-code/`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code })
        }
    );
    if (!res.ok) {
        return NextResponse.json('Failed to save code', { status: res.status });
    }
    return NextResponse.json({ok: 'ok!'}, { status: 200 });
}