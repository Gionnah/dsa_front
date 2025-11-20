// /api/submit/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = await params;
    const { code } = await req.json();
    const res = await fetch(`${process.env.API_URL}/challenges/${slug}/submit/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
        },
        credentials: "include",
        body: JSON.stringify({code}),
    });
    const data = await res.json(); 
    if (!res.ok) {
        return NextResponse.json({ error: data.message }, { status: res.status });
    }
    return NextResponse.json(data);
}