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
			className="min-h-screen flex items-center justify-center px-6"
			style={{ background: 'var(--background)' }}
		>
			<div className="w-full max-w-md">
				<div className="text-center mb-12">
					<h1
						className="text-[28px] font-semibold tracking-[-0.02em] mb-3"
						style={{ color: 'var(--text-primary)' }}
					>
						Cycle
					</h1>
					<p
						className="text-[15px] leading-relaxed"
						style={{ color: 'var(--text-secondary)' }}
					>
						Understand why habits break, not just track whether they happen.
					</p>
				</div>

				<button
					onClick={handleGoogleSignIn}
					disabled={isLoading}
					className="w-full py-4 px-6 rounded-xl text-[15px] font-medium transition-all duration-150 hover:opacity-80"
					style={{
						background: 'var(--surface)',
						color: 'var(--text-primary)',
						border: '1px solid var(--border)',
					}}
				>
					{isLoading ? 'Signing in...' : 'Continue with Google'}
				</button>

				{redirectTo && (
					<p
						className="text-center text-[13px] mt-4"
						style={{ color: 'var(--text-secondary)' }}
					>
						You'll be redirected after signing in
					</p>
				)}

				<p
					className="text-center text-[13px] mt-8"
					style={{ color: 'var(--text-secondary)' }}
				>
					Private, honest, intimate. Think 2am, not productivity tool.
				</p>
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
