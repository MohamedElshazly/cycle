'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useReflections } from '@/hooks/useReflections'
import AppShell from '@/layouts/AppShell'

type ReflectionForm = {
	content: string
}

export default function ReflectionsPage() {
	const { userId } = useAuth()
	const { reflections, loading, submit } = useReflections(userId)

	const [expandedId, setExpandedId] = useState<string | null>(null)
	const [saved, setSaved] = useState(false)

	const { register, handleSubmit, reset, watch } = useForm<ReflectionForm>({
		defaultValues: { content: '' },
	})

	const content = watch('content')

	const onSave = useCallback(
		async (data: ReflectionForm) => {
			if (!data.content.trim()) return
			await submit(data.content)
			reset()
			setSaved(true)
			setTimeout(() => setSaved(false), 2000)
		},
		[submit, reset]
	)

	const handleDiscard = useCallback(() => {
		reset()
	}, [reset])

	const toggleExpand = useCallback((id: string) => {
		setExpandedId((prev) => (prev === id ? null : id))
	}, [])

	return (
		<AppShell>
			<div className="flex flex-col gap-12 py-8">
				{/* Main Prompt Area with Accent Glow */}
				<section className="relative flex flex-col items-center gap-8 py-16">
					{/* Accent Glow Effect */}
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background:
								'radial-gradient(circle at center, rgba(176, 138, 158, 0.1) 0%, transparent 70%)',
						}}
					/>

					<div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-150">
						<h1 className="text-[28px] font-semibold tracking-[-0.02em] text-text-primary text-center leading-tight">
							What's one thing you now know about yourself that you didn't
							before?
						</h1>

						{/* Editorial Textarea */}
						<textarea
							{...register('content')}
							placeholder="Take your time..."
							className="w-full min-h-50 bg-transparent border-0 border-b border-border focus:border-accent focus:outline-none text-[15px] leading-[1.6] text-text-primary placeholder:text-text-secondary placeholder:italic resize-none transition-colors duration-150 px-0 py-4"
							style={{ fontFamily: 'Plus Jakarta Sans' }}
						/>

						{/* Actions */}
						<div className="flex items-center justify-between w-full gap-4">
							<button
								onClick={handleDiscard}
								type="button"
								className="text-text-secondary text-[15px] font-normal hover:text-text-primary transition-colors duration-150"
							>
								Discard
							</button>

							<button
								onClick={handleSubmit(onSave)}
								disabled={!content.trim()}
								className="px-8 py-3 bg-accent hover:bg-accent-hover text-white text-[15px] font-semibold rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Save
							</button>
						</div>

						{/* Saved Confirmation */}
						{saved && (
							<div className="text-accent text-[13px] font-medium">
								Saved.
							</div>
						)}
					</div>
				</section>

				{/* Past Reflections Section */}
				{!loading && reflections.length > 0 && (
					<section className="flex flex-col gap-6">
						<h2 className="text-[13px] font-medium uppercase tracking-[0.02em] text-text-secondary">
							Previously
						</h2>

						<div className="flex flex-col gap-6">
							{reflections.map((reflection) => {
								const isExpanded = expandedId === reflection.id
								const displayContent = isExpanded
									? reflection.content
									: reflection.content.slice(0, 100) +
									(reflection.content.length > 100 ? '...' : '')

								return (
									<button
										key={reflection.id}
										onClick={() => toggleExpand(reflection.id)}
										className="flex flex-col gap-2 text-left transition-opacity duration-150 hover:opacity-80"
									>
										<time className="text-[12px] text-text-secondary">
											{new Date(reflection.created_at).toLocaleDateString(
												'en-US',
												{
													month: 'long',
													day: 'numeric',
													year: 'numeric',
												}
											)}
										</time>
										<p className="text-[15px] leading-[1.6] text-text-primary">
											{displayContent}
										</p>
									</button>
								)
							})}
						</div>
					</section>
				)}
			</div>
		</AppShell>
	)
}
