'use client'

import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, CheckCircle, Circle, MinusCircle, MoreHorizontal } from 'lucide-react'
import { useCycle } from '@/hooks/useCycle'
import { useCheckins } from '@/hooks/useCheckins'
import AppShell from '@/layouts/AppShell'
import { CycleDetailSkeleton } from '@/components/CycleDetailSkeleton'

function FeelingBadge({ value }: { value: number }) {
	const labels: Record<number, string> = {
		1: 'tough',
		2: 'okay',
		3: 'alright',
		4: 'good',
		5: 'great',
	}
	return (
		<span
			className="text-[12px] font-medium px-2 py-1 rounded-full"
			style={{
				background: 'var(--surface)',
				color: 'var(--text-secondary)',
				opacity: 0.6,
			}}
		>
			{labels[value] ?? ''}
		</span>
	)
}

function TimelineIcon({ didTheThing }: { didTheThing: string }) {
	if (didTheThing === 'yes') {
		return (
			<CheckCircle
				size={14}
				style={{ color: 'var(--accent)', fill: 'var(--accent)' }}
			/>
		)
	}
	if (didTheThing === 'partially') {
		return <Circle size={14} style={{ color: 'var(--text-secondary)' }} />
	}
	return <MinusCircle size={14} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
}

export default function CyclePage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()

	const { cycle, loading: cycleLoading } = useCycle(id)
	const { checkins, loading: checkinsLoading } = useCheckins(id)

	const handleBack = useCallback(() => router.push('/dashboard'), [router])
	const handleCheckIn = useCallback(() => router.push(`/cycle/${id}/checkin`), [router, id])
	const handleReversion = useCallback(() => router.push(`/cycle/${id}/reversion`), [router, id])

	if (cycleLoading || checkinsLoading) {
		return (
			<AppShell>
				<CycleDetailSkeleton />
			</AppShell>
		)
	}

	if (!cycle) {
		return (
			<AppShell>
				<div className="flex justify-center items-center min-h-[50vh]">
					<p style={{ color: 'var(--text-secondary)' }}>Cycle not found</p>
				</div>
			</AppShell>
		)
	}

	const startDate = new Date(cycle.created_at).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})

	return (
		<AppShell>
			{/* Header */}
			<section className="mb-16">
				<button
					onClick={handleBack}
					className="flex items-center gap-1 mb-6 transition-opacity duration-150 hover:opacity-70"
					style={{ color: 'var(--text-secondary)' }}
				>
					<ChevronLeft size={18} />
					<span className="text-[13px]">Back</span>
				</button>

				<h1
					className="text-[28px] font-semibold tracking-[-0.02em] mb-2"
					style={{ color: 'var(--text-primary)' }}
				>
					{cycle.name}
				</h1>
				<p
					className="text-[15px] leading-[1.6]"
					style={{ color: 'var(--text-secondary)' }}
				>
					Started {startDate}
				</p>
			</section>

			{/* Vertical Timeline */}
			<section className="relative space-y-12">
				{/* Vertical line */}
				<div
					className="absolute top-4 bottom-4 w-px"
					style={{ left: '11px', background: 'rgba(165, 170, 192, 0.15)' }}
				/>

				{/* Today / pending entry (active cycles) */}
				{cycle.status === 'active' && (
					<div className="relative pl-12">
						<div
							className="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center"
							style={{
								background: 'var(--surface)',
								border: '2px solid var(--accent)',
								boxShadow: '0 0 0 4px var(--accent-subtle)',
							}}
						>
							<div
								className="w-1.5 h-1.5 rounded-full"
								style={{ background: 'var(--accent)' }}
							/>
						</div>
						<div className="flex items-center justify-between mb-2">
							<span
								className="text-[12px] font-medium uppercase tracking-wider"
								style={{ color: 'var(--accent)' }}
							>
								Today
							</span>
						</div>
						<div
							className="rounded-xl p-5"
							style={{ background: 'var(--surface)' }}
						>
							<p
								className="text-[15px] leading-[1.6] italic"
								style={{ color: 'var(--text-primary)', opacity: 0.4 }}
							>
								Waiting for your check-in...
							</p>
						</div>
					</div>
				)}

				{/* Check-in entries */}
				{checkins.length === 0 && cycle.status !== 'active' && (
					<p
						className="pl-12 text-[15px]"
						style={{ color: 'var(--text-secondary)' }}
					>
						No check-ins recorded.
					</p>
				)}

				{checkins.map((checkin) => {
					const date = new Date(checkin.created_at)
					const dateLabel = date.toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
					})

					return (
						<div key={checkin.id} className="relative pl-12">
							<div
								className="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center"
								style={{
									background: 'var(--surface-high)',
									border: '2px solid rgba(165, 170, 192, 0.25)',
								}}
							>
								<TimelineIcon didTheThing={checkin.did_the_thing} />
							</div>

							<div className="flex items-center justify-between mb-2">
								<span
									className="text-[12px] font-medium uppercase tracking-wider"
									style={{ color: 'var(--text-secondary)' }}
								>
									{dateLabel}
								</span>
								{checkin.general_feeling && (
									<FeelingBadge value={checkin.general_feeling} />
								)}
							</div>

							<div
								className="rounded-xl p-5"
								style={{ background: 'var(--surface)' }}
							>
								{checkin.note ? (
									<p
										className="text-[15px] leading-[1.6]"
										style={{ color: 'var(--text-primary)' }}
									>
										{checkin.note}
									</p>
								) : (
									<p
										className="text-[15px] leading-[1.6] italic"
										style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
									>
										No note.
									</p>
								)}
							</div>
						</div>
					)
				})}
			</section>

			{/* Pulse Indicator */}
			{cycle.status === 'active' && (
				<section className="mt-20 flex flex-col items-center justify-center space-y-6">
					<div className="relative w-32 h-32 flex items-center justify-center">
						<div
							className="absolute inset-0 rounded-full animate-pulse"
							style={{ background: 'var(--accent-subtle)', filter: 'blur(24px)' }}
						/>
						<div
							className="relative w-16 h-16 rounded-full"
							style={{
								background: 'var(--accent)',
								boxShadow: '0 0 30px var(--accent-glow)',
							}}
						/>
					</div>
					<p
						className="text-[12px] font-medium uppercase tracking-widest text-center"
						style={{ color: 'var(--text-secondary)' }}
					>
						Cycle Resonance
					</p>
				</section>
			)}

			{/* Actions */}
			{cycle.status === 'active' && (
				<section className="mt-16 mb-24 space-y-4">
					<button
						onClick={handleCheckIn}
						className="w-full h-14 rounded-lg text-[15px] font-semibold flex items-center justify-center transition-all duration-200 hover:brightness-110"
						style={{
							background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)`,
							color: 'white',
							boxShadow: '0 8px 24px var(--accent-glow)',
						}}
					>
						Check In
					</button>

					<div className="flex items-center gap-2">
						<button
							onClick={handleReversion}
							className="flex-1 h-14 text-[15px] font-medium flex items-center justify-center rounded-lg transition-all duration-200"
							style={{ color: 'var(--accent)' }}
							onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-subtle)')}
							onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
						>
							Things fell apart
						</button>
						<button
							className="w-14 h-14 flex items-center justify-center rounded-lg transition-colors duration-200"
							style={{ color: 'var(--text-secondary)' }}
							onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
							onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
						>
							<MoreHorizontal size={20} />
						</button>
					</div>
				</section>
			)}

			{cycle.status === 'paused' && (
				<section className="mt-16 mb-24">
					<button
						onClick={() => router.push('/dashboard')}
						className="text-[15px] transition-colors duration-150"
						style={{ color: 'var(--text-secondary)' }}
					>
						Resume
					</button>
				</section>
			)}
		</AppShell>
	)
}
