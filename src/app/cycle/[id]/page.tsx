'use client'

import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useCycle } from '@/hooks/useCycle'
import { useCheckins } from '@/hooks/useCheckins'
import AppShell from '@/layouts/AppShell'
import { CycleStatusBadge } from '@/components/CycleStatusBadge'

export default function CyclePage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()

	const { cycle, loading: cycleLoading } = useCycle(id)
	const { checkins, loading: checkinsLoading } = useCheckins(id)

	const handleBack = useCallback(() => {
		router.push('/dashboard')
	}, [router])

	const handleCheckIn = useCallback(() => {
		router.push(`/cycle/${id}/checkin`)
	}, [router, id])

	const handleReversion = useCallback(() => {
		router.push(`/cycle/${id}/reversion`)
	}, [router, id])

	const handleResume = useCallback(() => {
		router.push('/dashboard')
	}, [router])

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
	}

	const getDidTheThingText = (value: string) => {
		switch (value) {
			case 'yes':
				return 'did it'
			case 'no':
				return 'didn\'t'
			case 'partially':
				return 'partway'
			default:
				return value
		}
	}

	const getFeelingText = (value: number) => {
		switch (value) {
			case 1:
				return 'tough'
			case 2:
				return 'okay'
			case 3:
				return 'alright'
			case 4:
				return 'good'
			case 5:
				return 'great'
			default:
				return ''
		}
	}

	if (cycleLoading || checkinsLoading) {
		return (
			<AppShell>
				<div className="flex justify-center items-center min-h-[50vh]">
					<p style={{ color: 'var(--text-secondary)' }}>...</p>
				</div>
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

	return (
		<AppShell>
			<div className="max-w-120 mx-auto">
				{/* Header */}
				<div className="mt-12 mb-12">
					<button
						onClick={handleBack}
						className="flex items-center gap-2 mb-6 transition-colors duration-150"
						style={{ color: 'var(--text-secondary)' }}
					>
						<ChevronLeft size={20} />
						<span className="text-sm">Back</span>
					</button>

					<div className="flex items-center gap-3 mb-4">
						<h1
							className="text-[28px] font-semibold tracking-[-0.02em]"
							style={{ color: 'var(--text-primary)' }}
						>
							{cycle.name}
						</h1>
						<CycleStatusBadge status={cycle.status} />
					</div>

					{cycle.why_now && (
						<p
							className="text-[15px] leading-[1.6] italic"
							style={{ color: 'var(--text-secondary)' }}
						>
							{cycle.why_now}
						</p>
					)}
				</div>

				{/* Check-in Timeline */}
				<div className="mb-24">
					<h2
						className="text-[13px] font-medium uppercase tracking-[0.02em] mb-6"
						style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
					>
						Your path
					</h2>

					{checkins.length === 0 ? (
						<p
							className="text-center text-[15px]"
							style={{ color: 'var(--text-secondary)' }}
						>
							No check-ins yet.
						</p>
					) : (
						<div className="flex flex-col gap-6">
							{checkins.map((checkin) => (
								<div key={checkin.id}>
									<div className="flex items-baseline gap-3 mb-1">
										<span
											className="text-[12px] font-normal"
											style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
										>
											{formatDate(checkin.created_at)}
										</span>
										<span
											className="text-[15px]"
											style={{ color: 'var(--text-primary)' }}
										>
											{getDidTheThingText(checkin.did_the_thing)}
										</span>
										<span
											className="text-[13px]"
											style={{ color: 'var(--text-secondary)' }}
										>
											{getFeelingText(checkin.general_feeling)}
										</span>
									</div>
									{checkin.note && (
										<p
											className="text-[15px] italic ml-18"
											style={{ color: 'var(--text-secondary)' }}
										>
											{checkin.note}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Bottom Action Bar */}
				<div className="fixed bottom-24 left-0 right-0 md:bottom-8 md:relative">
					<div
						className="mx-auto max-w-120 px-6 py-4 rounded-xl"
						style={{ background: 'var(--surface)' }}
					>
						{cycle.status === 'active' && (
							<div className="flex flex-col gap-3">
								<button
									onClick={handleCheckIn}
									className="w-full px-6 py-3 rounded-lg text-[15px] font-medium transition-all duration-150"
									style={{
										background: 'var(--accent)',
										color: 'var(--background)',
									}}
								>
									Check in
								</button>
								<button
									onClick={handleReversion}
									className="text-[13px] transition-colors duration-150"
									style={{ color: 'var(--text-secondary)' }}
								>
									Things fell apart
								</button>
							</div>
						)}

						{cycle.status === 'graduated' && cycle.graduating_note && (
							<p
								className="text-[15px] leading-[1.6]"
								style={{ color: 'var(--text-secondary)' }}
							>
								{cycle.graduating_note}
							</p>
						)}

						{cycle.status === 'closed' && cycle.closing_note && (
							<p
								className="text-[15px] leading-[1.6]"
								style={{ color: 'var(--text-secondary)' }}
							>
								{cycle.closing_note}
							</p>
						)}

						{cycle.status === 'paused' && (
							<button
								onClick={handleResume}
								className="text-[15px] transition-colors duration-150"
								style={{ color: 'var(--text-secondary)' }}
							>
								Resume
							</button>
						)}
					</div>
				</div>
			</div>
		</AppShell>
	)
}
