'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useReversionEvent } from '@/hooks/useReversionEvent'
import {
	ReversionUnraveling,
	ReversionFeeling,
	ReversionOutcome,
} from '@/types/ReversionEvent'

type Step = 1 | 2

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

type ReversionModalProps = {
	cycleId: string
	userId: string
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
}

export function ReversionModal({ cycleId, userId, isOpen, onClose, onSuccess }: ReversionModalProps) {
	const [step, setStep] = useState<Step>(1)

	const { setValue, watch, getValues, reset } = useForm<ReversionForm>({
		defaultValues: { unraveling: null, feeling: null, contextTags: [] },
	})

	const { submit, submitting } = useReversionEvent()
	const feeling = watch('feeling')
	const contextTags = watch('contextTags')
	const unraveling = watch('unraveling')

	const handleUnravelingSelect = useCallback((value: ReversionUnraveling) => {
		setValue('unraveling', value)
	}, [setValue])

	const handleFeelingSelect = useCallback((value: ReversionFeeling) => {
		setValue('feeling', value)
	}, [setValue])

	const toggleTag = useCallback((tag: string) => {
		const current = getValues('contextTags')
		setValue('contextTags', current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag])
	}, [getValues, setValue])

	const handleClose = useCallback(() => {
		reset()
		setStep(1)
		onClose()
	}, [reset, onClose])

	const handleContinueToOutcomes = useCallback(() => {
		setStep(2)
	}, [])

	const handleBack = useCallback(() => {
		setStep(1)
	}, [])

	const handleOutcome = useCallback(async (outcome: ReversionOutcome) => {
		const data = getValues()
		try {
			await submit({
				cycleId,
				userId,
				declaredBy: 'user',
				unraveling: data.unraveling ?? undefined,
				feeling: data.feeling ?? undefined,
				contextTags: data.contextTags.length > 0 ? data.contextTags : undefined,
				outcome,
			})
			reset()
			setStep(1)
			onSuccess()
		} catch (error) {
			console.error('Failed to submit reversion event:', error)
		}
	}, [cycleId, userId, getValues, submit, reset, onSuccess])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50" style={{ color: 'var(--text-primary)' }}>
			{/* Scrim */}
			<div
				className="fixed inset-0 z-40 cursor-pointer"
				style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
				onClick={handleClose}
			/>

			{/* Bottom sheet */}
			<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 pb-4 md:pb-0 pointer-events-none">
				<div
					className="w-full max-w-lg md:max-w-[600px] overflow-hidden md:overflow-y-auto md:max-h-[85vh] reversion-card md:rounded-2xl pointer-events-auto"
					style={{
						background: 'var(--surface-high)',
						borderRadius: '32px 32px 16px 16px',
						boxShadow: '0 -20px 80px rgba(0,0,0,0.8)',
					}}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Grab handle */}
					<div className="w-full flex justify-center py-4 md:hidden">
						<div
							className="w-12 h-1 rounded-full"
							style={{ background: 'var(--surface-highest)', opacity: 0.5 }}
						/>
					</div>

					<div className="px-8 pt-4 pb-12 md:pt-8 md:pb-16 max-w-md md:max-w-none mx-auto">
						{/* Header */}
						<div className="mb-10 relative">
							{/* Close button - desktop only */}
							<button
								onClick={handleClose}
								className="hidden md:block absolute -top-2 -right-2 w-8 h-8 rounded-full transition-all duration-150 hover:brightness-110"
								style={{
									background: 'var(--surface-highest)',
									color: 'var(--text-secondary)',
								}}
								aria-label="Close"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									className="mx-auto"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								>
									<path d="M12 4L4 12M4 4l8 8" />
								</svg>
							</button>

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
							{step === 1 ? (
								<>
									{/* Step 1 — How did it come apart? */}
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

									{/* How does it feel? */}
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

									{/* Context tags */}
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
											onClick={handleContinueToOutcomes}
											className="w-full py-3 rounded-xl font-medium text-[15px] transition-all duration-150 hover:brightness-110"
											style={{ background: 'var(--accent)', color: 'white' }}
										>
											Continue
										</button>
									</section>
								</>
							) : (
								<>
									{/* Step 2 — What now? */}
									<section className="space-y-8">
										<div className="space-y-2">
											<h3
												className="text-xl font-semibold tracking-tight"
												style={{ color: 'var(--text-primary)' }}
											>
												What feels right?
											</h3>
											<p
												className="text-sm"
												style={{ color: 'var(--text-secondary)', opacity: 0.7 }}
											>
												Your cycle will update based on this choice.
											</p>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

										<button
											onClick={handleBack}
											className="w-full py-2 text-sm font-medium transition-all duration-150"
											style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
										>
											← Back
										</button>
									</section>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
