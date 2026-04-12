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

export function TopNav() {
	const pathname = usePathname()
	const { theme, toggleTheme } = useTheme()

	return (
		<header
			className="hidden md:flex lg:hidden fixed top-0 left-0 right-0 z-50 h-16"
			style={{
				backgroundColor: 'rgba(12, 14, 20, 0.72)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
				borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
			}}
		>
			<div className="flex items-center justify-between w-full max-w-180 mx-auto px-12">
				<span
					className="text-base font-bold tracking-[-0.02em]"
					style={{ color: 'var(--accent)' }}
				>
					Cycle
				</span>

				<nav className="flex items-center" style={{ gap: '32px' }}>
					{NAV_ITEMS.map(({ label, href }) => {
						const isActive = pathname === href

						return (
							<Link
								key={href}
								href={href}
								className="relative flex flex-col items-center transition-colors duration-200 ease-out"
								style={{
									fontSize: '13px',
									fontWeight: isActive ? 600 : 400,
									textTransform: 'uppercase',
									letterSpacing: '0.02em',
									color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
									textDecoration: 'none',
								}}
							>
								{label}
								{isActive && (
									<span
										className="absolute -bottom-[22px] left-0 right-0 h-[2px]"
										style={{ backgroundColor: 'var(--accent)' }}
									/>
								)}
							</Link>
						)
					})}
				</nav>

				<div className="flex items-center gap-1">
					<button
						onClick={toggleTheme}
						aria-label="Toggle theme"
						className="flex items-center justify-center w-8 h-8 rounded-lg transition-opacity duration-150 hover:opacity-70"
						style={{ color: 'var(--text-secondary)' }}
					>
						{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
					</button>
					<Link
						href="/settings"
						aria-label="Settings"
						className="flex items-center justify-center w-8 h-8 rounded-lg transition-opacity duration-150 hover:opacity-70"
						style={{ color: pathname === '/settings' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
					>
						<Settings size={15} />
					</Link>
				</div>
			</div>
		</header>
	)
}
