import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, signInWithGoogle, signOut, getOnboardingStatus } from '@/api/auth'
import { useRouter } from 'next/navigation'

export function useAuth() {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { data: user, isLoading, error } = useQuery({
		queryKey: ['auth', 'user'],
		queryFn: getCurrentUser,
		staleTime: 5 * 60 * 1000,
		retry: false,
	})

	const { data: onboardingCompleted } = useQuery({
		queryKey: ['auth', 'onboarding', user?.id],
		queryFn: () => getOnboardingStatus(user!.id),
		enabled: !!user,
		staleTime: 5 * 60 * 1000,
	})

	const signInMutation = useMutation({
		mutationFn: signInWithGoogle,
	})

	const signOutMutation = useMutation({
		mutationFn: signOut,
		onSuccess: () => {
			queryClient.clear()
			router.push('/login')
		},
	})

	return {
		user: user ?? null,
		userId: user?.id ?? null,
		onboardingCompleted: onboardingCompleted ?? false,
		isLoading,
		error,
		signIn: signInMutation.mutateAsync,
		signOut: signOutMutation.mutateAsync,
	}
}
