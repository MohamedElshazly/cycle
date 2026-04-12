'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useEmotionalSnapshot } from '@/hooks/useEmotionalSnapshot'
import { useCycles } from '@/hooks/useCycles'
import { WeatherScale } from '@/components/WeatherScale'
import startCase from 'lodash/startCase'

const WHY_NOW_OPTIONS = [
	'fresh start',
	'someone suggested it',
	'been avoiding it',
	'feels urgent',
	'ready',
] as const

type OnboardingForm = {
	homeStress: number | null
	loneliness: number | null
	energy: number | null
	generalStress: number | null
	name: string
	whyNow: string
	successVision: string
}

export default function OnboardingPage() {
	const router = useRouter()
	const { userId, markOnboardingComplete } = useAuth()

	const [step, setStep] = useState(1)

	const { setValue, watch, getValues } = useForm<OnboardingForm>({
		defaultValues: {
			homeStress: null,
			loneliness: null,
			energy: null,
			generalStress: null,
			name: '',
			whyNow: '',
			successVision: '',
		},
	})

	const { submit, submitting } = useEmotionalSnapshot()
	const { create } = useCycles(userId)

	const homeStress = watch('homeStress')
	const loneliness = watch('loneliness')
	const energy = watch('energy')
	const generalStress = watch('generalStress')
	const whyNow = watch('whyNow')
	const name = watch('name')

	const handleBegin = useCallback(() => {
		setStep(2)
	}, [])

	const handleContinueFromEmotional = useCallback(async () => {
		const data = getValues()
		if (!userId || data.homeStress === null || data.loneliness === null || data.energy === null || data.generalStress === null) {
			return
		}

		try {
			await submit({
				userId,
				homeStress: data.homeStress,
				loneliness: data.loneliness,
				energy: data.energy,
				generalStress: data.generalStress,
				context: 'onboarding',
			})
			setStep(3)
		} catch (err) {
			console.error('Failed to save emotional snapshot:', err)
		}
	}, [userId, getValues, submit])

	const handleStart = useCallback(async () => {
		const data = getValues()
		if (!userId || !data.name.trim()) return

		try {
			await create({
				name: data.name.trim(),
				whyNow: data.whyNow || undefined,
				successVision: data.successVision.trim() || undefined,
			})
			await markOnboardingComplete(userId)
			setStep(4)
		} catch (err) {
			console.error('Failed to create cycle:', err)
		}
	}, [userId, getValues, create, markOnboardingComplete])

	const handleWhyNowSelect = useCallback((option: string) => () => {
		setValue('whyNow', option)
	}, [setValue])

	const handleGoToDashboard = useCallback(() => {
		router.push('/dashboard')
	}, [router])

	const canContinueFromEmotional =
		homeStress !== null && loneliness !== null && energy !== null && generalStress !== null

	const canStart = name.trim().length > 0

	return (
		<div
			className="min-h-screen flex flex-col items-center justify-center px-6"
			style={{ backgroundColor: 'var(--background)' }}
		>
			<div className="w-full max-w-120 flex flex-col gap-12">
				{/* Progress dots */}
				<div className="flex justify-center gap-2">
					{[1, 2, 3, 4].map((dotStep) => (
						<div
							key={dotStep}
							className="w-2 h-2 rounded-full transition-all duration-150"
							style={{
								backgroundColor: dotStep === step ? 'var(--accent)' : 'var(--border)',
							}}
						/>
					))}
				</div>

				{/* Step 1: Welcome */}
				{step === 1 && (
					<div className="flex flex-col items-center gap-6 text-center">
						<h1
							className="text-[28px] font-semibold"
							style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
						>
							This is not a habit tracker.
						</h1>
						<p
							className="text-[15px] leading-relaxed"
							style={{ color: 'var(--text-secondary)' }}
						>
							It's a place to understand why you keep stopping.
						</p>
						<button
							onClick={handleBegin}
							className="mt-8 px-8 py-3 rounded-lg text-white font-medium transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
							style={{ backgroundColor: 'var(--accent)' }}
						>
							Begin
						</button>
					</div>
				)}

				{/* Step 2: Emotional baseline */}
				{step === 2 && (
					<div className="flex flex-col gap-12">
						<p
							className="text-[15px] leading-relaxed text-center"
							style={{ color: 'var(--text-secondary)' }}
						>
							Let's start with where you are right now.
						</p>

						<div className="flex flex-col gap-8">
							<WeatherScale
								question="How's the stress at home?"
								value={homeStress}
								onChange={(val) => setValue('homeStress', val)}
							/>
							<WeatherScale
								question="How lonely do you feel?"
								value={loneliness}
								onChange={(val) => setValue('loneliness', val)}
							/>
							<WeatherScale
								question="What's your energy like?"
								value={energy}
								onChange={(val) => setValue('energy', val)}
							/>
							<WeatherScale
								question="How stressed are you in general?"
								value={generalStress}
								onChange={(val) => setValue('generalStress', val)}
							/>
						</div>

						<button
							onClick={handleContinueFromEmotional}
							disabled={!canContinueFromEmotional || submitting}
							className="mt-4 px-8 py-3 rounded-lg text-white font-medium transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
							style={{ backgroundColor: 'var(--accent)' }}
						>
							{submitting ? 'Saving...' : 'Continue'}
						</button>
					</div>
				)}

				{/* Step 3: First cycle creation */}
				{step === 3 && (
					<div className="flex flex-col gap-8">
						<h2
							className="text-[20px] font-semibold"
							style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
						>
							What do you want to try?
						</h2>

						<div className="flex flex-col gap-6">
							{/* Name input */}
							<div className="flex flex-col gap-2">
								<label
									htmlFor="cycle-name"
									className="text-[15px]"
									style={{ color: 'var(--text-secondary)' }}
								>
									What are you trying to do?
								</label>
								<input
									id="cycle-name"
									type="text"
									value={name}
									onChange={(e) => setValue('name', e.target.value)}
									placeholder="e.g., Write every morning"
									className="px-4 py-3 rounded-lg text-[15px] border-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
									style={{
										backgroundColor: 'var(--surface)',
										color: 'var(--text-primary)',
									}}
								/>
							</div>

							{/* Why now pills */}
							<div className="flex flex-col gap-3">
								<label
									className="text-[15px]"
									style={{ color: 'var(--text-secondary)' }}
								>
									Why now?
								</label>
								<div className="flex flex-wrap gap-2">
									{WHY_NOW_OPTIONS.map((option) => {
										const isSelected = whyNow === option
										return (
											<button
												key={option}
												type="button"
												onClick={handleWhyNowSelect(option)}
												className="px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
												style={{
													backgroundColor: isSelected ? 'var(--surface-high)' : 'var(--surface)',
													color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
												}}
											>
												{startCase(option)}
											</button>
										)
									})}
								</div>
							</div>

							{/* Success vision textarea */}
							<div className="flex flex-col gap-2">
								<label
									htmlFor="success-vision"
									className="text-[15px]"
									style={{ color: 'var(--text-secondary)' }}
								>
									If this works, what changes?{' '}
									<span className="text-[13px]">(optional)</span>
								</label>
								<textarea
									id="success-vision"
									value={watch('successVision')}
									onChange={(e) => setValue('successVision', e.target.value)}
									placeholder="How will things be different?"
									rows={3}
									className="px-4 py-3 rounded-lg text-[15px] border-0 resize-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
									style={{
										backgroundColor: 'var(--surface)',
										color: 'var(--text-primary)',
									}}
								/>
							</div>
						</div>

						<button
							onClick={handleStart}
							disabled={!canStart}
							className="mt-4 px-8 py-3 rounded-lg text-white font-medium transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
							style={{ backgroundColor: 'var(--accent)' }}
						>
							Start
						</button>
					</div>
				)}

				{/* Step 4: Response */}
				{step === 4 && (
					<div className="flex flex-col items-center text-center gap-8">
						<h2
							className="text-[20px] font-semibold"
							style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
						>
							Got it. Let's see what happens.
						</h2>
						<button
							onClick={handleGoToDashboard}
							className="px-8 py-3 rounded-lg text-white font-medium transition-all duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
							style={{ backgroundColor: 'var(--accent)' }}
						>
							Go to Dashboard
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
