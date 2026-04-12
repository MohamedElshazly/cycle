import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	getCycleById,
	graduateCycle,
	closeCycle,
	pauseCycle,
	updateCycleStatus,
} from '@/api/cycles'
import type { CycleStatus } from '@/types/Cycle'

export function useCycle(id: string | null) {
	const queryClient = useQueryClient()

	const {
		data: cycle = null,
		isPending: loading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['cycle', id],
		queryFn: () => getCycleById(id!),
		enabled: !!id,
	})

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ['cycle', id] })
		queryClient.invalidateQueries({ queryKey: ['cycles'] })
	}

	const graduateMutation = useMutation({
		mutationFn: (note?: string) => {
			if (!id) throw new Error('id is required to graduate a cycle')
			return graduateCycle(id, note)
		},
		onSuccess: invalidate,
	})

	const closeMutation = useMutation({
		mutationFn: (params: { contextTags?: string[]; note?: string } | undefined) => {
			if (!id) throw new Error('id is required to close a cycle')
			return closeCycle(id, params)
		},
		onSuccess: invalidate,
	})

	const pauseMutation = useMutation({
		mutationFn: () => {
			if (!id) throw new Error('id is required to pause a cycle')
			return pauseCycle(id)
		},
		onSuccess: invalidate,
	})

	const updateStatusMutation = useMutation({
		mutationFn: (status: CycleStatus) => {
			if (!id) throw new Error('id is required to update cycle status')
			return updateCycleStatus(id, status)
		},
		onSuccess: invalidate,
	})

	return {
		cycle,
		loading,
		error: error as Error | null,
		refetch,
		graduate: graduateMutation.mutateAsync,
		close: closeMutation.mutateAsync,
		pause: pauseMutation.mutateAsync,
		updateStatus: updateStatusMutation.mutateAsync,
	}
}
