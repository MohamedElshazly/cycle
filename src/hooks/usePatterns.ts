import { useQuery } from '@tanstack/react-query'
import { getCycles } from '@/api/cycles'
import { getReversionEvents } from '@/api/reversionEvents'
import type { ReversionEvent, ReversionFeeling } from '@/types/ReversionEvent'

export type PatternInsights = {
	isUnlocked: boolean
	cycleCount: number
	completedCount: number
	mostCommonFeeling: ReversionFeeling | null
	mostCommonContextTags: string[]
	graduatedCount: number
	closedCount: number
	cycles: import('@/types/Cycle').Cycle[]
}

function deriveMostCommonFeeling(events: ReversionEvent[]): ReversionFeeling | null {
	const tally = new Map<ReversionFeeling, number>()

	for (const event of events) {
		if (event.feeling !== null) {
			tally.set(event.feeling, (tally.get(event.feeling) ?? 0) + 1)
		}
	}

	if (tally.size === 0) return null

	let topFeeling: ReversionFeeling | null = null
	let topCount = 0

	for (const [feeling, count] of tally) {
		if (count > topCount) {
			topFeeling = feeling
			topCount = count
		}
	}

	return topFeeling
}

function deriveTopContextTags(events: ReversionEvent[], limit: number): string[] {
	const tally = new Map<string, number>()

	for (const event of events) {
		if (event.context_tags !== null) {
			for (const tag of event.context_tags) {
				tally.set(tag, (tally.get(tag) ?? 0) + 1)
			}
		}
	}

	return Array.from(tally.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([tag]) => tag)
}

export function usePatterns(userId: string | null): {
	patterns: PatternInsights | null
	loading: boolean
	error: Error | null
} {
	const {
		data: patterns = null,
		isLoading: loading,
		error,
	} = useQuery({
		queryKey: ['patterns', userId],
		queryFn: async () => {
			const cycles = await getCycles(userId!)
			const reversionResults = await Promise.all(
				cycles.map((cycle) => getReversionEvents(cycle.id))
			)

			const allEvents = reversionResults.flat()
			const graduatedCount = cycles.filter((c) => c.status === 'graduated').length
			const closedCount = cycles.filter((c) => c.status === 'closed').length
			const completedCount = graduatedCount + closedCount

			const insights: PatternInsights = {
				isUnlocked: completedCount >= 2,
				cycleCount: cycles.length,
				completedCount,
				mostCommonFeeling: deriveMostCommonFeeling(allEvents),
				mostCommonContextTags: deriveTopContextTags(allEvents, 3),
				graduatedCount,
				closedCount,
				cycles,
			}

			return insights
		},
		enabled: !!userId,
	})

	return { patterns, loading, error: error as Error | null }
}
