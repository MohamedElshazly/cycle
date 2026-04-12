'use client'

import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCycle } from '@/hooks/useCycle'

type GraduateForm = {
	note: string
}

export default function GraduatePage() {
	const { id } = useParams<{ id: string }>()
	const router = useRouter()
	const { cycle, graduate } = useCycle(id)

	const { register, getValues, formState } = useForm<GraduateForm>({
		defaultValues: { note: '' },
	})

	const handleGraduate = useCallback(async () => {
		const { note } = getValues()
		try {
			await graduate(note || undefined)
			router.push('/dashboard')
		} catch (error) {
			console.error('Failed to graduate cycle:', error)
		}
	}, [graduate, getValues, router])

	return (
		<div
			className="relative min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden"
			style={{ background: 'var(--background)' }}
		>
			{/* Accent radial glow */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background: 'radial-gradient(circle at center, rgba(196, 114, 142, 0.08) 0%, transparent 70%)',
				}}
			/>

			{/* Pulse indicator */}
			<div className="mb-12 relative z-10">
				<div
					className="w-32 h-32 rounded-full flex items-center justify-center"
					style={{ background: 'var(--accent-subtle)' }}
				>
					<div
						className="w-16 h-16 rounded-full"
						style={{
							background: 'var(--accent)',
							boxShadow: '0 0 40px var(--accent-glow)',
						}}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="w-full max-w-180 text-center space-y-8 z-10 relative">
				<div className="space-y-3">
					<h1
						className="text-3xl font-semibold tracking-tight"
						style={{ color: 'var(--text-primary)' }}
					>
						This one&apos;s yours now.
					</h1>
					<p
						className="font-medium tracking-wide uppercase text-sm"
						style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
					>
						{cycle?.name ?? ''}
					</p>
				</div>

				{/* Input */}
				<div className="pt-12 w-full max-w-md mx-auto">
					<div className="relative">
						<label
							htmlFor="graduate-note"
							className="block text-left text-xs font-medium mb-4 uppercase tracking-widest"
							style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
						>
							Optional reflection
						</label>
						<input
							id="graduate-note"
							{...register('note')}
							placeholder="What does that feel like?"
							className="w-full bg-transparent border-0 border-b py-4 text-lg focus:ring-0 focus:outline-none transition-all duration-500 placeholder:font-light"
							style={{
								borderBottomColor: 'rgba(165, 170, 192, 0.2)',
								color: 'var(--text-primary)',
							}}
							onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
							onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(165, 170, 192, 0.2)')}
						/>
						<p
							className="text-left mt-2 text-[10px] italic"
							style={{ color: 'var(--text-secondary)', opacity: 0.4 }}
						>
							(no pressure)
						</p>
					</div>
				</div>

				{/* Done button */}
				<div className="pt-16">
					<button
						onClick={handleGraduate}
						disabled={formState.isSubmitting}
						className="px-12 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:opacity-70 disabled:opacity-30"
						style={{ color: 'var(--accent)' }}
					>
						Done
					</button>
				</div>
			</div>

			{/* Footnote */}
			<div
				className="absolute bottom-12 text-[11px] uppercase tracking-[0.2em]"
				style={{ color: 'var(--text-secondary)', opacity: 0.3 }}
			>
				Recognition &amp; Awareness
			</div>
		</div>
	)
}
