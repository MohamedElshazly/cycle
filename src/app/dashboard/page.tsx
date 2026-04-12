'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCycles } from '@/hooks/useCycles'
import { CycleCard } from '@/components/CycleCard'
import AppShell from '@/layouts/AppShell'

export default function DashboardPage() {
	const router = useRouter()
	const { userId } = useAuth()
	const { cycles, loading } = useCycles(userId)

	const handleCheckIn = useCallback(
		(id: string) => () => {
			router.push(`/cycle/${id}/checkin`)
		},
		[router]
	)

	const handleNewCycle = useCallback(() => {
		router.push('/cycle/new')
	}, [router])

	return (
		<AppShell>
			<h2
				className="mt-12 text-[20px] font-semibold leading-snug"
				style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
			>
				What are you working on?
			</h2>

			<div className="mt-8 flex flex-col gap-4">
				{loading && (
					<p
						className="text-[15px]"
						style={{ color: 'var(--text-secondary)' }}
					>
						...
					</p>
				)}

				{!loading && cycles.length === 0 && (
					<p
						className="mt-16 text-center text-[15px] leading-relaxed"
						style={{ color: 'var(--text-secondary)' }}
					>
						Nothing here yet. Start something.
					</p>
				)}

				{!loading &&
					cycles.map((cycle) => (
						<CycleCard
							key={cycle.id}
							cycle={cycle}
							onCheckIn={handleCheckIn(cycle.id)}
						/>
					))}
			</div>

			<button
				onClick={handleNewCycle}
				aria-label="Start a new cycle"
				className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-12 h-12 rounded-full flex items-center justify-center transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] z-40"
				style={{ backgroundColor: 'var(--accent)' }}
			>
				<Plus size={20} color="white" strokeWidth={2.5} />
			</button>
		</AppShell>
	)
}
