'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useReflections } from '@/hooks/useReflections'
import AppShell from '@/layouts/AppShell'

type ReflectionForm = {
	content: string
}

const MONTH = new Date().toLocaleDateString('en-US', { month: 'long' }).toUpperCase()

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

	const handleDiscard = useCallback(() => reset(), [reset])

	const toggleExpand = useCallback((id: string) => {
		setExpandedId((prev) => (prev === id ? null : id))
	}, [])

	return (
		<AppShell>
			{/* Mauve glow behind the entire page */}
			<div
				className="fixed inset-0 pointer-events-none -z-10"
				style={{
					background: 'radial-gradient(circle at 50% 40%, rgba(196, 114, 142, 0.06) 0%, transparent 65%)',
				}}
			/>

			<div className="relative z-10 flex flex-col gap-16">
				{/* Header with context pill */}
				<header className="flex flex-col gap-4 items-start">
					<div
						className="flex items-center gap-2 px-3 py-1 rounded-full"
						style={{
							background: 'rgba(165, 170, 192, 0.06)',
							border: '1px solid rgba(165, 170, 192, 0.15)',
						}}
					>
						<span
							className="w-2 h-2 rounded-full"
							style={{
								background: 'var(--accent)',
								boxShadow: '0 0 8px var(--accent-glow)',
							}}
						/>
						<span
							className="text-[10px] font-semibold tracking-widest uppercase"
							style={{ color: 'var(--text-secondary)' }}
						>
							Monthly Reflection • {MONTH}
						</span>
					</div>
					<h1
						className="text-[28px] font-semibold tracking-[-0.02em] leading-tight max-w-xl"
						style={{ color: 'var(--text-primary)' }}
					>
						What&apos;s one thing you now know about yourself that you didn&apos;t before?
					</h1>
				</header>

				{/* Editorial textarea */}
				<section className="group relative">
					<div
						className="absolute -inset-x-4 -inset-y-4 rounded-2xl transition-opacity duration-700 pointer-events-none opacity-0 group-focus-within:opacity-100"
						style={{ background: 'rgba(22, 27, 39, 0.3)', filter: 'blur(24px)' }}
					/>
					<textarea
						{...register('content')}
						placeholder="Begin your thought here..."
						className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-4 block"
						style={{
							fontSize: '18px',
							lineHeight: 1.8,
							color: 'var(--text-primary)',
							minHeight: '400px',
						}}
					/>

					{/* Flow state indicator */}
					<div className="mt-8 flex items-center gap-6">
						<div
							className="h-px flex-grow"
							style={{ background: 'linear-gradient(to right, rgba(165, 170, 192, 0.3), transparent)' }}
						/>
						<div className="flex items-center gap-3">
							<span
								className="text-[12px] font-medium uppercase tracking-[0.2em]"
								style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
							>
								Flow State
							</span>
							<div
								className="w-3 h-3 rounded-full flex items-center justify-center"
								style={{ background: 'var(--accent-subtle)' }}
							>
								<div
									className="w-1.5 h-1.5 rounded-full animate-pulse"
									style={{ background: 'var(--accent)' }}
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Actions */}
				<footer className="flex items-center justify-between">
					<button
						onClick={handleDiscard}
						type="button"
						className="text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 hover:opacity-80"
						style={{ color: 'var(--text-secondary)' }}
					>
						Discard
					</button>

					<div className="flex items-center gap-4">
						{saved && (
							<span
								className="text-[13px] font-medium"
								style={{ color: 'var(--accent)', opacity: 0.8 }}
							>
								Saved.
							</span>
						)}
						<button
							onClick={handleSubmit(onSave)}
							disabled={!content.trim()}
							className="px-10 py-4 font-semibold rounded-xl text-sm tracking-wide transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
							style={{
								background: 'var(--accent)',
								color: 'white',
								boxShadow: '0 8px 24px var(--accent-glow)',
							}}
						>
							Save Reflection
						</button>
					</div>
				</footer>

				{/* Past reflections */}
				{!loading && reflections.length > 0 && (
					<section className="flex flex-col gap-6 pt-8" style={{ borderTop: '1px solid rgba(165, 170, 192, 0.08)' }}>
						<h2
							className="text-[12px] font-medium uppercase tracking-widest"
							style={{ color: 'var(--text-secondary)', opacity: 0.4 }}
						>
							Previously
						</h2>

						<div className="flex flex-col gap-8">
							{reflections.map((reflection) => {
								const isExpanded = expandedId === reflection.id
								const displayContent = isExpanded
									? reflection.content
									: reflection.content.slice(0, 120) + (reflection.content.length > 120 ? '...' : '')

								return (
									<button
										key={reflection.id}
										onClick={() => toggleExpand(reflection.id)}
										className="flex flex-col gap-2 text-left transition-opacity duration-150 hover:opacity-80"
									>
										<time
											className="text-[12px]"
											style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
										>
											{new Date(reflection.created_at).toLocaleDateString('en-US', {
												month: 'long',
												day: 'numeric',
												year: 'numeric',
											})}
										</time>
										<p
											className="text-[15px] leading-[1.6]"
											style={{ color: 'var(--text-primary)' }}
										>
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
