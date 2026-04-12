import { useMutation } from '@tanstack/react-query'
import { createReversionEvent } from '@/api/reversionEvents'
import type {
	ReversionDeclaredBy,
	ReversionUnraveling,
	ReversionFeeling,
	ReversionOutcome,
} from '@/types/ReversionEvent'

export function useReversionEvent() {
	const mutation = useMutation({
		mutationFn: (params: {
			cycleId: string
			userId: string
			declaredBy: ReversionDeclaredBy
			unraveling?: ReversionUnraveling
			feeling?: ReversionFeeling
			contextTags?: string[]
			freeText?: string
			outcome?: ReversionOutcome
		}) => createReversionEvent(params),
	})

	return {
		submitting: mutation.isPending,
		error: mutation.error as Error | null,
		submit: mutation.mutateAsync,
	}
}
