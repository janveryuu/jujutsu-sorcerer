import { NextResponse } from 'next/server'
import { userStore, hashPassword, verifyPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, email, password, name } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 },
      )
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 },
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (action === 'sign-up') {
      const existing = userStore.findByEmail(normalizedEmail)
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: 'An account with this email address already exists. Please sign in.',
          },
          { status: 400 },
        )
      }

      const hashedPassword = hashPassword(password)

      const newUser = userStore.create({
        email: normalizedEmail,
        name: name?.trim() || normalizedEmail.split('@')[0],
        passwordHash: hashedPassword,
        provider: 'email',
      })

      const token = userStore.createSession(newUser)

      const response = NextResponse.json({
        success: true,
        user: newUser,
        token,
        message: 'Account created successfully!',
      })

      response.cookies.set('sorcerer_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      return response
    }

    // Sign in flow
    const user = userStore.findByEmail(normalizedEmail)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address. Please sign up.' },
        { status: 404 },
      )
    }

    const isValidPassword = verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401 },
      )
    }

    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    }

    const token = userStore.createSession(authUser)

    const response = NextResponse.json({
      success: true,
      user: authUser,
      token,
      message: 'Signed in successfully!',
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
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 },
    )
  }
}

