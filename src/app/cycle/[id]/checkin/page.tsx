'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useCheckins } from '@/hooks/useCheckins'
import { WeatherScale } from '@/components/WeatherScale'
import { CheckinResponse } from '@/types/Checkin'

type Step = 1 | 2 | 3 | 'done'

type CheckinForm = {
	didTheThing: CheckinResponse | null
	generalFeeling: number | null
	note: string
}

export default function CheckinPage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()
	const { userId } = useAuth()

	const [step, setStep] = useState<Step>(1)

	const { setValue, watch, getValues } = useForm<CheckinForm>({
		defaultValues: {
			didTheThing: null,
			generalFeeling: null,
			note: '',
		},
	})

	const { submit, submitting } = useCheckins(id)

	const didTheThing = watch('didTheThing')
	const generalFeeling = watch('generalFeeling')

	const handleDidTheThingSelect = useCallback((value: CheckinResponse) => {
		setValue('didTheThing', value)
		setTimeout(() => setStep(2), 300)
	}, [setValue])

	const handleFeelingSelect = useCallback((value: number) => {
		setValue('generalFeeling', value)
		setTimeout(() => setStep(3), 300)
	}, [setValue])

	const handleSave = useCallback(async () => {
		const data = getValues()
		if (!userId || !data.didTheThing || !data.generalFeeling) return

		try {
			await submit({
				userId,
				didTheThing: data.didTheThing,
				generalFeeling: data.generalFeeling,
				note: data.note || undefined,
			})
			setStep('done')
			setTimeout(() => router.push(`/cycle/${id}`), 800)
		} catch (error) {
			console.error('Failed to save check-in:', error)
		}
	}, [userId, getValues, submit, router, id])

	const handleSkip = useCallback(async () => {
		const data = getValues()
		if (!userId || !data.didTheThing || !data.generalFeeling) return

		try {
			await submit({
				userId,
				didTheThing: data.didTheThing,
				generalFeeling: data.generalFeeling,
			})
			setStep('done')
			setTimeout(() => router.push(`/cycle/${id}`), 800)
		} catch (error) {
			console.error('Failed to save check-in:', error)
		}
	}, [userId, getValues, submit, router, id])

	if (step === 'done') {
		return (
			<div
				className="min-h-screen flex items-center justify-center"
				style={{ background: 'var(--background)' }}
			>
				<h1
					className="text-[28px] font-semibold tracking-[-0.02em]"
					style={{ color: 'var(--text-primary)' }}
				>
					Got it.
				</h1>
			</div>
		)
	}

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ background: 'var(--background)', color: 'var(--text-primary)' }}
		>
			{/* Progress Dots */}
			<div className="flex justify-center items-center gap-2 pt-8 pb-12">
				{[1, 2, 3].map((dotStep) => (
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
								Did you do it?
							</h2>

							<div className="flex flex-col gap-4">
								{[
									{ label: 'yes', value: 'yes' as CheckinResponse },
									{ label: 'not really', value: 'no' as CheckinResponse },
									{
										label: 'somewhere in between',
										value: 'partially' as CheckinResponse,
									},
								].map((option) => (
									<button
										key={option.value}
										onClick={() => handleDidTheThingSelect(option.value)}
										className="w-full px-6 py-4 rounded-xl text-[15px] font-medium transition-all duration-150"
										style={{
											background: 'var(--surface-high)',
											color: 'var(--text-primary)',
										}}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>
					)}

					{step === 2 && (
						<div className="flex flex-col gap-8">
							<WeatherScale
								question="How are you feeling generally?"
								value={generalFeeling}
								onChange={handleFeelingSelect}
							/>
						</div>
					)}

					{step === 3 && (
						<div className="flex flex-col gap-8">
							<h2
								className="text-[20px] font-semibold tracking-[-0.01em] text-center"
								style={{ color: 'var(--text-primary)' }}
							>
								Anything worth noting?
							</h2>

							<textarea
								value={watch('note')}
								onChange={(e) => setValue('note', e.target.value)}
								placeholder="no pressure"
								className="w-full min-h-30 px-4 py-3 rounded-lg text-[15px] leading-[1.6] resize-none transition-all duration-150 border-b"
								style={{
									background: 'transparent',
									color: 'var(--text-primary)',
									borderColor: 'var(--border)',
									borderWidth: '0 0 1px 0',
								}}
							/>

							<div className="flex flex-col gap-3">
								<button
									onClick={handleSave}
									disabled={submitting}
									className="w-full px-6 py-3 rounded-lg text-[15px] font-medium transition-all duration-150"
									style={{
										background: 'var(--accent)',
										color: 'var(--background)',
										opacity: submitting ? 0.5 : 1,
									}}
								>
									Save
								</button>
								<button
									onClick={handleSkip}
									disabled={submitting}
									className="text-[13px] transition-colors duration-150"
									style={{
										color: 'var(--text-secondary)',
										opacity: submitting ? 0.5 : 1,
									}}
								>
									Skip
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
