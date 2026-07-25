import { NextResponse } from 'next/server'
import { SorcererStore } from '@/lib/backend/store'

export async function GET() {
  try {
    // We can't directly access memoryStore from outside the module easily if it's not exported,
    // but we can simulate a reset by overwriting the Supabase store and memory store.
    // However, store.ts exports SorcererStore. Let's just create a new store state.
    
    // We will just do a hacky reset by calling saveProfile with the default profile for 'default',
    // but that won't delete the other users.
    // Instead, let's just use globalThis to wipe it if it's there.
    const globalStore = globalThis as any;
    if (globalStore.__sorcerer_store) {
      delete globalStore.__sorcerer_store;
    }
    
    // Also let's wipe the Supabase store
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      // Fetch default profile to initialize
      const DEFAULT_PROFILE = {
        onboarded: false,
        name: 'Sorcerer',
        aura: 'violet',
        goal: 'general',
        level: 7,
        xp: 420,
        ce: 1240,
        streak: 5,
        grade: 1,
        stats: { strength: 62, stamina: 54, agility: 48, endurance: 58, willpower: 66, technique: 44 },
        workoutsLogged: 23,
        conditioningLogged: 4,
        joinDate: 'Awakened 41 days ago',
        totalCe: 18240,
        longestStreak: 12,
        unlocked: ['t-awaken', 't-ember', 't-ironhide'],
        weekly: [320, 0, 480, 240, 0, 380, 160],
        body: [],
        completedMissionIds: [],
        gender: '', heightCm: 170, weightKg: 70, equipmentList: [], workoutDays: [], motivations: [], focusAreas: [], activityLevel: '', fitnessLevel: '', reminderEnabled: true,
      };

      const freshStore = {
        profiles: { default: DEFAULT_PROFILE },
        customMissions: { default: [] },
        leaderboard: []
      };

      await fetch(`${supabaseUrl}/rest/v1/sorcerer_store`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify([{ id: 'global', data: freshStore }]),
      })
    }

    // Also wipe local users
    const globalAuth = globalThis as any;
    if (globalAuth.__sorcerer_users) {
      globalAuth.__sorcerer_users.clear();
    }
    
    return NextResponse.json({ success: true, message: 'Backend reset successfully.' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
