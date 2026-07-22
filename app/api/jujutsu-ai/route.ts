import { NextResponse } from 'next/server'
import { generateAIMission, askJujutsuSensei } from '@/lib/groq-client'
import { SorcererStore } from '@/lib/backend/store'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, payload, userId = 'default' } = body

    if (action === 'generate-mission') {
      const mission = await generateAIMission(payload)
      // Automatically persist forged AI mission to user's roster
      try {
        await SorcererStore.saveCustomMission(userId, mission)
      } catch (err) {
        console.error('Non-blocking error saving custom AI mission:', err)
      }
      return NextResponse.json({ success: true, mission })
    }

    if (action === 'sensei-advice') {
      const answer = await askJujutsuSensei(payload)
      return NextResponse.json({ success: true, answer })
    }

    return NextResponse.json(
      { success: false, error: 'Unknown action type' },
      { status: 400 },
    )
  } catch (error) {
    console.error('API Error in /api/jujutsu-ai:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI response' },
      { status: 500 },
    )
  }
}
