'use client'

import { Skeleton } from '@/components/Skeleton'

export default function Home() {
	// Proxy handles all routing logic
	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{ background: 'var(--background)' }}
		>
			<Skeleton className="h-6 w-24" />
		</div>
	)
}
