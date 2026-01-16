// /app/api/contests/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params; 
    
    const contest = await fetch(`${process.env.API_URL}/contests/${id}/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        },
    });

    const teams = await fetch(`${process.env.API_URL}/contests/${id}/teams/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        },
    });

    const challenges = await fetch(`${process.env.API_URL}/contests/${id}/challenges/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        },
    });

    const leaderboard = await fetch(`${process.env.API_URL}/contests/${id}/leaderboard`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        },
    });
    
    return NextResponse.json({
        details : await contest.json(),
        teams: await teams.json(),
        challenges: await challenges.json(),
        leaderboard: await leaderboard.json(),
    });
}
