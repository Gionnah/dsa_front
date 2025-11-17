// /api/challenges/[slug]/test/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    const { slug } = params;

    const res = await fetch(`${process.env.API_URL}/challenges/${slug}/test/`);
}