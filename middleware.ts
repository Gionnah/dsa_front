
import { NextResponse, NextRequest } from 'next/server'

const protectedRoutes = ['/home', '/editor', '/challenges']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  

  if (!isProtected) return NextResponse.next()

  const access = req.cookies.get('Access')?.value
  const refresh = req.cookies.get('Refresh')?.value

  if (!isProtected) return NextResponse.next()
  if (!access && !refresh) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (access)
    return NextResponse.next();

  // Si access invalide mais refresh présent, redirige vers une route Next.js qui gère le refresh côté serveur
  if (refresh) {
    const refreshUrl = new URL('/login', req.url)
    refreshUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(refreshUrl)
  }
  

  if (refresh && access && pathname === '/login') {
    const refreshUrl = new URL('/home', req.url)
    refreshUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(refreshUrl)
  }

  return NextResponse.redirect(new URL('/login', req.url))
}

export const config = {
  matcher: ['/home/:path*', '/editor/:path*', '/challenges/:path*'],
}
