'use client'

import Link from 'next/link'
import type { Cycle } from '@/types/Cycle'
import { Star } from 'lucide-react'

type Props = {
	cycle: Cycle
}

function getDaysActive(createdAt: string, endedAt?: string | null): number {
	const start = new Date(createdAt)
	const end = endedAt ? new Date(endedAt) : new Date()
	return Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
}

export function CycleCard({ cycle }: Props) {
	const daysActive = getDaysActive(cycle.created_at, cycle.ended_at)
	const isActive = cycle.status === 'active'
	const isPaused = cycle.status === 'paused'
	const isGraduated = cycle.status === 'graduated'

	return (
		<Link
			href={`/cycle/${cycle.id}`}
			className="group block rounded-xl p-8 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
			style={{ backgroundColor: 'var(--surface)' }}
			onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-high)')}
			onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
		>
			<div className="flex items-start justify-between mb-6">
				<div className="flex items-center gap-3 min-w-0">
					{/* Status indicator */}
					{isActive && (
						<span
							className="w-2 h-2 rounded-full shrink-0"
							style={{
								backgroundColor: 'var(--accent)',
								boxShadow: '0 0 8px var(--accent-glow)',
							}}
						/>
					)}
					{isPaused && (
						<span
							className="w-2 h-2 rounded-full shrink-0"
							style={{ backgroundColor: 'var(--text-secondary)', opacity: 0.5 }}
						/>
					)}
					{isGraduated && (
						<Star
							size={14}
							className="shrink-0"
							style={{ color: 'var(--accent)', fill: 'var(--accent)' }}
						/>
					)}

					<h3
						className="text-xl font-semibold tracking-[-0.02em] truncate"
						style={{ color: 'var(--text-primary)' }}
					>
						{cycle.name}
					</h3>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-[15px] leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
					{daysActive} {daysActive === 1 ? 'day' : 'days'} active
				</p>
				<p
					className="text-[12px] font-medium uppercase tracking-wide"
					style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
				>
					{isActive ? 'Tap to check in' : cycle.status}
				</p>
			</div>
		</Link>
	)
}
