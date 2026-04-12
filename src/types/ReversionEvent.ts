export type ReversionDeclaredBy = 'user' | 'app_nudge'
export type ReversionUnraveling = 'gradual' | 'specific_moment'
export type ReversionFeeling = 'relief' | 'shame' | 'numbness' | 'unknown' | 'other'
export type ReversionOutcome = 'resumed' | 'paused' | 'graduated' | 'closed'

export type ReversionEvent = {
  id: string
  cycle_id: string
  user_id: string
  created_at: string
  declared_by: ReversionDeclaredBy
  unraveling: ReversionUnraveling | null
  feeling: ReversionFeeling | null
  context_tags: string[] | null
  free_text: string | null
  outcome: ReversionOutcome | null
}
