'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import type { Cycle } from '@/types/Cycle'
import { CycleStatusBadge } from '@/components/CycleStatusBadge'

type Props = {
	cycle: Cycle
	onCheckIn: () => void
}

function getDaysActive(createdAt: string): number {
	const created = new Date(createdAt)
	const now = new Date()
	const diffMs = now.getTime() - created.getTime()
	return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1)
}

export function CycleCard({ cycle, onCheckIn }: Props) {
	const daysActive = getDaysActive(cycle.created_at)

	const handleCheckIn = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			e.stopPropagation()
			onCheckIn()
		},
		[onCheckIn]
	)

	return (
		<Link
			href={`/cycle/${cycle.id}`}
			className="block rounded-xl p-6 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
			style={{ backgroundColor: 'var(--surface)' }}
		>
			<div className="flex items-start justify-between gap-4">
				{/* Left: status indicator + cycle name */}
				<div className="flex items-center gap-3 min-w-0">
					<span className="flex items-center shrink-0 mt-0.75">
						<CycleStatusBadge status={cycle.status} />
					</span>
					<h3
						className="text-[16px] font-semibold leading-snug truncate"
						style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
					>
						{cycle.name}
					</h3>
				</div>

				{/* Check-in button — active cycles only, ghost style */}
				{cycle.status === 'active' && (
					<button
						onClick={handleCheckIn}
						className="shrink-0 text-[13px] font-medium transition-colors duration-150 ease-out hover:opacity-80 focus-visible:outline-none"
						style={{ color: 'var(--text-secondary)' }}
						aria-label={`Check in for ${cycle.name}`}
					>
						Check in
					</button>
				)}
			</div>

			{/* Meta: days active + last check-in */}
			<div className="mt-4 flex items-baseline gap-4">
				<p
					className="text-[15px] leading-relaxed"
					style={{ color: 'var(--text-secondary)' }}
				>
					{daysActive === 1 ? 'day 1' : `day ${daysActive}`}
				</p>

				<span
					className="text-[12px] font-medium uppercase tracking-[0.02em]"
					style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
				>
					Last check-in: not yet
				</span>
			</div>
		</Link>
	)
}
