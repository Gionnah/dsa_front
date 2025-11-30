// /api/leader-board/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest)
{
    const res = await fetch(`${process.env.API_URL}/leaderboard/global/`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            }
        }
    );
    const data = await res.json();

    return NextResponse.json(data, {status: 200});
}