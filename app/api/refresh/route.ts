import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const redirectPath = searchParams.get('redirect') || '/'

  const cookies = req.headers.get('cookie') || ''
  const refreshMatch = cookies.match(/Refresh=([^;]+)/)
  const refreshToken = refreshMatch ? refreshMatch[1] : null

  if (!refreshToken) {
    return NextResponse.redirect(`/login?from=${redirectPath}`)
  }

  const res = await fetch(`${process.env.API_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (res.ok) {
    const data = await res.json()
    const response = NextResponse.redirect(redirectPath)
    response.cookies.set('Access', data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2h
    })
    return response
  }

  // Si refresh échoue
  const failResponse = NextResponse.redirect(`/login?message=Session expired`)
  failResponse.cookies.delete('Access')
  failResponse.cookies.delete('Refresh')
  return failResponse
}
