import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { userStore } from '@/lib/auth'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sorcerer_auth_token')?.value

    if (token) {
      userStore.deleteSession(token)
    }

    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully.',
    })

    response.cookies.delete('sorcerer_auth_token')
    return response
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
