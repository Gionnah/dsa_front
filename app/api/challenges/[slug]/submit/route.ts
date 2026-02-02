// /api/challenges/[slug]/submit/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { code } = await req.json();
    const resChallenge = await fetch(`${process.env.API_URL}/challenges/${slug}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
        },
        credentials: "include",
    });
    if (!resChallenge.ok) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const dataChallenge = await resChallenge.json();

    if (!dataChallenge.in_contest) {
        const res = await fetch(`${process.env.API_URL}/challenges/${slug}/submit/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            },
            credentials: "include",
            body: JSON.stringify({code}),
        });

        const data = await res.json(); 
        if (!res.ok) {
            return NextResponse.json({ error: data.message }, { status: res.status });
        }
    }
    else {
        const resTeam = await fetch(`${process.env.API_URL}/contests/${dataChallenge.contest_id}/check-role/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
                "Content-Type": "application/json",
            }
        });

        const team = await resTeam.json();

        console.log(team, code)

        const res = await fetch(`${process.env.API_URL}/contests/${dataChallenge.contest_id}/challenges/${slug}/submit/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            },
            credentials: "include",
            body: JSON.stringify({ code, team_id: team.team_id }),
        });
        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data.message }, { status: res.status });
        }
        return NextResponse.json({ redirect: `/members/event/contest/${dataChallenge.contest_id}/` }, { status: 200 });
    }

    return NextResponse.json("ok", { status: 200 });
}
