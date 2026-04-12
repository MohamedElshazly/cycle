import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReflections, createReflection } from '@/api/reflections'

export function useReflections(userId: string | null) {
	const queryClient = useQueryClient()

	const {
		data: reflections = [],
		isLoading: loading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['reflections', userId],
		queryFn: () => getReflections(userId!),
		enabled: !!userId,
	})

	const mutation = useMutation({
		mutationFn: (content: string) => {
			if (!userId) throw new Error('userId is required')
			return createReflection({ userId, content })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reflections', userId] })
		},
	})

	return {
		reflections,
		loading,
		error: error as Error | null,
		refetch,
		submit: mutation.mutateAsync,
	}
}
