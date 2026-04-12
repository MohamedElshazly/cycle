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

export default function ReversionPage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()
	const { userId } = useAuth()

	const [step, setStep] = useState<Step>(1)

	const { setValue, watch, getValues } = useForm<ReversionForm>({
		defaultValues: {
			unraveling: null,
			feeling: null,
			contextTags: [],
		},
	})

	const { submit, submitting } = useReversionEvent()

	const feeling = watch('feeling')
	const contextTags = watch('contextTags')

	const handleUnravelingSelect = useCallback((value: ReversionUnraveling) => {
		setValue('unraveling', value)
		setTimeout(() => setStep(2), 300)
	}, [setValue])

	const handleFeelingSelect = useCallback((value: ReversionFeeling) => {
		setValue('feeling', value)
		setTimeout(() => setStep(3), 300)
	}, [setValue])

	const toggleTag = useCallback((tag: string) => {
		const current = getValues('contextTags')
		const next = current.includes(tag)
			? current.filter((t) => t !== tag)
			: [...current, tag]
		setValue('contextTags', next)
	}, [getValues, setValue])

	const handleContinue = useCallback(() => {
		setStep(4)
	}, [])

	const handleOutcome = useCallback(
		async (outcome: ReversionOutcome) => {
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
		},
		[userId, id, getValues, submit, router]
	)

	const availableTags = [
		'work pressure',
		'relationship tension',
		'low energy',
		'boredom',
		'illness',
		'travel',
		'big change',
		'just forgot',
	]

	const feelingOptions: { label: string; value: ReversionFeeling }[] = [
		{ label: 'relief', value: 'relief' },
		{ label: 'shame', value: 'shame' },
		{ label: 'numb', value: 'numbness' },
		{ label: 'not sure', value: 'unknown' },
		{ label: 'something else', value: 'other' },
	]

	const outcomeOptions: { label: string; value: ReversionOutcome }[] = [
		{ label: 'keep going', value: 'resumed' },
		{ label: 'take a break', value: 'paused' },
		{ label: 'call it graduated', value: 'graduated' },
		{ label: 'close this one', value: 'closed' },
	]

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ background: 'var(--background)', color: 'var(--text-primary)' }}
		>
			{/* Progress Dots */}
			<div className="flex justify-center items-center gap-2 pt-8 pb-12">
				{[1, 2, 3, 4].map((dotStep) => (
					<div
						key={dotStep}
						className="w-2 h-2 rounded-full transition-all duration-150"
						style={{
							background:
								step === dotStep ? 'var(--accent)' : 'var(--text-secondary)',
							opacity: step === dotStep ? 1 : 0.3,
						}}
					/>
				))}
			</div>

			<div className="flex-1 flex items-center justify-center px-6">
				<div className="w-full max-w-120">
					{step === 1 && (
						<div className="flex flex-col gap-8">
							<h2
								className="text-[20px] font-semibold tracking-[-0.01em] text-center"
								style={{ color: 'var(--text-primary)' }}
							>
								How did things come apart?
							</h2>

							<div className="flex flex-col gap-4">
								<button
									onClick={() => handleUnravelingSelect('gradual')}
									className="w-full px-6 py-4 rounded-xl text-[15px] font-medium transition-all duration-150 hover:opacity-80"
									style={{
										background: 'var(--surface-high)',
										color: 'var(--text-primary)',
									}}
								>
									gradually, over time
								</button>
								<button
									onClick={() => handleUnravelingSelect('specific_moment')}
									className="w-full px-6 py-4 rounded-xl text-[15px] font-medium transition-all duration-150 hover:opacity-80"
									style={{
										background: 'var(--surface-high)',
										color: 'var(--text-primary)',
									}}
								>
									there was a specific moment
								</button>
							</div>
						</div>
					)}

					{step === 2 && (
						<div className="flex flex-col gap-8">
							<h2
								className="text-[20px] font-semibold tracking-[-0.01em] text-center"
								style={{ color: 'var(--text-primary)' }}
							>
								What does it feel like?
							</h2>

							<div className="flex flex-col gap-4">
								{feelingOptions.map((option) => (
									<button
										key={option.value}
										onClick={() => handleFeelingSelect(option.value)}
										className="w-full px-6 py-4 rounded-xl text-[15px] font-medium transition-all duration-150 border hover:opacity-80"
										style={{
											background:
												feeling === option.value
													? 'var(--accent-subtle)'
													: 'var(--surface-high)',
											borderColor:
												feeling === option.value
													? 'var(--accent)'
													: 'transparent',
											color:
												feeling === option.value
													? 'var(--accent)'
													: 'var(--text-primary)',
										}}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>
					)}

					{step === 3 && (
						<div className="flex flex-col gap-8">
							<h2
								className="text-[20px] font-semibold tracking-[-0.01em] text-center"
								style={{ color: 'var(--text-primary)' }}
							>
								What was happening?
							</h2>

							<div className="flex flex-wrap gap-2">
								{availableTags.map((tag) => (
									<button
										key={tag}
										onClick={() => toggleTag(tag)}
										className="px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 border hover:opacity-80"
										style={{
											background: contextTags.includes(tag)
												? 'var(--accent-subtle)'
												: 'var(--surface-high)',
											borderColor: contextTags.includes(tag)
												? 'var(--accent)'
												: 'transparent',
											color: contextTags.includes(tag)
												? 'var(--accent)'
												: 'var(--text-secondary)',
										}}
									>
										{tag}
									</button>
								))}
							</div>

							<button
								onClick={handleContinue}
								className="w-full px-6 py-3 rounded-lg text-[15px] font-medium transition-all duration-150 hover:bg-accent-hover"
								style={{
									background: 'var(--accent)',
									color: 'var(--background)',
								}}
							>
								Continue
							</button>
						</div>
					)}

					{step === 4 && (
						<div className="flex flex-col gap-8">
							<h2
								className="text-[20px] font-semibold tracking-[-0.01em] text-center"
								style={{ color: 'var(--text-primary)' }}
							>
								What do you want to do?
							</h2>

							<div className="flex flex-col gap-3">
								{outcomeOptions.map((option) => (
									<button
										key={option.value}
										onClick={() => handleOutcome(option.value)}
										disabled={submitting}
										className="w-full px-6 py-3 text-[15px] font-medium transition-colors duration-150 hover:text-text-primary"
										style={{
											color: 'var(--text-secondary)',
											opacity: submitting ? 0.5 : 1,
										}}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
