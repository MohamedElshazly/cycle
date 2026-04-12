import { createClient } from '@/lib/supabase/client'
import type { EmotionalSnapshot, SnapshotContext } from '@/types/EmotionalSnapshot'

export async function createSnapshot(params: {
  userId: string
  homeStress: number
  loneliness: number
  energy: number
  generalStress: number
  context: SnapshotContext
}): Promise<EmotionalSnapshot> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('emotional_snapshots')
    .insert({
      user_id: params.userId,
      home_stress: params.homeStress,
      loneliness: params.loneliness,
      energy: params.energy,
      general_stress: params.generalStress,
      context: params.context,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSnapshots(userId: string): Promise<EmotionalSnapshot[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('emotional_snapshots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
