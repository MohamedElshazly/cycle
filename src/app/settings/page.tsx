'use client'

import { useAuth } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'

export default function SettingsPage() {
	const { user, signOut } = useAuth()

	const handleSignOut = async () => {
		try {
			await signOut()
		} catch (error) {
			console.error('Sign out error:', error)
		}
	}

	return (
		<div
			className="min-h-screen px-6 md:px-12 py-12"
			style={{ background: 'var(--background)' }}
		>
			<div className="max-w-180 mx-auto">
				<h1
					className="text-[28px] font-semibold mb-2"
					style={{
						letterSpacing: '-0.02em',
						color: 'var(--text-primary)',
					}}
				>
					Settings
				</h1>

				<div className="mt-12">
					<div className="mb-8">
						<p
							className="text-[13px] font-medium uppercase mb-2"
							style={{ letterSpacing: '0.02em', color: 'var(--text-secondary)' }}
						>
							Account
						</p>
						<div
							className="p-6 rounded-xl"
							style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
						>
							{user?.email && (
								<p className="text-[15px]" style={{ color: 'var(--text-primary)' }}>
									{user.email}
								</p>
							)}
						</div>
					</div>

					<button
						onClick={handleSignOut}
						className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-[15px] transition-all duration-150 hover:opacity-80"
						style={{
							background: 'var(--surface)',
							color: 'var(--text-primary)',
							border: '1px solid var(--border)',
						}}
					>
						<LogOut size={16} />
						Sign Out
					</button>
				</div>
			</div>
		</div>
	)
}
