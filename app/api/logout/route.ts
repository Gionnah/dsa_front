// /api/logout/route.ts

import { removeCookie } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
    removeCookie('Access');
    removeCookie('Refresh');
    return NextResponse.json({ ok: 'ok' }, { status: 200 });
}