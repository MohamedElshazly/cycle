export type CycleStatus = 'active' | 'paused' | 'graduated' | 'closed'

export type Cycle = {
  id: string
  user_id: string
  created_at: string
  name: string
  why_now: string | null
  success_vision: string | null
  status: CycleStatus
  ended_at: string | null
  closing_context_tags: string[] | null
  closing_note: string | null
  graduating_note: string | null
}
