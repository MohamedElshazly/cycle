import { useMutation } from '@tanstack/react-query'
import { createSnapshot } from '@/api/emotionalSnapshots'
import type { SnapshotContext } from '@/types/EmotionalSnapshot'

type SubmitParams = {
	userId: string
	homeStress: number
	loneliness: number
	energy: number
	generalStress: number
	context: SnapshotContext
}

export function useEmotionalSnapshot() {
	const mutation = useMutation({
		mutationFn: (params: SubmitParams) => createSnapshot(params),
	})

	return {
		submitting: mutation.isPending,
		error: mutation.error as Error | null,
		submit: mutation.mutateAsync,
	}
}
