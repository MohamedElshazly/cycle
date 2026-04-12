'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useReversionEvent } from '@/hooks/useReversionEvent'
import {
	ReversionUnraveling,
	ReversionFeeling,
	ReversionOutcome,
} from '@/types/ReversionEvent'

type Step = 1 | 2 | 3 | 4

type ReversionForm = {
	unraveling: ReversionUnraveling | null
	feeling: ReversionFeeling | null
	contextTags: string[]
}

const UNRAVELING_OPTIONS: { label: string; value: ReversionUnraveling }[] = [
	{ label: 'Sudden', value: 'specific_moment' },
	{ label: 'Gradual', value: 'gradual' },
]

const FEELING_OPTIONS: { label: string; value: ReversionFeeling }[] = [
	{ label: 'Relief', value: 'relief' },
	{ label: 'Shame', value: 'shame' },
	{ label: 'Numbness', value: 'numbness' },
	{ label: 'Not sure', value: 'unknown' },
]

const OUTCOME_OPTIONS: { label: string; value: ReversionOutcome }[] = [
	{ label: 'Keep going', value: 'resumed' },
	{ label: 'Pause', value: 'paused' },
	{ label: 'Graduate', value: 'graduated' },
	{ label: 'Close', value: 'closed' },
]

const AVAILABLE_TAGS = [
	'work pressure',
	'relationship tension',
	'low energy',
	'boredom',
	'illness',
	'travel',
	'big change',
	'just forgot',
]

export default function ReversionPage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()
	const { userId } = useAuth()

	const [step, setStep] = useState<Step>(1)

	const { setValue, watch, getValues } = useForm<ReversionForm>({
		defaultValues: { unraveling: null, feeling: null, contextTags: [] },
	})

	const { submit, submitting } = useReversionEvent()
	const feeling = watch('feeling')
	const contextTags = watch('contextTags')
	const unraveling = watch('unraveling')

	const handleUnravelingSelect = useCallback((value: ReversionUnraveling) => {
		setValue('unraveling', value)
		setTimeout(() => setStep(2), 250)
	}, [setValue])

	const handleFeelingSelect = useCallback((value: ReversionFeeling) => {
		setValue('feeling', value)
		setTimeout(() => setStep(3), 250)
	}, [setValue])

	const toggleTag = useCallback((tag: string) => {
		const current = getValues('contextTags')
		setValue('contextTags', current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag])
	}, [getValues, setValue])

	const handleOutcome = useCallback(async (outcome: ReversionOutcome) => {
		if (!userId) return
		const data = getValues()
		try {
			await submit({
				cycleId: id,
				userId,
				declaredBy: 'user',
				unraveling: data.unraveling ?? undefined,
				feeling: data.feeling ?? undefined,
				contextTags: data.contextTags.length > 0 ? data.contextTags : undefined,
				outcome,
			})
			router.push(`/cycle/${id}`)
		} catch (error) {
			console.error('Failed to submit reversion event:', error)
		}
	}, [userId, id, getValues, submit, router])

	return (
		<div
			className="min-h-screen relative"
			style={{ background: 'var(--background)', color: 'var(--text-primary)' }}
		>
			{/* Scrim */}
			<div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />

			{/* Bottom sheet */}
			<div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 md:pb-8">
				<div
					className="w-full max-w-lg overflow-hidden"
					style={{
						background: 'var(--surface-high)',
						borderRadius: '32px 32px 16px 16px',
						boxShadow: '0 -20px 80px rgba(0,0,0,0.8)',
					}}
				>
					{/* Grab handle */}
					<div className="w-full flex justify-center py-4">
						<div
							className="w-12 h-1 rounded-full"
							style={{ background: 'var(--surface-highest)', opacity: 0.5 }}
						/>
					</div>

					<div className="px-8 pt-4 pb-12 max-w-md mx-auto">
						{/* Header */}
						<div className="mb-10">
							<h2
								className="text-2xl font-semibold tracking-tight mb-2"
								style={{ color: 'var(--text-primary)' }}
							>
								Things got harder.
							</h2>
							<p
								className="text-sm font-medium"
								style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
							>
								A quiet space for this moment.
							</p>
						</div>

						<div className="space-y-12">
							{/* Step 1 — How did it come apart? */}
							{step >= 1 && (
								<section className="space-y-6">
									<p
										className="text-lg leading-relaxed"
										style={{ color: 'var(--text-primary)' }}
									>
										How would you describe the shift?
									</p>
									<div className="grid grid-cols-2 gap-3">
										{UNRAVELING_OPTIONS.map(({ label, value }) => {
											const isSelected = unraveling === value
											return (
												<button
													key={value}
													onClick={() => handleUnravelingSelect(value)}
													className="flex items-center justify-center p-4 rounded-xl font-semibold transition-all duration-200"
													style={{
														background: isSelected ? 'var(--accent)' : 'var(--surface-highest)',
														color: isSelected ? 'white' : 'var(--text-secondary)',
														border: '1px solid rgba(255,255,255,0.04)',
													}}
												>
													{label}
												</button>
											)
										})}
									</div>
								</section>
							)}

							{/* Step 2 — How does it feel? */}
							{step >= 2 && (
								<section className="space-y-6">
									<p
										className="text-lg leading-relaxed"
										style={{ color: 'var(--text-primary)' }}
									>
										What does it feel like?
									</p>
									<div className="grid grid-cols-2 gap-3">
										{FEELING_OPTIONS.map(({ label, value }) => {
											const isSelected = feeling === value
											return (
												<button
													key={value}
													onClick={() => handleFeelingSelect(value)}
													className="flex items-center justify-center p-4 rounded-xl font-semibold transition-all duration-200"
													style={{
														background: isSelected ? 'var(--accent)' : 'var(--surface-highest)',
														color: isSelected ? 'white' : 'var(--text-secondary)',
														border: '1px solid rgba(255,255,255,0.04)',
													}}
												>
													{label}
												</button>
											)
										})}
									</div>
								</section>
							)}

							{/* Step 3 — Context tags + free text */}
							{step >= 3 && (
								<section className="space-y-6">
									<p
										className="text-lg leading-relaxed"
										style={{ color: 'var(--text-primary)' }}
									>
										What triggered the weight?
									</p>

									<div className="flex flex-wrap gap-2">
										{AVAILABLE_TAGS.map((tag) => {
											const isSelected = contextTags.includes(tag)
											return (
												<button
													key={tag}
													onClick={() => toggleTag(tag)}
													className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150"
													style={{
														background: isSelected ? 'var(--accent-subtle)' : 'var(--surface-highest)',
														color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
														border: `1px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
													}}
												>
													{tag}
												</button>
											)
										})}
									</div>

									<button
										onClick={() => setStep(4)}
										className="w-full py-3 rounded-xl font-medium text-[15px] transition-all duration-150"
										style={{ background: 'var(--accent)', color: 'white' }}
									>
										Continue
									</button>
								</section>
							)}

							{/* Step 4 — Outcome */}
							{step >= 4 && (
								<section
									className="pt-8 space-y-3"
									style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
								>
									<div className="grid grid-cols-2 gap-3">
										{OUTCOME_OPTIONS.map(({ label, value }) => (
											<button
												key={value}
												onClick={() => handleOutcome(value)}
												disabled={submitting}
												className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-40"
												style={{
													background: 'var(--surface-highest)',
													color: 'var(--text-primary)',
													border: '1px solid rgba(255,255,255,0.04)',
												}}
											>
												{label}
											</button>
										))}
									</div>
									<p
										className="text-center text-[11px] uppercase tracking-widest pt-4"
										style={{ color: 'var(--text-secondary)', opacity: 0.4 }}
									>
										Your cycle state will update based on this choice
									</p>
								</section>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
