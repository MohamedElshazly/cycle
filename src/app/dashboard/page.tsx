'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCycles } from '@/hooks/useCycles'
import { CycleCard } from '@/components/CycleCard'
import { DashboardSkeleton } from '@/components/DashboardSkeleton'
import AppShell from '@/layouts/AppShell'

export default function DashboardPage() {
	const router = useRouter()
	const { userId } = useAuth()
	const { cycles, loading } = useCycles(userId)

	const handleNewCycle = useCallback(() => {
		router.push('/cycle/new')
	}, [router])

	return (
		<AppShell>
			<header className="mb-12">
				<h1
					className="text-[28px] font-semibold tracking-[-0.02em] leading-tight"
					style={{ color: 'var(--text-primary)' }}
				>
					Cycle
				</h1>
				<p
					className="text-[15px] mt-1"
					style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
				>
					{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
				</p>
			</header>

			<div className="space-y-8">
				{loading && <DashboardSkeleton />}

				{!loading && cycles.length === 0 && (
					<p
						className="mt-16 text-center text-[15px] leading-[1.6]"
						style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
					>
						Nothing here yet. Start something.
					</p>
				)}

				{!loading && cycles.map((cycle) => (
					<CycleCard key={cycle.id} cycle={cycle} />
				))}
			</div>

			<button
				onClick={handleNewCycle}
				aria-label="Start a new cycle"
				className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent z-40"
				style={{ backgroundColor: 'var(--accent)', boxShadow: '0 8px 24px var(--accent-glow)' }}
			>
				<Plus size={22} color="white" strokeWidth={2.5} />
			</button>
		</AppShell>
	)
}
