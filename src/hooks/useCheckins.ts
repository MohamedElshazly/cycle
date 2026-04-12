import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCheckins, createCheckin } from '@/api/checkins'
import type { CheckinResponse } from '@/types/Checkin'

export function useCheckins(cycleId: string | null) {
	const queryClient = useQueryClient()

	const {
		data: checkins = [],
		isLoading: loading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['checkins', cycleId],
		queryFn: () => getCheckins(cycleId!),
		enabled: !!cycleId,
	})

	const mutation = useMutation({
		mutationFn: (params: {
			userId: string
			didTheThing: CheckinResponse
			generalFeeling: number
			note?: string
		}) => {
			if (!cycleId) throw new Error('cycleId is required to submit a check-in')
			return createCheckin({
				cycleId,
				userId: params.userId,
				didTheThing: params.didTheThing,
				generalFeeling: params.generalFeeling,
				note: params.note,
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['checkins', cycleId] })
		},
	})

	return {
		checkins,
		loading,
		error: error as Error | null,
		refetch,
		submit: mutation.mutateAsync,
		submitting: mutation.isPending,
	}
}
