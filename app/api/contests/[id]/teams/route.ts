// /api/contests/[id]/teams/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params; 
    const { nom } = await req.json();
    
    if (!nom) {
        return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    const team = await fetch(`${process.env.API_URL}/teams/create/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contest: parseInt(id),
            nom: nom
        }),
    });
    if (team.ok)
        return NextResponse.json({
            ok : 'ok',
        });
    return NextResponse.json({ error: 'Error creating team' }, { status: 500 });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> })
{
    const { id } = await params; 
    const response = await fetch(`${process.env.API_URL}/contests/${id}/check-role/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        }
    });

    const dataTeam = await response.json();
    return NextResponse.json({dataTeam})
}

export async function DELETE(req: NextRequest)
{
    const { id } = await req.json();
    const response = await fetch(`${process.env.API_URL}/teams/${id}/remove/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
            "Content-Type": "application/json",
        }
    });

    const dataTeam = await response.json();
    return NextResponse.json({dataTeam})
}