import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { userStore } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sorcerer_auth_token')?.value

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    const user = userStore.getSession(token)
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    return NextResponse.json({
      authenticated: true,
      user,
    })
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, user: null, error: err.message },
      { status: 500 },
    )
  }
}
