import { createClient } from '@/lib/supabase/client'
import type { Reflection } from '@/types/Reflection'

export async function createReflection(params: {
  userId: string
  content: string
}): Promise<Reflection> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reflections')
    .insert({
      user_id: params.userId,
      content: params.content,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getReflections(userId: string): Promise<Reflection[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
