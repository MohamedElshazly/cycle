import { createClient } from '@/lib/supabase/client'
import type { Cycle, CycleStatus } from '@/types/Cycle'

export async function getCycles(userId: string): Promise<Cycle[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getCycleById(id: string): Promise<Cycle | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createCycle(params: {
  userId: string
  name: string
  whyNow?: string
  successVision?: string
}): Promise<Cycle> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cycles')
    .insert({
      user_id: params.userId,
      name: params.name,
      why_now: params.whyNow ?? null,
      success_vision: params.successVision ?? null,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCycleStatus(id: string, status: CycleStatus): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('cycles')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}

export async function graduateCycle(id: string, note?: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('cycles')
    .update({
      status: 'graduated',
      ended_at: new Date().toISOString(),
      graduating_note: note ?? null,
    })
    .eq('id', id)

  if (error) throw error
}

export async function closeCycle(
  id: string,
  params?: {
    contextTags?: string[]
    note?: string
  }
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('cycles')
    .update({
      status: 'closed',
      ended_at: new Date().toISOString(),
      closing_context_tags: params?.contextTags ?? null,
      closing_note: params?.note ?? null,
    })
    .eq('id', id)

  if (error) throw error
}

export async function pauseCycle(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('cycles')
    .update({ status: 'paused' })
    .eq('id', id)

  if (error) throw error
}
