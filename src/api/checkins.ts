import { createClient } from '@/lib/supabase/client'
import type { Checkin, CheckinResponse } from '@/types/Checkin'

export async function getCheckins(cycleId: string): Promise<Checkin[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createCheckin(params: {
  cycleId: string
  userId: string
  didTheThing: CheckinResponse
  generalFeeling: number
  note?: string
}): Promise<Checkin> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('checkins')
    .insert({
      cycle_id: params.cycleId,
      user_id: params.userId,
      did_the_thing: params.didTheThing,
      general_feeling: params.generalFeeling,
      note: params.note ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
