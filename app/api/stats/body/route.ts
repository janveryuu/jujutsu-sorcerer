import { NextResponse } from 'next/server'
import { SorcererStore } from '@/lib/backend/store'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') || 'default'
    const profile = await SorcererStore.getProfile(userId)
    return NextResponse.json({
      success: true,
      body: profile.body,
      weightKg: profile.weightKg,
    })
  } catch (error) {
    console.error('Error fetching body stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch body stats' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId = 'default', dateStr, weightKg } = body

    if (!dateStr || typeof weightKg !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid date or weight value' },
        { status: 400 },
      )
    }

    const updatedBody = await SorcererStore.logBodyWeight(userId, dateStr, weightKg)
    return NextResponse.json({ success: true, body: updatedBody })
  } catch (error) {
    console.error('Error updating body stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update body stats' },
      { status: 500 },
    )
  }
}
