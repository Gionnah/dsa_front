// /api/contests/invitation

import { NextRequest, NextResponse } from "next/server";

const api_url = process.env.API_URL;

export async function GET(req: NextRequest)
{
    try{
        const response = await fetch(`${api_url}/invitations/me/`,
        {
            headers: {
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
                "Content-Type": "application/json",
            },
        }
        );
        const data = await response.json();
        return NextResponse.json(
            {
                data
            }
        )   
    }
    catch (e) {
        console.error(e)
    }   
}

export async function POST(req: NextRequest) {
    try {
        const {token, mode} = await req.json()
        if (mode == 'accept'){
            const data = await fetch(`${api_url}/invitations/accept/${token}/`, 
                {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
                        "Content-Type": "application/json",
                    },
                }
            )
        }
        else if (mode == 'decline')
        {
            const data = await fetch(`${api_url}/invitations/decline/${token}/`, 
                {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
                        "Content-Type": "application/json",
                    },
                }
            )
        }

        return NextResponse.json({ok: 'ok'}, {status: 200});

    }
    catch (e) {
        console.error(e);
        return NextResponse.json({status: 500})
    }
}