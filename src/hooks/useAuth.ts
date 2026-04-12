import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/api/auth'

export function useAuth() {
	const { data: user, isLoading, error } = useQuery({
		queryKey: ['auth', 'user'],
		queryFn: getCurrentUser,
		staleTime: 5 * 60 * 1000,
		retry: false,
	})

	return {
		user: user ?? null,
		userId: user?.id ?? null,
		isLoading,
		error,
	}
}
