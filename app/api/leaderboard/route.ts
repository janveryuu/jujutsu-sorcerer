import { NextResponse } from 'next/server'
import { SorcererStore, type LeaderboardEntry } from '@/lib/backend/store'

export async function GET() {
  try {
    const leaderboard = await SorcererStore.getLeaderboard()
    return NextResponse.json({ success: true, leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { entry } = body as { entry: LeaderboardEntry }

    if (!entry || !entry.id || !entry.name) {
      return NextResponse.json(
        { success: false, error: 'Invalid leaderboard entry payload' },
        { status: 400 },
      )
    }

    const leaderboard = await SorcererStore.syncLeaderboard(entry)
    return NextResponse.json({ success: true, leaderboard })
  } catch (error) {
    console.error('Error syncing leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync leaderboard' },
      { status: 500 },
    )
  }
}
