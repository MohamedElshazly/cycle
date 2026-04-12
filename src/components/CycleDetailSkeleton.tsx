import { Skeleton } from '@/components/Skeleton'

export function CycleDetailSkeleton() {
	return (
		<div className="max-w-120 mx-auto">
			<div className="mt-12 mb-12">
				<Skeleton className="h-4 w-16 mb-6" />
				<Skeleton className="h-7 w-64 mb-4" />
				<Skeleton className="h-4 w-48" />
			</div>
			<div className="mb-24">
				<Skeleton className="h-3 w-20 mb-6" />
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex items-baseline gap-3 mb-6">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-3 w-16" />
					</div>
				))}
			</div>
		</div>
	)
}
