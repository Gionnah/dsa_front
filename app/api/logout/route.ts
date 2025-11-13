// /api/logout/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const response = NextResponse.json({ ok: 'ok' }, { status: 200 });
    response.cookies.delete('Access');
    response.cookies.delete('Refresh');
    return response;
}