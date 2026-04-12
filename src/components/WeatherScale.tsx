'use client'

import { useCallback } from 'react'

type WeatherScaleProps = {
	question: string
	value: number | null
	onChange: (val: number) => void
}

const PILL_LABELS: Record<number, string> = {
	1: 'not at all',
	2: 'a bit',
	3: 'some',
	4: 'quite a bit',
	5: 'a lot',
}

const PILL_VALUES = [1, 2, 3, 4, 5] as const

export function WeatherScale({ question, value, onChange }: WeatherScaleProps) {
	const handleSelect = useCallback(
		(val: number) => () => {
			onChange(val)
		},
		[onChange]
	)

	return (
		<div className="flex flex-col gap-4">
			<p
				className="text-text-primary leading-relaxed"
				style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.6 }}
			>
				{question}
			</p>

			<div className="flex gap-2">
				{PILL_VALUES.map((val) => {
					const isSelected = value === val
					return (
						<button
							key={val}
							type="button"
							onClick={handleSelect(val)}
							className={[
								'flex-1 rounded-lg px-2 py-2.5 text-center transition-all duration-150 ease-in-out',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
								isSelected
									? 'bg-accent-subtle border border-accent text-accent'
									: 'bg-surface-high border border-transparent text-text-secondary',
							].join(' ')}
							aria-pressed={isSelected}
							aria-label={`${PILL_LABELS[val]}, option ${val} of 5`}
						>
							<span
								style={{ fontSize: '12px', fontWeight: 500, lineHeight: 1.4 }}
							>
								{PILL_LABELS[val]}
							</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
