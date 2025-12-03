import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest)
{
    // const body = await req.json();

    // const res = await fetch(`${process.env.API_URL}/reset-password/`,
    //     {
    //         method: 'POST',
    //         body
    //     }
    // )
    // if (!res.ok)
    //     return NextResponse.json({ok: ''});
    return NextResponse.json({ok: 'Ok!'})
}