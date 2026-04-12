export type CheckinResponse = 'yes' | 'no' | 'partially'

export type Checkin = {
  id: string
  cycle_id: string
  user_id: string
  created_at: string
  did_the_thing: CheckinResponse
  general_feeling: number // 1-5
  note: string | null
}
