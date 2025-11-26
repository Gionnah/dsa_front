// /api/challenges/[slug]/test/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { code } = await req.json();
    const res = await fetch(`${process.env.API_URL}/challenges/${slug}/test/`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }), 
        }
    );
    const data = await res.json();
    if (!res.ok) { 
        return NextResponse.json({ ok: "", error: 'Failed to fetch test case' }, { status: res.status }); 
    }
    console.log(data);
    return NextResponse.json( {ok: "ok", data}, {status: 200} );
}