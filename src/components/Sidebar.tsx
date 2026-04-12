'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun, Settings } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

type NavItem = {
	label: string
	href: string
}

const NAV_ITEMS: NavItem[] = [
	{ label: 'Dashboard', href: '/dashboard' },
	{ label: 'Patterns', href: '/patterns' },
	{ label: 'Reflections', href: '/reflections' },
]

export function Sidebar() {
	const pathname = usePathname()
	const { theme, toggleTheme } = useTheme()

	return (
		<aside
			className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[220px] z-50 flex-col"
			style={{ backgroundColor: 'var(--surface)' }}
		>
			{/* App name */}
			<div className="px-6 py-8">
				<span
					className="text-base font-bold tracking-[-0.02em]"
					style={{ color: 'var(--accent)' }}
				>
					Cycle
				</span>
			</div>

			{/* Nav links */}
			<nav className="flex-1 px-6">
				{NAV_ITEMS.map(({ label, href }) => {
					const isActive = pathname === href

					return (
						<Link
							key={href}
							href={href}
							className="relative flex items-center py-3 transition-colors duration-150"
							style={{
								fontSize: '15px',
								fontWeight: isActive ? 600 : 400,
								color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
								textDecoration: 'none',
							}}
						>
							{isActive && (
								<span
									className="absolute left-[-24px] top-0 bottom-0 w-[2px]"
									style={{ backgroundColor: 'var(--accent)' }}
								/>
							)}
							{label}
						</Link>
					)
				})}
			</nav>

			{/* Bottom section: Settings + Theme toggle */}
			<div className="px-6 pb-8">
				<Link
					href="/settings"
					className="flex items-center gap-3 py-3 transition-colors duration-150"
					style={{
						fontSize: '15px',
						fontWeight: pathname === '/settings' ? 600 : 400,
						color: pathname === '/settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
						textDecoration: 'none',
					}}
				>
					<Settings size={16} />
					Settings
				</Link>
				<button
					onClick={toggleTheme}
					aria-label="Toggle theme"
					className="flex items-center gap-3 py-3 w-full transition-opacity duration-150 hover:opacity-70"
					style={{
						fontSize: '15px',
						color: 'var(--text-secondary)',
					}}
				>
					{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
					{theme === 'dark' ? 'Light mode' : 'Dark mode'}
				</button>
			</div>
		</aside>
	)
}
