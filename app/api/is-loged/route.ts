// /api/is-loged/route.ts

import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest)
{
    const access = await req.cookies.get('Access');
    const refresh = await req.cookies.get('Refresh');

    if (access && refresh)
        return NextResponse.json({ok: 'ok'}, {status: 200})
    return NextResponse.json({ok: ''}, {status: 200})
}