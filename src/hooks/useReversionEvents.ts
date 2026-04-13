import { useQuery } from '@tanstack/react-query'
import { getReversionEvents } from '@/api/reversionEvents'
import type { ReversionEvent } from '@/types/ReversionEvent'

export function useReversionEvents(cycleId: string) {
	const query = useQuery<ReversionEvent[]>({
		queryKey: ['reversion-events', cycleId],
		queryFn: () => getReversionEvents(cycleId),
		enabled: !!cycleId,
	})

	return {
		reversionEvents: query.data ?? [],
		loading: query.isLoading,
		error: query.error as Error | null,
		refetch: query.refetch,
	}
}
