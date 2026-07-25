import type { Exercise, Mission, CurseRankKey } from './sorcerer-data'

export interface AIMissionRequest {
  durationMin: number
  focus: string
  equipment: string
  rank: CurseRankKey
  sorcererLevel: number
  sorcererName: string
}

export interface AISenseiRequest {
  question: string
  sorcererName: string
  level: number
  gradeLabel: string
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.1-8b-instant'

/**
 * Generates a customized Jujutsu Exorcism Mission using Groq Llama 3 API.
 * Falls back to high-quality procedural mission if API key is not configured.
 */
export async function generateAIMission(req: AIMissionRequest): Promise<Mission> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    return generateFallbackMission(req)
  }

  const prompt = `You are the Special Grade Tactical Coordinator for the Jujutsu Sorcerer Academy.
Generate a custom Exorcism Mission (fitness workout) for Sorcerer "${req.sorcererName}" (Level ${req.sorcererLevel}).

Mission Parameters:
- Duration: ${req.durationMin} minutes
- Targeted Focus Area: ${req.focus}
- Available Equipment: ${req.equipment}
- Assigned Curse Rank: ${req.rank}

Return strictly valid JSON matching this schema:
{
  "name": "string (Creative JJK mission title, e.g. 'Domain Raid: Obsidian Cleave')",
  "focus": "string (Short summary, e.g. '${req.focus} · ${req.durationMin} min')",
  "durationMin": ${req.durationMin},
  "rank": "${req.rank}",
  "ce": number (Cursed energy earned, between 180 and 450 based on difficulty),
  "xp": number (XP earned, between 90 and 220),
  "loreIntro": "string (2 sentences of immersive JJK narrative describing the cursed spirit threat)",
  "exercises": [
    {
      "name": "string (Exercise name)",
      "sets": number (between 2 and 4),
      "reps": "string (e.g. '12 reps' or '45 sec')",
      "restSec": number (between 45 and 90),
      "targetStat": "strength" | "stamina" | "agility" | "endurance" | "willpower" | "technique",
      "cue": "string (Brief form tip or cursed energy visualization cue)"
    }
  ]
}
Return ONLY JSON without markdown fences or extra explanation.`

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You output strictly valid JSON format matching the requested schema.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!res.ok) {
      console.error('Groq API Error:', await res.text())
      return generateFallbackMission(req)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''
    const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanJson)

    return {
      id: `ai-mission-${Date.now()}`,
      name: parsed.name || `${req.focus} Exorcism`,
      focus: parsed.focus || `${req.focus} · ${req.durationMin} min`,
      durationMin: Number(parsed.durationMin) || req.durationMin,
      rank: req.rank,
      ce: Number(parsed.ce) || req.durationMin * 10,
      xp: Number(parsed.xp) || req.durationMin * 5,
      exercises: Array.isArray(parsed.exercises)
        ? parsed.exercises.map((e: any) => ({
            name: e.name || 'Cursed Energy Channeling',
            sets: Number(e.sets) || 3,
            reps: e.reps || '12 reps',
            restSec: Number(e.restSec) || 60,
            targetStat: e.targetStat || 'strength',
            cue: e.cue || 'Maintain core tension and breathe rhythmically.',
          }))
        : generateFallbackMission(req).exercises,
    }
  } catch (err) {
    console.error('Failed to parse Groq response:', err)
    return generateFallbackMission(req)
  }
}

/**
 * Ask a Special Grade Sensei for training advice using Groq Llama 3.
 */
export async function askJujutsuSensei(req: AISenseiRequest): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    return `[Sensei Llama-3 Simulation]: Focus on refining your technique first, Sorcerer ${req.sorcererName}. At ${req.gradeLabel}, consistency in form generates far more Cursed Output than reckless speed. Keep your shoulders packed and breathe steadily through every repetition.`
  }

  const prompt = `You are a legendary Special Grade Jujutsu Mentor speaking to your student "${req.sorcererName}" (${req.gradeLabel}, Level ${req.level}).
Respond directly and naturally to their message. If they just say hello, greet them back in character. If they ask for fitness advice, provide practical, evidence-based fitness advice framed in Jujutsu Sorcerer terminology (vessel discipline, cursed energy output, binding vows). Be conversational, sharp, and mentor-like. Keep your response concise (2-4 impactful sentences).

Student's message: "${req.question}"`

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 350,
      }),
    })

    if (!res.ok) {
      return `Even a Special Grade must adapt. Remember: technique before load. Maintain tension in your core and breathe rhythmically to maximize your vessel's output.`
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || 'Focus your energy and trust your training.'
  } catch {
    return 'Maintain disciplined form and recover well—your vessel grows stronger in rest.'
  }
}

/**
 * Procedural Fallback Mission when GROQ_API_KEY is not yet configured
 */
function generateFallbackMission(req: AIMissionRequest): Mission {
  const exercises: Exercise[] = [
    {
      name: `${req.focus} Activation Strike`,
      sets: 3,
      reps: '12 reps',
      restSec: 60,
      targetStat: 'strength',
      cue: 'Explode upward on concentric phase, control descent.',
    },
    {
      name: 'Domain Containment Hold',
      sets: 3,
      reps: '45 sec',
      restSec: 45,
      targetStat: 'endurance',
      cue: 'Brace core as if withstanding high cursed pressure.',
    },
    {
      name: 'Black Flash Tempo Sequence',
      sets: 4,
      reps: '10 reps',
      restSec: 60,
      targetStat: 'technique',
      cue: 'Pause 2 seconds at peak contraction before releasing.',
    },
    {
      name: 'Vessel Conditioning Finisher',
      sets: 2,
      reps: '15 reps',
      restSec: 45,
      targetStat: 'stamina',
      cue: 'Keep continuous tension without locking joints.',
    },
  ]

  return {
    id: `ai-mission-${Date.now()}`,
    name: `Llama-3 Raid: ${req.focus}`,
    focus: `${req.focus} · ${req.durationMin} min (${req.equipment})`,
    durationMin: req.durationMin,
    rank: req.rank,
    ce: Math.round(req.durationMin * 11),
    xp: Math.round(req.durationMin * 5.5),
    exercises,
  }
}
