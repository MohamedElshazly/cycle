'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { usePatterns } from '@/hooks/usePatterns'
import AppShell from '@/layouts/AppShell'
import { CycleStatusBadge } from '@/components/CycleStatusBadge'
import type { ReversionFeeling } from '@/types/ReversionEvent'

function buildInsightSentence(
	feeling: ReversionFeeling | null,
	contextTags: string[]
): string | null {
	if (!feeling && contextTags.length === 0) return null

	const feelingMap: Record<ReversionFeeling, string> = {
		relief: 'relief',
		shame: 'shame',
		numbness: 'numbness',
		unknown: 'uncertainty',
		other: 'mixed feelings',
	}

	const parts: string[] = []

	if (feeling) {
		parts.push(`feeling ${feelingMap[feeling]}`)
	}

	if (contextTags.length > 0) {
		const tagList = contextTags.join(', ')
		parts.push(tagList)
	}

	if (parts.length === 0) return null

	const conjunction = parts.length > 1 ? ' and ' : ''
	const joined = parts.join(conjunction)

	return `You tend to pause when ${joined} ${parts.length > 1 ? 'are' : 'is'} present.`
}

function calculateDaysActive(createdAt: string, endedAt: string | null): number {
	const start = new Date(createdAt)
	const end = endedAt ? new Date(endedAt) : new Date()
	const diffMs = end.getTime() - start.getTime()
	return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export default function PatternsPage() {
	const { userId } = useAuth()
	const { patterns, loading, error } = usePatterns(userId)

	if (loading) {
		return (
			<AppShell>
				<div className="flex items-center justify-center min-h-[60vh]">
					<p style={{ color: 'var(--text-secondary)' }}>Loading patterns...</p>
				</div>
			</AppShell>
		)
	}

	if (error) {
		return (
			<AppShell>
				<div className="flex items-center justify-center min-h-[60vh]">
					<p style={{ color: 'var(--text-secondary)' }}>
						Something went wrong. Please try again.
					</p>
				</div>
			</AppShell>
		)
	}

	if (!patterns?.isUnlocked) {
		return (
			<AppShell>
				<div className="flex items-center justify-center min-h-[60vh]">
					<p
						className="text-[15px] leading-[1.6] text-center max-w-md"
						style={{ color: 'var(--text-secondary)' }}
					>
						Come back after two cycles. There will be more to see.
					</p>
				</div>
			</AppShell>
		)
	}

	const insightSentence = buildInsightSentence(
		patterns.mostCommonFeeling,
		patterns.mostCommonContextTags
	)

	return (
		<AppShell>
			<div className="space-y-12">
				<header className="mt-12">
					<h1
						className="text-[28px] font-semibold tracking-[-0.02em] mb-2"
						style={{ color: 'var(--text-primary)' }}
					>
						What your patterns say
					</h1>
				</header>

				{insightSentence && (
					<section>
						<div
							className="rounded-xl p-6"
							style={{ backgroundColor: 'var(--surface)' }}
						>
							<p
								className="text-[15px] leading-[1.6]"
								style={{ color: 'var(--text-primary)' }}
							>
								{insightSentence}
							</p>
						</div>
					</section>
				)}

				<section className="space-y-6">
					<h2
						className="text-[13px] font-medium uppercase tracking-[0.02em]"
						style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
					>
						Your history
					</h2>

					<div className="space-y-4">
						{patterns.cycles.map((cycle) => {
							const daysActive = calculateDaysActive(
								cycle.created_at,
								cycle.ended_at
							)

							return (
								<Link
									key={cycle.id}
									href={`/cycle/${cycle.id}`}
									className="block group"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1 min-w-0">
											<h3
												className="text-[16px] font-medium mb-1 transition-colors duration-150"
												style={{ color: 'var(--text-primary)' }}
											>
												{cycle.name}
											</h3>
											<p
												className="text-[12px]"
												style={{ color: 'var(--text-secondary)' }}
											>
												{daysActive} {daysActive === 1 ? 'day' : 'days'}
											</p>
										</div>

										<div className="shrink-0 pt-1">
											<CycleStatusBadge status={cycle.status} />
										</div>
									</div>
								</Link>
							)
						})}
					</div>
				</section>
			</div>
		</AppShell>
	)
}
