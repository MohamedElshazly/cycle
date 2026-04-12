import { createClient } from '@/lib/supabase/client'
import type {
  ReversionEvent,
  ReversionDeclaredBy,
  ReversionUnraveling,
  ReversionFeeling,
  ReversionOutcome,
} from '@/types/ReversionEvent'

export async function createReversionEvent(params: {
  cycleId: string
  userId: string
  declaredBy: ReversionDeclaredBy
  unraveling?: ReversionUnraveling
  feeling?: ReversionFeeling
  contextTags?: string[]
  freeText?: string
  outcome?: ReversionOutcome
}): Promise<ReversionEvent> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reversion_events')
    .insert({
      cycle_id: params.cycleId,
      user_id: params.userId,
      declared_by: params.declaredBy,
      unraveling: params.unraveling ?? null,
      feeling: params.feeling ?? null,
      context_tags: params.contextTags ?? null,
      free_text: params.freeText ?? null,
      outcome: params.outcome ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getReversionEvents(cycleId: string): Promise<ReversionEvent[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reversion_events')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
