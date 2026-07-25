import { NextResponse } from 'next/server'
import { userStore } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(`${origin}?auth_error=${encodeURIComponent(error || 'Authorization failed')}`)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = `${origin}/api/auth/google/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}?auth_error=${encodeURIComponent('Google Client ID/Secret not configured')}`)
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.redirect(
        `${origin}?auth_error=${encodeURIComponent(tokenData.error_description || 'Failed to exchange authorization code')}`,
      )
    }

    // Fetch Google user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const profile = await profileRes.json()

    if (!profile.email) {
      return NextResponse.redirect(`${origin}?auth_error=${encodeURIComponent('Failed to fetch user email from Google')}`)
    }

    const email = profile.email.toLowerCase().trim()
    let user = userStore.findByEmail(email)

    if (!user) {
      user = userStore.create({
        email,
        name: profile.name || profile.email.split('@')[0],
        avatar: profile.picture,
        provider: 'google',
      })
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

    const response = NextResponse.redirect(`${origin}?auth_success=1`)

    response.cookies.set('sorcerer_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch (err: any) {
    return NextResponse.redirect(`${origin}?auth_error=${encodeURIComponent(err.message || 'OAuth server error')}`)
  }
}
