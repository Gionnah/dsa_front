// /api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

const URL = process.env.API_URL;

export async function GET(req: NextRequest) {
    const response = await fetch(`${URL}/accounts/users/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
        },
    });
    const data = await response.json();
    return NextResponse.json({data, api_url: process.env.API_URL?.split('/api')[0] || ''});
}