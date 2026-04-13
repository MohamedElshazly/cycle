'use client'

import { useAuth } from '@/hooks/useAuth'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@/components/Skeleton'

function LoginContent() {
	const { signIn, isLoading } = useAuth()
	const searchParams = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const handleGoogleSignIn = async () => {
		try {
			await signIn()
		} catch (error) {
			console.error('Sign in error:', error)
		}
	}

	return (
		<div
			className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden"
			style={{ background: 'var(--background)' }}
		>
			{/* Subtle background accent */}
			<div
				className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full blur-[120px] opacity-[0.03] pointer-events-none"
				style={{ background: 'var(--accent)' }}
			/>

			<div className="w-full max-w-180 relative">
				{/* Hero Section */}
				<div className="text-center mb-20">
					<div
						className="inline-block mb-6 px-4 py-2 rounded-full text-[13px] font-medium tracking-[0.02em] uppercase"
						style={{
							background: 'var(--accent-subtle)',
							color: 'var(--accent)',
						}}
					>
						Self-awareness journal
					</div>
					<div className="mb-8 flex items-center justify-center gap-3">
						<div
							className="w-1.5 h-1.5 rounded-full animate-pulse"
							style={{ background: 'var(--accent)', animationDuration: '3s' }}
						/>
						<h1
							className="text-[28px] font-semibold tracking-[-0.02em]"
							style={{ color: 'var(--text-primary)' }}
						>
							Cycle
						</h1>
					</div>
					<h2
						className="text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] mb-6 leading-[1.15]"
						style={{ color: 'var(--text-primary)' }}
					>
						Understand why habits break,<br />
						not just whether they happen
					</h2>
					<p
						className="text-[17px] leading-[1.6] max-w-135 mx-auto"
						style={{ color: 'var(--text-secondary)' }}
					>
						A journal for the messy middle. No streaks, no guilt—just honest reflection on what's actually happening.
					</p>
				</div>

				{/* Features Cards */}
				<div className="grid md:grid-cols-3 gap-6 mb-20 max-w-170 mx-auto">
					<div
						className="p-6 rounded-xl transition-all duration-150"
						style={{
							background: 'var(--surface)',
							border: '1px solid var(--border)',
						}}
					>
						<div className="text-[24px] mb-4">📝</div>
						<h3
							className="text-[15px] font-semibold mb-2"
							style={{ color: 'var(--text-primary)' }}
						>
							Journal, not dashboard
						</h3>
						<p
							className="text-[14px] leading-[1.6]"
							style={{ color: 'var(--text-secondary)' }}
						>
							No red-green judgment. Just space to reflect.
						</p>
					</div>

					<div
						className="p-6 rounded-xl transition-all duration-150"
						style={{
							background: 'var(--surface)',
							border: '1px solid var(--border)',
						}}
					>
						<div className="text-[24px] mb-4">🌊</div>
						<h3
							className="text-[15px] font-semibold mb-2"
							style={{ color: 'var(--text-primary)' }}
						>
							Capture the unraveling
						</h3>
						<p
							className="text-[14px] leading-[1.6]"
							style={{ color: 'var(--text-secondary)' }}
						>
							Notice what happens when things fall apart.
						</p>
					</div>

					<div
						className="p-6 rounded-xl transition-all duration-150"
						style={{
							background: 'var(--surface)',
							border: '1px solid var(--border)',
						}}
					>
						<div className="text-[24px] mb-4">🌙</div>
						<h3
							className="text-[15px] font-semibold mb-2"
							style={{ color: 'var(--text-primary)' }}
						>
							Private & honest
						</h3>
						<p
							className="text-[14px] leading-[1.6]"
							style={{ color: 'var(--text-secondary)' }}
						>
							Think 2am thoughts, not productivity tool.
						</p>
					</div>
				</div>

				{/* CTA Section */}
				<div className="max-w-105 mx-auto">
					<button
						onClick={handleGoogleSignIn}
						disabled={isLoading}
						className="w-full py-4 px-6 rounded-xl text-[15px] font-medium transition-all duration-150 flex items-center justify-center gap-3 mb-6 group"
						style={{
							background: 'var(--surface-high)',
							color: 'var(--text-primary)',
							border: '1px solid var(--border)',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.6 : 1,
						}}
						onMouseEnter={(e) => {
							if (!isLoading) {
								e.currentTarget.style.borderColor = 'var(--accent)'
								e.currentTarget.style.background = 'var(--surface)'
							}
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.borderColor = 'var(--border)'
							e.currentTarget.style.background = 'var(--surface-high)'
						}}
					>
						{!isLoading && (
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M17.64 9.2C17.64 8.46 17.58 7.92 17.45 7.36H9V10.7H13.96C13.86 11.53 13.32 12.78 12.12 13.62L12.1 13.75L14.76 15.79L14.94 15.81C16.66 14.25 17.64 11.94 17.64 9.2Z" fill="#4285F4" />
								<path d="M9 18C11.43 18 13.47 17.2 14.94 15.81L12.12 13.62C11.38 14.15 10.38 14.52 9 14.52C6.62 14.52 4.61 12.96 3.9 10.82L3.78 10.83L1 12.98L0.96 13.09C2.42 15.98 5.48 18 9 18Z" fill="#34A853" />
								<path d="M3.9 10.82C3.71 10.27 3.6 9.68 3.6 9.08C3.6 8.48 3.71 7.89 3.89 7.34L3.89 7.2L1.08 5L0.96 5.06C0.35 6.28 0 7.63 0 9.08C0 10.53 0.35 11.88 0.96 13.1L3.9 10.82Z" fill="#FBBC05" />
								<path d="M9 3.64C10.74 3.64 11.93 4.38 12.61 5.01L15.14 2.57C13.46 1 11.42 0 9 0C5.48 0 2.42 2.02 0.96 5.06L3.89 7.34C4.61 5.2 6.62 3.64 9 3.64Z" fill="#EB4335" />
							</svg>
						)}
						<span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
					</button>

					{redirectTo && (
						<p
							className="text-center text-[13px] mb-6"
							style={{ color: 'var(--text-secondary)' }}
						>
							You'll be redirected after signing in
						</p>
					)}

					<p
						className="text-center text-[12px]"
						style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
					>
						Free. Private. No tracking.
					</p>
				</div>
			</div>
		</div>
	)
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<div
				className="min-h-screen flex items-center justify-center"
				style={{ background: 'var(--background)' }}
			>
				<Skeleton className="h-6 w-24" />
			</div>
		}>
			<LoginContent />
		</Suspense>
	)
}
