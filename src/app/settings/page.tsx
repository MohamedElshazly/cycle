'use client'

import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/context/ThemeContext'
import { LogOut, Moon, Sun } from 'lucide-react'
import AppShell from '@/layouts/AppShell'

export default function SettingsPage() {
	const { user, signOut } = useAuth()
	const { theme, toggleTheme } = useTheme()

	const handleSignOut = async () => {
		try {
			await signOut()
		} catch (error) {
			console.error('Sign out error:', error)
		}
	}

	return (
		<AppShell>
			<h1
				className="text-[28px] font-semibold mb-2"
				style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
			>
				Settings
			</h1>

			<div className="mt-12 flex flex-col gap-8">
				<div>
					<p
						className="text-[13px] font-medium uppercase mb-3"
						style={{ letterSpacing: '0.02em', color: 'var(--text-secondary)' }}
					>
						Appearance
					</p>
					<div
						className="p-6 rounded-xl flex items-center justify-between"
						style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
					>
						<span className="text-[15px]" style={{ color: 'var(--text-primary)' }}>
							{theme === 'dark' ? 'Dark mode' : 'Light mode'}
						</span>
						<button
							onClick={toggleTheme}
							aria-label="Toggle theme"
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-opacity duration-150 hover:opacity-70"
							style={{
								background: 'var(--surface-high)',
								color: 'var(--text-primary)',
								border: '1px solid var(--border)',
							}}
						>
							{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
							Switch to {theme === 'dark' ? 'light' : 'dark'}
						</button>
					</div>
				</div>

				<div>
					<p
						className="text-[13px] font-medium uppercase mb-3"
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
					className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-[15px] transition-all duration-150 hover:opacity-80 self-start"
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
		</AppShell>
	)
}
