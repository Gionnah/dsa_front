// /api/is-admin/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const res = await fetch(`${process.env.API_URL}/accounts/is-admin`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            },
            credentials: "include",
        }
    );
    const data = await res.json();
    if (!res.ok) {
        return NextResponse.json({ error: data.message }, { status: res.status });
    }
    return NextResponse.json(data);
}