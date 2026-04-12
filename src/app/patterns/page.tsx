'use client'

import Link from 'next/link'
import { Sparkles, Star } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { usePatterns } from '@/hooks/usePatterns'
import AppShell from '@/layouts/AppShell'
import { PatternsSkeleton } from '@/components/PatternsSkeleton'
import type { ReversionFeeling } from '@/types/ReversionEvent'
import type { CycleStatus } from '@/types/Cycle'

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
	if (feeling) parts.push(`feeling ${feelingMap[feeling]}`)
	if (contextTags.length > 0) parts.push(contextTags.join(', '))
	if (parts.length === 0) return null

	const joined = parts.length > 1 ? parts.join(' and ') : parts[0]
	return `You tend to pause when ${joined} ${parts.length > 1 ? 'are' : 'is'} present.`
}

function formatDateRange(createdAt: string, endedAt: string | null): string {
	const start = new Date(createdAt)
	const end = endedAt ? new Date(endedAt) : new Date()
	const days = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
	const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
	return `${days} days • ${fmt(start)} – ${endedAt ? fmt(new Date(endedAt)) : 'now'}`
}

function StatusPill({ status }: { status: CycleStatus }) {
	if (status === 'graduated') {
		return (
			<div
				className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
				style={{ background: 'var(--accent-subtle)' }}
			>
				<Star size={13} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />
				<span
					className="text-[11px] font-semibold tracking-widest uppercase"
					style={{ color: 'var(--accent)' }}
				>
					Graduated
				</span>
			</div>
		)
	}

	if (status === 'paused') {
		return (
			<div
				className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
				style={{ background: 'rgba(165, 170, 192, 0.08)' }}
			>
				<span
					className="w-1.5 h-1.5 rounded-full shrink-0"
					style={{ background: 'var(--text-secondary)' }}
				/>
				<span
					className="text-[11px] font-semibold tracking-widest uppercase"
					style={{ color: 'var(--text-secondary)' }}
				>
					Paused
				</span>
			</div>
		)
	}

	if (status === 'closed') {
		return (
			<div
				className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
				style={{ background: 'var(--surface-highest)' }}
			>
				<span
					className="text-[11px] font-semibold tracking-widest uppercase"
					style={{ color: 'var(--text-secondary)' }}
				>
					Closed
				</span>
			</div>
		)
	}

	return (
		<div
			className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
			style={{ background: 'var(--accent-subtle)' }}
		>
			<span
				className="w-1.5 h-1.5 rounded-full"
				style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent-glow)' }}
			/>
			<span
				className="text-[11px] font-semibold tracking-widest uppercase"
				style={{ color: 'var(--accent)' }}
			>
				Active
			</span>
		</div>
	)
}

export default function PatternsPage() {
	const { userId } = useAuth()
	const { patterns, loading, error } = usePatterns(userId)

	if (loading) {
		return (
			<AppShell>
				<PatternsSkeleton />
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
			<div className="space-y-16">
				{/* Header */}
				<header className="mb-12">
					<h1
						className="text-[28px] font-semibold tracking-[-0.02em] mb-2"
						style={{ color: 'var(--text-primary)' }}
					>
						Patterns
					</h1>
					<p
						className="text-[15px] leading-[1.6]"
						style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
					>
						A subtle observation of your recurring rhythms and behavioral cycles.
					</p>
				</header>

				{/* Insight Card */}
				{insightSentence && (
					<section>
						<div
							className="relative overflow-hidden rounded-xl p-8 group"
							style={{ backgroundColor: 'var(--surface)' }}
						>
							{/* Decorative blur orb */}
							<div
								className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-all duration-500"
								style={{
									background: 'var(--accent-subtle)',
									filter: 'blur(40px)',
								}}
							/>
							<div className="relative z-10">
								<div className="flex items-center gap-2 mb-4">
									<Sparkles size={14} style={{ color: 'var(--accent)' }} />
									<span
										className="text-[12px] font-medium tracking-widest uppercase"
										style={{ color: 'var(--accent)', opacity: 0.8 }}
									>
										Active Insight
									</span>
								</div>
								<h2
									className="text-xl font-semibold mb-4"
									style={{ color: 'var(--text-primary)' }}
								>
									A pattern emerged.
								</h2>
								<p
									className="text-[15px] leading-[1.6]"
									style={{ color: 'var(--text-secondary)' }}
								>
									{insightSentence}
								</p>
							</div>
						</div>
					</section>
				)}

				{/* Cycle History */}
				<section>
					<h3
						className="text-[12px] font-medium tracking-widest uppercase mb-10"
						style={{ color: 'var(--text-secondary)', opacity: 0.4 }}
					>
						Cycle History
					</h3>

					<div className="space-y-10">
						{patterns.cycles.map((cycle) => (
							<Link
								key={cycle.id}
								href={`/cycle/${cycle.id}`}
								className="flex items-start justify-between gap-4 group"
							>
								<div className="space-y-1 min-w-0">
									<h4
										className="text-lg font-medium transition-colors duration-200"
										style={{ color: 'var(--text-primary)' }}
									>
										{cycle.name}
									</h4>
									<p
										className="text-[12px]"
										style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
									>
										{formatDateRange(cycle.created_at, cycle.ended_at)}
									</p>
								</div>
								<StatusPill status={cycle.status} />
							</Link>
						))}
					</div>
				</section>

				{/* Decorative footer */}
				<div className="flex flex-col items-center pt-8 pb-4" style={{ opacity: 0.2 }}>
					<div
						className="w-[1px] h-16 mb-4"
						style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
					/>
					<p
						className="text-[11px] font-medium tracking-[0.2em] uppercase"
						style={{ color: 'var(--text-secondary)' }}
					>
						End of History
					</p>
				</div>
			</div>
		</AppShell>
	)
}
