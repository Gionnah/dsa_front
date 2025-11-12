// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

// Define routes that require authentication
const protectedRoutes = ['/home', '/editor', '/challenges']

// Fonction pour valider le token auprès de l'API Django
async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.API_URL}/accountsM/token/verify-access/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access: token})
    })
    const res = await response.json();
    return res.valid;
  } catch (error) {
    console.error('Token validation error:', error)
    return false
  }
}

async function refreshAccessToken(refreshToken: string): Promise<{ access: string } | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken })
    })

    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('Token refresh error:', error)
    return null
  }
}

function getServerCookie(request: NextRequest, name: string): string | undefined {
  return request.cookies.get(name)?.value
}

export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Check if the route is protected
//   const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

//   if (isProtected) {
//     const accessToken = getServerCookie(request, 'Access')
//     const refreshToken = getServerCookie(request, 'Refresh')

//     // Si aucun token n'est présent
//     if (!accessToken && !refreshToken) {
//       const loginUrl = new URL('/login', request.url)
//       loginUrl.searchParams.set('from', pathname)
//       return NextResponse.redirect(loginUrl)
//     }

//     // Si on a un access token, on le valide
//     if (accessToken) {
//       const isValid = await validateToken(accessToken)
      
//       if (isValid) {
//         // Token valide, on continue
//         return NextResponse.next()
//       }
//     }

//     // Si l'access token est invalide ou absent, on tente de rafraîchir
//     if (refreshToken) {
//       const newTokens = await refreshAccessToken(refreshToken)
      
//       if (newTokens && newTokens.access) {
//         // Créer une réponse et mettre à jour le cookie
//         const response = NextResponse.next()
        
//         // Mettre à jour l'access token
//         response.cookies.set('Access', newTokens.access, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           sameSite: 'lax',
//           maxAge: 60 * 15 // 15 minutes
//         })

//         return response
//       }
//     }

//     // Si tout échoue, redirection vers login
//     const loginUrl = new URL('/login', request.url)
//     loginUrl.searchParams.set('message', 'Session expired, please log in again.')
//     loginUrl.searchParams.set('from', pathname)
    
//     // Créer une redirection et supprimer les cookies invalides
//     const redirectResponse = NextResponse.redirect(loginUrl)
//     redirectResponse.cookies.delete('Access')
//     redirectResponse.cookies.delete('Refresh')
    
//     return redirectResponse
//   }

//   return NextResponse.next()
}

// Apply middleware to all protected routes
export const config = {
  matcher: ['/home/:path*', '/editor/:path*', '/challenges/:path*']
}