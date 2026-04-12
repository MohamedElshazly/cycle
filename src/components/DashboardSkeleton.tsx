import { Skeleton } from '@/components/Skeleton'

export function DashboardSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="rounded-xl p-6"
					style={{ backgroundColor: 'var(--surface)' }}
				>
					<div className="flex items-center gap-3 mb-4">
						<Skeleton className="w-2.5 h-2.5 rounded-full" />
						<Skeleton className="h-4 w-40" />
					</div>
					<Skeleton className="h-3 w-24" />
				</div>
			))}
		</div>
	)
}
