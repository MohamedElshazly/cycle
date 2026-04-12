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
		<div className="min-h-screen flex items-center justify-center px-6">
			<div className="w-full max-w-120 flex flex-col items-center space-y-12">
				{/* Pulse Indicator */}
				<div className="relative">
					<style jsx>{`
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }
            .pulse-animation {
              animation: pulse 2s ease-in-out infinite;
            }
          `}</style>
					<div
						className="w-16 h-16 rounded-full pulse-animation"
						style={{
							background: 'var(--accent)',
							boxShadow: '0 0 20px rgba(176, 138, 158, 0.4)',
						}}
					/>
				</div>

				{/* Heading */}
				<div className="text-center space-y-3">
					<h1
						className="text-[28px] font-semibold text-primary"
						style={{
							letterSpacing: '-0.02em',
							color: 'var(--text-primary)',
						}}
					>
						This one's yours now.
					</h1>
					<p
						className="text-[15px]"
						style={{
							color: 'var(--text-secondary)',
						}}
					>
						{cycle?.name || ''}
					</p>
				</div>

				{/* Optional Text Input */}
				<div className="w-full max-w-90 space-y-4">
					<label
						htmlFor="graduate-note"
						className="block text-[15px]"
						style={{
							color: 'var(--text-primary)',
						}}
					>
						What does that feel like?
					</label>
					<textarea
						id="graduate-note"
						{...register('note')}
						placeholder="(no pressure)"
						rows={3}
						className="w-full bg-transparent border-0 border-b text-[15px] px-0 py-3 focus:outline-none focus:ring-0 resize-none"
						style={{
							borderBottomWidth: '1px',
							borderBottomColor: 'var(--border)',
							color: 'var(--text-primary)',
						}}
					/>
					<p
						className="text-[12px] italic"
						style={{
							color: 'var(--text-secondary)',
						}}
					>
						(no pressure)
					</p>
				</div>

				{/* Done Button */}
				<button
					onClick={handleGraduate}
					disabled={formState.isSubmitting}
					className="px-6 py-2 text-[15px] font-normal hover:opacity-80 transition-opacity duration-150"
					style={{
						color: 'var(--text-secondary)',
					}}
				>
					Done
				</button>
			</div>
		</div>
	)
}
