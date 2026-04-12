import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCycles, createCycle } from '@/api/cycles'

export function useCycles(userId: string | null) {
	const queryClient = useQueryClient()

	const {
		data: cycles = [],
		isLoading: loading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['cycles', userId],
		queryFn: () => getCycles(userId!),
		enabled: !!userId,
	})

	const mutation = useMutation({
		mutationFn: (params: { name: string; whyNow?: string; successVision?: string }) => {
			if (!userId) throw new Error('userId is required to create a cycle')
			return createCycle({ userId, ...params })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cycles', userId] })
		},
	})

	return {
		cycles,
		loading,
		error: error as Error | null,
		refetch,
		create: mutation.mutateAsync,
	}
}
