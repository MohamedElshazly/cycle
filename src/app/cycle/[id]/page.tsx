'use client'

import { useCallback, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, CheckCircle, Circle, MinusCircle, Star, AlertCircle } from 'lucide-react'
import { startCase } from 'lodash'
import { useCycle } from '@/hooks/useCycle'
import { useCheckins } from '@/hooks/useCheckins'
import { useReversionEvents } from '@/hooks/useReversionEvents'
import { useAuth } from '@/hooks/useAuth'
import AppShell from '@/layouts/AppShell'
import { CycleDetailSkeleton } from '@/components/CycleDetailSkeleton'
import { ReversionModal } from '@/components/ReversionModal'
import { CheckinModal } from '@/components/CheckinModal'
import type { ReversionEvent } from '@/types/ReversionEvent'
import type { Checkin } from '@/types/Checkin'

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

function ReversionTimelineItem({ event }: { event: ReversionEvent }) {
	const date = new Date(event.created_at)
	const dateLabel = date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
	})

	const feelingLabels: Record<string, string> = {
		relief: 'Relief',
		shame: 'Shame',
		numbness: 'Numbness',
		unknown: 'Not sure',
		other: 'Other',
	}

	const outcomeLabels: Record<string, string> = {
		resumed: 'Kept going',
		paused: 'Paused',
		graduated: 'Graduated',
		closed: 'Closed',
	}

	return (
		<div className="relative pl-12">
			<div
				className="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center"
				style={{
					background: 'var(--surface-high)',
					border: '2px solid var(--accent)',
				}}
			>
				<AlertCircle size={14} style={{ color: 'var(--accent)' }} />
			</div>

			<div className="flex items-center justify-between mb-2">
				<span
					className="text-[12px] font-medium uppercase tracking-wider"
					style={{ color: 'var(--text-secondary)' }}
				>
					{dateLabel}
				</span>
			</div>

			<div
				className="rounded-xl p-5 space-y-3"
				style={{ background: 'var(--surface)' }}
			>
				<p
					className="text-[15px] font-medium"
					style={{ color: 'var(--text-primary)' }}
				>
					Things fell apart
				</p>

				<div className="flex flex-wrap gap-2">
					{event.unraveling && (
						<span
							className="text-[12px] font-medium px-2 py-1 rounded-full"
							style={{
								background: 'var(--surface-high)',
								color: 'var(--text-secondary)',
							}}
						>
							{event.unraveling === 'specific_moment' ? 'Sudden' : 'Gradual'}
						</span>
					)}
					{event.feeling && (
						<span
							className="text-[12px] font-medium px-2 py-1 rounded-full"
							style={{
								background: 'var(--accent-subtle)',
								color: 'var(--accent)',
							}}
						>
							{feelingLabels[event.feeling]}
						</span>
					)}
				</div>

				{event.context_tags && event.context_tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{event.context_tags.map((tag) => (
							<span
								key={tag}
								className="text-[12px] px-2 py-1 rounded-full"
								style={{
									background: 'var(--surface-high)',
									color: 'var(--text-secondary)',
								}}
							>
								{startCase(tag)}
							</span>
						))}
					</div>
				)}

				{event.free_text && (
					<p
						className="text-[15px] leading-[1.6] mt-2"
						style={{ color: 'var(--text-primary)' }}
					>
						{event.free_text}
					</p>
				)}

				{event.outcome && (
					<p
						className="text-[13px] italic mt-3"
						style={{ color: 'var(--text-secondary)' }}
					>
						→ {outcomeLabels[event.outcome]}
					</p>
				)}
			</div>
		</div>
	)
}

function GraduationTimelineItem({ note, endedAt }: { note?: string; endedAt: string }) {
	const date = new Date(endedAt)
	const dateLabel = date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
	})

	return (
		<div className="relative pl-12">
			<div
				className="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center"
				style={{
					background: 'var(--accent-subtle)',
					border: '2px solid var(--accent)',
				}}
			>
				<Star size={14} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
			</div>

			<div className="flex items-center justify-between mb-2">
				<span
					className="text-[12px] font-medium uppercase tracking-wider"
					style={{ color: 'var(--accent)' }}
				>
					{dateLabel}
				</span>
			</div>

			<div
				className="rounded-xl p-5"
				style={{ background: 'var(--surface)' }}
			>
				<p
					className="text-[15px] font-medium mb-2"
					style={{ color: 'var(--accent)' }}
				>
					Graduated
				</p>
				{note ? (
					<p
						className="text-[15px] leading-[1.6]"
						style={{ color: 'var(--text-primary)' }}
					>
						{note}
					</p>
				) : (
					<p
						className="text-[15px] leading-[1.6] italic"
						style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
					>
						This one&apos;s yours now.
					</p>
				)}
			</div>
		</div>
	)
}

export default function CyclePage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()
	const { userId } = useAuth()

	const { cycle, loading: cycleLoading, refetch: refetchCycle, updateStatus } = useCycle(id)
	const { checkins, loading: checkinsLoading, refetch: refetchCheckins } = useCheckins(id)
	const { reversionEvents, loading: reversionLoading, refetch: refetchReversionEvents } = useReversionEvents(id)
	const [isReversionModalOpen, setIsReversionModalOpen] = useState(false)
	const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false)

	const handleBack = useCallback(() => router.push('/dashboard'), [router])
	const handleCheckIn = useCallback(() => setIsCheckinModalOpen(true), [])
	const handleReversion = useCallback(() => setIsReversionModalOpen(true), [])
	const handleReversionClose = useCallback(() => setIsReversionModalOpen(false), [])
	const handleReversionSuccess = useCallback(() => {
		setIsReversionModalOpen(false)
		refetchCycle()
		refetchCheckins()
		refetchReversionEvents()
	}, [refetchCycle, refetchCheckins, refetchReversionEvents])
	const handleCheckinClose = useCallback(() => setIsCheckinModalOpen(false), [])
	const handleCheckinSuccess = useCallback(() => {
		setIsCheckinModalOpen(false)
		refetchCycle()
		refetchCheckins()
	}, [refetchCycle, refetchCheckins])
	const handleResume = useCallback(async () => {
		try {
			await updateStatus('active')
			refetchCycle()
		} catch (error) {
			console.error('Failed to resume cycle:', error)
		}
	}, [updateStatus, refetchCycle])

	// Combine timeline events
	type TimelineItem =
		| { type: 'checkin'; data: Checkin; date: Date }
		| { type: 'reversion'; data: ReversionEvent; date: Date }
		| { type: 'graduation'; date: Date }

	const timeline = useMemo<TimelineItem[]>(() => {
		const items: TimelineItem[] = []

		// Add check-ins
		checkins.forEach((checkin) => {
			items.push({
				type: 'checkin',
				data: checkin,
				date: new Date(checkin.created_at),
			})
		})

		// Add reversion events
		reversionEvents.forEach((event) => {
			items.push({
				type: 'reversion',
				data: event,
				date: new Date(event.created_at),
			})
		})

		// Add graduation if cycle is graduated
		if (cycle?.status === 'graduated' && cycle.ended_at) {
			items.push({
				type: 'graduation',
				date: new Date(cycle.ended_at),
			})
		}

		// Sort by date descending (most recent first)
		return items.sort((a, b) => b.date.getTime() - a.date.getTime())
	}, [checkins, reversionEvents, cycle])

	if (cycleLoading || checkinsLoading || reversionLoading) {
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
							className="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center pulse-indicator"
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

				{/* Timeline entries */}
				{timeline.length === 0 && cycle.status !== 'active' && (
					<p
						className="pl-12 text-[15px]"
						style={{ color: 'var(--text-secondary)' }}
					>
						No activity recorded.
					</p>
				)}

				{timeline.map((item) => {
				if (item.type === 'checkin') {
					const checkin = item.data
					const date = new Date(checkin.created_at)
					const dateLabel = date.toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
					})

					return (
						<div key={`checkin-${checkin.id}`} className="relative pl-12">
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
				}

				if (item.type === 'reversion') {
					return <ReversionTimelineItem key={`reversion-${item.data.id}`} event={item.data} />
				}

				if (item.type === 'graduation') {
					return (
						<GraduationTimelineItem
							key="graduation"
							note={cycle.graduating_note ?? undefined}
							endedAt={cycle.ended_at!}
						/>
					)
				}

				return null
			})}			</section>

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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<button
							onClick={() => router.push(`/cycle/${id}/graduate`)}
							className="h-14 rounded-lg text-[15px] font-semibold flex items-center justify-center transition-all duration-150 graduate-button"
							style={{ color: 'var(--accent)' }}
						>
							Graduate
						</button>

						<button
							onClick={handleReversion}
							className="h-14 text-[15px] font-medium flex items-center justify-center rounded-lg transition-all duration-150 reversion-button"
							style={{ color: 'var(--text-secondary)' }}
						>
							Things fell apart
						</button>
					</div>
				</section>
			)}

			{cycle.status === 'paused' && (
				<section className="mt-16 mb-24">
					<button
						onClick={handleResume}
						className="w-full h-14 rounded-lg text-[15px] font-semibold flex items-center justify-center transition-all duration-200 hover:brightness-110"
						style={{
						background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)`,
						color: 'white',
						boxShadow: '0 8px 24px var(--accent-glow)',
					}}
					>
						Resume Cycle
					</button>
				</section>
			)}

			{/* Reversion Modal */}
			{userId && (
				<ReversionModal
					cycleId={id}
					userId={userId}
					isOpen={isReversionModalOpen}
					onClose={handleReversionClose}
					onSuccess={handleReversionSuccess}
				/>
			)}

			{/* Check-in Modal */}
			{userId && (
				<CheckinModal
					cycleId={id}
					userId={userId}
					isOpen={isCheckinModalOpen}
					onClose={handleCheckinClose}
					onSuccess={handleCheckinSuccess}
				/>
			)}
		</AppShell>
	)
}
