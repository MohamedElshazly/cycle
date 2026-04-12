export type SnapshotContext = 'onboarding' | 'monthly' | 'reversion'

export type EmotionalSnapshot = {
  id: string
  user_id: string
  created_at: string
  home_stress: number // 1-5
  loneliness: number // 1-5
  energy: number // 1-5
  general_stress: number // 1-5
  context: SnapshotContext
}
