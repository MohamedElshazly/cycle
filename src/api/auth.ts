import { createClient } from '@/lib/supabase/client'

export async function getCurrentUser() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) throw error

  return data.user
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error

  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}

export async function getOnboardingStatus(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', userId)
    .single()

  if (error) throw error

  return data.onboarding_completed ?? false
}
