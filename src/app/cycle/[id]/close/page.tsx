'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCycle } from '@/hooks/useCycle'

const CONTEXT_TAG_OPTIONS = [
	'work pressure',
	'relationship tension',
	'low energy',
	'boredom',
	'illness',
	'travel',
	'big change',
	'lost interest',
	'no time',
	'other priorities',
]

type CloseForm = {
	contextTags: string[]
	note: string
}

export default function ClosePage() {
	const { id } = useParams<{ id: string }>()
	const router = useRouter()
	const { close } = useCycle(id)

	const [showMessage, setShowMessage] = useState(false)

	const { register, setValue, watch, getValues } = useForm<CloseForm>({
		defaultValues: {
			contextTags: [],
			note: '',
		},
	})

	const contextTags = watch('contextTags')

	const toggleTag = useCallback((tag: string) => {
		const current = getValues('contextTags')
		const next = current.includes(tag)
			? current.filter((t) => t !== tag)
			: [...current, tag]
		setValue('contextTags', next)
	}, [getValues, setValue])

	const handleSubmit = useCallback(async () => {
		const data = getValues()
		setShowMessage(true)

		await close({
			contextTags: data.contextTags.length > 0 ? data.contextTags : undefined,
			note: data.note.trim() || undefined,
		})

		setTimeout(() => {
			router.push('/dashboard')
		}, 1200)
	}, [getValues, close, router])

	const handleSkip = useCallback(async () => {
		await close(undefined)
		router.push('/dashboard')
	}, [close, router])

	if (showMessage) {
		return (
			<div className="min-h-screen flex items-center justify-center px-6 bg-background">
				<p
					className="text-text-primary text-center"
					style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.6 }}
				>
					Got it. This one&apos;s part of your story now.
				</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background overflow-y-auto">
			<div className="mx-auto px-6 py-6" style={{ maxWidth: '480px' }}>
				<div className="flex flex-col gap-12">
					{/* Heading */}
					<h2
						className="text-text-primary"
						style={{
							fontSize: '20px',
							fontWeight: 600,
							letterSpacing: '-0.01em',
						}}
					>
						What was happening?
					</h2>

					{/* Context Tags */}
					<div className="flex flex-col gap-4">
						<div className="flex flex-wrap gap-2">
							{CONTEXT_TAG_OPTIONS.map((tag) => {
								const isSelected = contextTags.includes(tag)
								return (
									<button
										key={tag}
										type="button"
										onClick={() => toggleTag(tag)}
										className={[
											'px-4 py-2.5 rounded-lg transition-all duration-150 ease-in-out',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border',
											isSelected
												? 'bg-surface-high border border-border text-text-primary'
												: 'bg-surface-high border border-transparent text-text-secondary',
										].join(' ')}
										aria-pressed={isSelected}
									>
										<span
											style={{
												fontSize: '13px',
												fontWeight: 500,
												lineHeight: 1.4,
											}}
										>
											{tag}
										</span>
									</button>
								)
							})}
						</div>
					</div>

					{/* Free Text Input */}
					<div className="flex flex-col gap-3">
						<label
							htmlFor="closing-note"
							className="text-text-primary"
							style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.6 }}
						>
							What do you want to remember about this one?
						</label>
						<textarea
							id="closing-note"
							{...register('note')}
							placeholder="no pressure"
							rows={4}
							className="bg-transparent text-text-primary placeholder:text-text-secondary placeholder:italic border-0 border-b border-border focus:border-accent focus:outline-none transition-colors duration-150 resize-none"
							style={{
								fontSize: '15px',
								fontWeight: 400,
								lineHeight: 1.6,
								paddingBottom: '8px',
							}}
						/>
					</div>

					{/* Actions */}
					<div className="flex flex-col gap-4">
						<button
							type="button"
							onClick={handleSubmit}
							className="w-full py-3.5 px-6 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							style={{ fontSize: '15px', fontWeight: 500 }}
						>
							Save and close
						</button>

						<button
							type="button"
							onClick={handleSkip}
							className="w-full text-text-secondary hover:text-text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border rounded-lg"
							style={{ fontSize: '15px', fontWeight: 400, padding: '8px' }}
						>
							Skip
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
