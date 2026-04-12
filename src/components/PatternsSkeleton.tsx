import { Skeleton } from '@/components/Skeleton'

export function PatternsSkeleton() {
	return (
		<div className="space-y-12">
			<div className="mt-12">
				<Skeleton className="h-7 w-56 mb-2" />
			</div>
			<div
				className="rounded-xl p-6"
				style={{ backgroundColor: 'var(--surface)' }}
			>
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-3/4" />
			</div>
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex justify-between items-start gap-4">
						<div className="flex-1">
							<Skeleton className="h-4 w-40 mb-2" />
							<Skeleton className="h-3 w-16" />
						</div>
						<Skeleton className="w-2.5 h-2.5 rounded-full" />
					</div>
				))}
			</div>
		</div>
	)
}
