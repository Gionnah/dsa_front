// /api/challenges/[slug]/test/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string, id: string} }) {
    const { slug, id } = params;

    const res = await fetch(`${process.env.API_URL}/challenges/${slug}/test-case/${id}/`);
}