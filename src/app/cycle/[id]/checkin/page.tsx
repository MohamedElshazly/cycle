'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { X, Zap, Sun, Cloud, CloudRain, Moon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCheckins } from '@/hooks/useCheckins'
import type { CheckinResponse } from '@/types/Checkin'

type Step = 1 | 2 | 3 | 'done'

type CheckinForm = {
	didTheThing: CheckinResponse | null
	generalFeeling: number | null
	note: string
}

const DID_OPTIONS: { label: string; value: CheckinResponse; icon: React.ComponentType<{ size?: number }> }[] = [
	{ label: 'Yes', value: 'yes', icon: Zap },
	{ label: 'Not really', value: 'no', icon: Moon },
	{ label: 'Somewhere in between', value: 'partially', icon: Cloud },
]

const FEELING_OPTIONS: { label: string; value: number; icon: React.ComponentType<{ size?: number }> }[] = [
	{ label: 'Alive', value: 5, icon: Zap },
	{ label: 'Good', value: 4, icon: Sun },
	{ label: 'Okay', value: 3, icon: Cloud },
	{ label: 'Low', value: 2, icon: CloudRain },
	{ label: 'Very Low', value: 1, icon: Moon },
]

const STEP_LABELS: Record<number, string> = {
	1: 'Step 01',
	2: 'Step 02',
	3: 'Step 03',
}

export default function CheckinPage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()
	const { userId } = useAuth()

	const [step, setStep] = useState<Step>(1)
	const [selected, setSelected] = useState<number | string | null>(null)

	const { setValue, watch, getValues } = useForm<CheckinForm>({
		defaultValues: { didTheThing: null, generalFeeling: null, note: '' },
	})

	const { submit, submitting } = useCheckins(id)
	const generalFeeling = watch('generalFeeling')

	const handleDidTheThingSelect = useCallback((value: CheckinResponse) => {
		setSelected(value)
		setValue('didTheThing', value)
		setTimeout(() => { setSelected(null); setStep(2) }, 250)
	}, [setValue])

	const handleFeelingSelect = useCallback((value: number) => {
		setSelected(value)
		setValue('generalFeeling', value)
		setTimeout(() => { setSelected(null); setStep(3) }, 250)
	}, [setValue])

	const handleSave = useCallback(async () => {
		const data = getValues()
		if (!userId || !data.didTheThing || !data.generalFeeling) return
		try {
			await submit({ userId, didTheThing: data.didTheThing, generalFeeling: data.generalFeeling, note: data.note || undefined })
			setStep('done')
			setTimeout(() => router.push(`/cycle/${id}`), 800)
		} catch (err) {
			console.error('Failed to save check-in:', err)
		}
	}, [userId, getValues, submit, router, id])

	const handleSkip = useCallback(async () => {
		const data = getValues()
		if (!userId || !data.didTheThing || !data.generalFeeling) return
		try {
			await submit({ userId, didTheThing: data.didTheThing, generalFeeling: data.generalFeeling })
			setStep('done')
			setTimeout(() => router.push(`/cycle/${id}`), 800)
		} catch (err) {
			console.error('Failed to save check-in:', err)
		}
	}, [userId, getValues, submit, router, id])

	if (step === 'done') {
		return (
			<div
				className="min-h-screen flex items-center justify-center"
				style={{ background: 'var(--background)' }}
			>
				<div className="text-center space-y-3">
					<div
						className="w-3 h-3 rounded-full mx-auto animate-pulse"
						style={{ background: 'var(--accent)' }}
					/>
					<p
						className="text-[15px] font-medium uppercase tracking-widest"
						style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
					>
						Noted.
					</p>
				</div>
			</div>
		)
	}

	const currentStep = typeof step === 'number' ? step : 1

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ background: 'var(--background)', color: 'var(--text-primary)' }}
		>
			{/* Ambient glow */}
			<div
				className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
				style={{ background: 'var(--accent-subtle)', filter: 'blur(120px)' }}
			/>

			{/* Progress dots */}
			<div className="fixed top-10 left-0 w-full flex justify-center gap-3 z-10">
				{[1, 2, 3].map((dot) => (
					<div
						key={dot}
						className="w-1.5 h-1.5 rounded-full transition-all duration-300"
						style={{
							background: dot === currentStep ? 'var(--accent)' : 'var(--surface-highest)',
							boxShadow: dot === currentStep ? '0 0 8px var(--accent-glow)' : 'none',
						}}
					/>
				))}
			</div>

			{/* Close button */}
			<button
				onClick={() => router.push(`/cycle/${id}`)}
				className="fixed top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150 z-10"
				style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}
				aria-label="Close"
			>
				<X size={18} />
			</button>

			{/* Main content */}
			<main className="w-full max-w-180 mx-auto px-8 py-24 flex flex-col relative z-10">
				{/* Step label */}
				<span
					className="text-[12px] font-medium tracking-[0.2em] uppercase mb-6 block"
					style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
				>
					{STEP_LABELS[currentStep]}
				</span>

				{/* Step 1 — Did you do it? */}
				{step === 1 && (
					<>
						<h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] mb-16">
							Did you show up today?
						</h2>
						<div className="w-full space-y-4">
							{DID_OPTIONS.map(({ label, value, icon: Icon }) => {
								const isSelected = selected === value
								return (
									<button
										key={value}
										onClick={() => handleDidTheThingSelect(value)}
										className="w-full group flex items-center justify-between p-6 rounded-xl transition-all duration-200"
										style={{
											background: isSelected ? 'var(--accent-subtle)' : 'var(--surface)',
											border: `1px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
											color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
										}}
									>
										<span className="text-[15px] font-medium tracking-wide">{label}</span>
										<Icon size={20} />
									</button>
								)
							})}
						</div>
					</>
				)}

				{/* Step 2 — How are you feeling? */}
				{step === 2 && (
					<>
						<h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] mb-16">
							How is your energy right now?
						</h2>
						<div className="w-full space-y-4">
							{FEELING_OPTIONS.map(({ label, value, icon: Icon }) => {
								const isSelected = generalFeeling === value || selected === value
								return (
									<button
										key={value}
										onClick={() => handleFeelingSelect(value)}
										className="w-full group flex items-center justify-between p-6 rounded-xl transition-all duration-200"
										style={{
											background: isSelected ? 'var(--accent-subtle)' : 'var(--surface)',
											border: `1px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
											color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
										}}
									>
										<span className="text-[15px] font-medium tracking-wide">{label}</span>
										<Icon size={20} />
									</button>
								)
							})}
						</div>
					</>
				)}

				{/* Step 3 — Note */}
				{step === 3 && (
					<>
						<h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] mb-16">
							Anything worth noting?
						</h2>
						<textarea
							value={watch('note')}
							onChange={(e) => setValue('note', e.target.value)}
							placeholder="A word or a sentence..."
							className="w-full bg-transparent border-0 border-b text-[18px] leading-[1.8] resize-none focus:outline-none focus:ring-0 transition-colors duration-300 py-4 mb-12"
							style={{
								borderBottomColor: 'rgba(165, 170, 192, 0.2)',
								color: 'var(--text-primary)',
								minHeight: '160px',
							}}
							onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
							onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(165, 170, 192, 0.2)')}
						/>
						<div className="flex flex-col gap-4">
							<button
								onClick={handleSave}
								disabled={submitting}
								className="w-full h-14 rounded-lg text-[15px] font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-40"
								style={{
									background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)`,
									color: 'white',
									boxShadow: '0 8px 24px var(--accent-glow)',
								}}
							>
								Save
							</button>
							<button
								onClick={handleSkip}
								disabled={submitting}
								className="text-[13px] text-center transition-opacity duration-150 hover:opacity-100 disabled:opacity-30"
								style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
							>
								Skip note
							</button>
						</div>
					</>
				)}
			</main>

			{/* Footer */}
			<div className="fixed bottom-10 left-0 w-full flex flex-col items-center gap-4 pointer-events-none">
				<div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)', opacity: 0.4 }} />
				<p
					className="text-[12px] font-medium tracking-[0.1em] uppercase"
					style={{ color: 'var(--text-secondary)', opacity: 0.4 }}
				>
					Just notice without judgment
				</p>
			</div>
		</div>
	)
}
