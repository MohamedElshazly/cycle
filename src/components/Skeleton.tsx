type SkeletonProps = {
	className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
	return (
		<div
			className={`animate-pulse rounded-lg ${className}`}
			style={{ backgroundColor: 'var(--surface-high)' }}
		/>
	)
}
