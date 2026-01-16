// /api/contests/[id]/teams/[team_id]/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ team_id: string }> })
{
    const { team_id } = await params; 
    const response = await fetch(`${process.env.API_URL}/teams/${team_id}/members/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        }
    });

    const listTeam = await response.json();
    return NextResponse.json({listTeam})
}