import { NextResponse } from 'next/server'
import { userStore } from '@/lib/auth'

// Simple helper to parse base64 encoded JWT payload without third-party native deps
function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8')
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, name, avatar, credential } = body

    let targetEmail = email
    let targetName = name
    let targetAvatar = avatar

    // If Google ID Token / Credential string is passed (from Google One-Tap / Identity Services)
    if (credential) {
      const decodedPayload = decodeJwtPayload(credential)
      if (decodedPayload && decodedPayload.email) {
        targetEmail = decodedPayload.email
        targetName = decodedPayload.name || targetName
        targetAvatar = decodedPayload.picture || targetAvatar
      }
    }

    // Default fallback demo user details if no credentials provided
    const userEmail = (targetEmail || `sorcerer.google.${Math.floor(Math.random() * 1000)}@gmail.com`).toLowerCase().trim()
    const userName = targetName || 'Satoru Gojo (Google)'
    const userAvatar =
      targetAvatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'

    let user = userStore.findByEmail(userEmail)

    if (!user) {
      user = userStore.create({
        email: userEmail,
        name: userName,
        avatar: userAvatar,
        provider: 'google',
      })
    } else {
      user = {
        ...user,
        provider: 'google',
        emailVerified: true,
      }
    }

    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: 'google' as const,
      emailVerified: true,
      createdAt: user.createdAt,
    }

    const token = userStore.createSession(authUser)

    const response = NextResponse.json({
      success: true,
      user: authUser,
      token,
      message: 'Authenticated with Google successfully!',
    })

    response.cookies.set('sorcerer_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to authenticate with Google' },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  // Support standard OAuth redirect callback if GOOGLE_CLIENT_ID is defined
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  if (googleClientId) {
    const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&response_type=code&scope=openid%20email%20profile`
    return NextResponse.redirect(googleAuthUrl)
  }

  // Fallback demo authorization endpoint
  return NextResponse.json({
    success: true,
    mode: 'demo',
    message:
      'Google Client ID not configured in environment. Interactive demo login active.',
  })
}

