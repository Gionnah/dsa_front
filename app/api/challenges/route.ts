// /api/challenges/route.ts
import { NextRequest, NextResponse } from "next/server";

const URL = process.env.API_URL;

export async function GET(req: NextRequest) {
    const response = await fetch(`${URL}/challenges/` , {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return NextResponse.json(data);
}