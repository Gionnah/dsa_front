// /api/contests/invitation

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest)
{
    try{
        const response = await fetch(`${process.env.API_URL}/invitations/me/`,
        {
            headers: {
                "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
                "Content-Type": "application/json",
            },
        }
        );
        const data = await response.json();
        console.log(data);
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