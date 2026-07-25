import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SorcererStore } from '@/lib/backend/store'
import { userStore } from '@/lib/auth'

async function getAuthUserId(): Promise<string> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sorcerer_auth_token')?.value
    if (token) {
      const user = userStore.getSession(token)
      if (user) return user.id
    }
  } catch (err) {
    console.error('Error reading auth session:', err)
  }
  return 'default'
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    let userId = url.searchParams.get('userId')
    if (!userId || userId === 'default') {
      userId = await getAuthUserId()
    }

    const state = await SorcererStore.getProfile(userId)
    return NextResponse.json({ success: true, state })
  } catch (error) {
    console.error('Error fetching sorcerer state:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sorcerer profile' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let { userId, updates } = body
    
    if (!userId || userId === 'default') {
      userId = await getAuthUserId()
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid updates payload' },
        { status: 400 },
      )
    }

    const state = await SorcererStore.saveProfile(userId, updates)
    return NextResponse.json({ success: true, state })
  } catch (error) {
    console.error('Error updating sorcerer state:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update sorcerer profile' },
      { status: 500 },
    )
  }
}
