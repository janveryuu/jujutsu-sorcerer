import { NextResponse } from 'next/server'
import { SorcererStore } from '@/lib/backend/store'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') || 'default'
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
    const { userId = 'default', updates } = body

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
