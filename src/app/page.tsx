'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
	const router = useRouter()

	useEffect(() => {
		// Redirect to dashboard by default
		// In production, check auth state and redirect to onboarding if not completed
		router.push('/dashboard')
	}, [router])

	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{ background: 'var(--background)', color: 'var(--text-primary)' }}
		>
			<p>Loading...</p>
		</div>
	)
}
