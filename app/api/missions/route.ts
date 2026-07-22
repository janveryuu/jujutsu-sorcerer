import { NextResponse } from 'next/server'
import { MISSIONS } from '@/lib/sorcerer-data'
import { SorcererStore } from '@/lib/backend/store'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') || 'default'
    const custom = await SorcererStore.getCustomMissions(userId)
    return NextResponse.json({
      success: true,
      builtIn: MISSIONS,
      custom,
    })
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch missions' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId = 'default', mission } = body

    if (!mission || !mission.id || !mission.name) {
      return NextResponse.json(
        { success: false, error: 'Invalid mission payload' },
        { status: 400 },
      )
    }

    const custom = await SorcererStore.saveCustomMission(userId, mission)
    return NextResponse.json({ success: true, custom })
  } catch (error) {
    console.error('Error saving custom mission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save custom mission' },
      { status: 500 },
    )
  }
}
