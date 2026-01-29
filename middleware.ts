import { NextResponse, NextRequest } from 'next/server'

const protectedRoutes = ['/members']
const authRoutes = ['/login', '/register', '/reset-password']

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl
  
  // === SÉCURITÉ HEADERS ===
  const response = NextResponse.next()
  
  // Headers de sécurité de base
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // === LOGIQUE D'AUTHENTIFICATION ===
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)

  const accessToken = req.cookies.get('Access')?.value
  const hasValidToken = !!accessToken

  // === GESTION DES ROUTES PROTÉGÉES ===
  if (isProtected && !hasValidToken) {
    // Si route protégée et pas de token, redirection login
    console.log(`[AUTH] Access denied to protected route: ${pathname}`)
    return redirectToLogin(req, pathname)
  }

  // === GESTION DES ROUTES D'AUTH (login/register) ===
  if (isAuthRoute && hasValidToken) {
    // Si déjà authentifié, redirection vers home
    const homeUrl = new URL('/members/home', origin)
    console.log(`[AUTH] User already authenticated, redirecting to home`)
    return NextResponse.redirect(homeUrl)
  }

  return response
}

// === FONCTIONS UTILITAIRES ===

function redirectToLogin(req: NextRequest, originalPath: string): NextResponse {
  const loginUrl = new URL('/login', req.nextUrl.origin)
  
  if (originalPath !== '/login') {
    loginUrl.searchParams.set('redirect', originalPath)
  }

  console.log(`[AUTH] No access token, redirecting to login from: ${originalPath}`)
  
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
