'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useCycles } from '@/hooks/useCycles'
import AppShell from '@/layouts/AppShell'

const WHY_NOW_OPTIONS = [
	'fresh start',
	'someone suggested it',
	'been avoiding it',
	'feels urgent',
	'ready',
]

type NewCycleForm = {
	name: string
	whyNow: string | undefined
	successVision: string
}

export default function NewCyclePage() {
	const router = useRouter()
	const { userId } = useAuth()
	const { create } = useCycles(userId)

	const { register, handleSubmit, setValue, watch, formState } = useForm<NewCycleForm>({
		defaultValues: {
			name: '',
			whyNow: undefined,
			successVision: '',
		},
	})

	const whyNow = watch('whyNow')

	const handleToggleWhyNow = useCallback(
		(option: string) => {
			setValue('whyNow', whyNow === option ? undefined : option)
		},
		[whyNow, setValue]
	)

	const onSubmit = useCallback(
		async (data: NewCycleForm) => {
			if (!userId) return

			try {
				await create({
					name: data.name.trim(),
					whyNow: data.whyNow || undefined,
					successVision: data.successVision.trim() || undefined,
				})
				router.push('/dashboard')
			} catch (error) {
				console.error('Failed to create cycle:', error)
			}
		},
		[userId, create, router]
	)

	const handleCancel = useCallback(() => {
		router.push('/dashboard')
	}, [router])

	const name = watch('name')
	const isFormValid = name.trim().length > 0

	return (
		<AppShell>
			<div className="mx-auto max-w-120">
				<h2 className="mt-12 text-xl font-semibold tracking-tight text-text-primary">
					What are you trying to do?
				</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-8">
					<div>
						<label
							htmlFor="name"
							className="block text-[15px] text-text-primary mb-3"
						>
							What are you trying to do?
						</label>
						<input
							id="name"
							type="text"
							{...register('name', { required: true })}
							placeholder="e.g., meditate daily, write more, stop scrolling"
							className="w-full max-w-100 bg-transparent text-[15px] text-text-primary placeholder:text-text-secondary border-0 border-b border-border px-0 py-2 focus:outline-none focus:border-accent transition-colors duration-150"
						/>
					</div>

					<div>
						<label className="block text-[15px] text-text-primary mb-3">
							Why now?
						</label>
						<div className="flex flex-wrap gap-2">
							{WHY_NOW_OPTIONS.map((option) => {
								const isSelected = whyNow === option
								return (
									<button
										key={option}
										type="button"
										onClick={() => handleToggleWhyNow(option)}
										className={`px-4 py-2 rounded-full text-[15px] transition-colors duration-150 ${isSelected
											? 'bg-accent-subtle border border-accent text-accent'
											: 'bg-surface-high text-text-secondary border border-transparent'
											}`}
									>
										{option}
									</button>
								)
							})}
						</div>
					</div>

					<div>
						<label
							htmlFor="successVision"
							className="block text-[15px] text-text-primary mb-3"
						>
							If this works, what changes?
						</label>
						<textarea
							id="successVision"
							{...register('successVision')}
							placeholder="(optional)"
							rows={4}
							className="w-full max-w-100 bg-transparent text-[15px] text-text-primary placeholder:text-text-secondary border-0 border-b border-border px-0 py-2 resize-none focus:outline-none focus:border-accent transition-colors duration-150"
						/>
					</div>

					<div className="flex items-center gap-6 pt-4">
						<button
							type="submit"
							disabled={!isFormValid || formState.isSubmitting}
							className="px-6 py-3 rounded-lg bg-accent text-white text-[15px] font-medium transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Start
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="text-[15px] text-text-secondary hover:text-text-primary transition-colors duration-150"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</AppShell>
	)
}
