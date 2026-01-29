import { NextResponse, NextRequest } from 'next/server'

const protectedRoutes = ['/members', ]
const publicRoutes = ['/login', '/register', '/', '/reset-password']
const authRoutes = ['/login', '/register', '/reset-password']

// Rate limiting simple
const rateLimitMap = new Map()
const RATE_LIMIT = {
  max: 10000000000, // 100 requêtes
  window: 900000, // 15 minutes
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl
  
  // === 1. RÉCUPÉRATION DE L'IP ===
  const ip = getClientIP(req)
  
  // === 2. RATE LIMITING (seulement pour les routes critiques) ===
  if (isRateLimitRoute(pathname)) {
    if (!await checkRateLimit(ip)) {
      console.log(`[RATE LIMIT] IP: ${ip} - Path: ${pathname}`)
      return new Response('Too Many Requests', { status: 429 })
    }
  }

  // === 3. SÉCURITÉ HEADERS ===
  const response = NextResponse.next()
  
  // Headers de sécurité de base
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // === 4. LOGIQUE D'AUTHENTIFICATION ===
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)
  const isPublic = publicRoutes.includes(pathname) || !isProtected

  // Si route publique, on laisse passer
  if (isPublic && !isAuthRoute) {
    return response
  }

  const accessToken = req.cookies.get('Access')?.value
  const refreshToken = req.cookies.get('Refresh')?.value
  const hasValidTokens = !!(accessToken || refreshToken)

  // === 5. GESTION DES ROUTES PROTÉGÉES ===
  if (isProtected) {
    // Si pas de tokens, redirection login
    if (!hasValidTokens) {
      return redirectToLogin(req, pathname)
    }

    // Si access token présent, on laisse passer
    if (accessToken) {
      return response
    }

    // Si seulement refresh token, on tente de refresh
    if (refreshToken && !accessToken) {
      return handleTokenRefresh(req, pathname)
    }
  }

  // === 6. GESTION DES ROUTES D'AUTH (login/register) ===
  if (isAuthRoute && hasValidTokens) {
    // Si déjà authentifié, redirection vers home
    const homeUrl = new URL('/members/home', origin)
    console.log(`[AUTH] User already authenticated, redirecting to home`)
    return NextResponse.redirect(homeUrl)
  }

  return response
}

// === FONCTIONS UTILITAIRES ===

function getClientIP(req: NextRequest): string {
  // Plusieurs headers possibles selon l'infrastructure
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  const cfConnectingIP = req.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback pour le développement
  return '127.0.0.1'
}

function isRateLimitRoute(pathname: string): boolean {
  // Appliquer le rate limiting seulement sur les routes sensibles
  const rateLimitRoutes = ['/api/', '/login', '/register', '/members']
  return rateLimitRoutes.some(route => pathname.startsWith(route))
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT.window

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }

  const requests = rateLimitMap.get(ip)
  const validRequests = requests.filter((time: number) => time > windowStart)
  rateLimitMap.set(ip, validRequests)

  if (validRequests.length >= RATE_LIMIT.max) {
    return false
  }

  validRequests.push(now)
  return false
}

function redirectToLogin(req: NextRequest, originalPath: string): NextResponse {
  const loginUrl = new URL('/login', req.nextUrl.origin)
  
  if (originalPath !== '/login') {
    loginUrl.searchParams.set('redirect', originalPath)
  }

  console.log(`[AUTH] No valid tokens, redirecting to login from: ${originalPath}`)
  
  // Optionnel: supprimer les cookies invalides
  const response = NextResponse.redirect(loginUrl)
  response.cookies.delete('Access')
  response.cookies.delete('Refresh')
  
  return response
}

function handleTokenRefresh(req: NextRequest, originalPath: string): NextResponse {
  const loginUrl = new URL('/login', req.nextUrl.origin)
  loginUrl.searchParams.set('refresh', 'true')
  loginUrl.searchParams.set('redirect', originalPath)

  console.log(`[AUTH] Refresh token detected, redirecting to handle refresh`)

  return NextResponse.redirect(loginUrl)
}

// Nettoyage périodique du rate limiting
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [ip, requests] of rateLimitMap.entries()) {
      const validRequests = requests.filter((time: number) => now - time < RATE_LIMIT.window)
      if (validRequests.length === 0) {
        rateLimitMap.delete(ip)
      } else {
        rateLimitMap.set(ip, validRequests)
      }
    }
  }, 60000) // Nettoyage chaque minute
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
