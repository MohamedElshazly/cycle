'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
	label: string
	href: string
}

const NAV_ITEMS: NavItem[] = [
	{ label: 'Dashboard', href: '/dashboard' },
	{ label: 'Patterns', href: '/patterns' },
	{ label: 'Reflections', href: '/reflections' },
	{ label: 'Settings', href: '/settings' },
]

export function TopNav() {
	const pathname = usePathname()

	return (
		<header
			className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16"
			style={{ backgroundColor: 'var(--surface)', backdropFilter: 'blur(12px)' }}
		>
			<div className="flex items-center justify-between w-full max-w-180 mx-auto px-12">
				<span
					className="text-base font-semibold"
					style={{ color: 'var(--text-primary)' }}
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
								className="relative flex flex-col items-center transition-colors duration-150 ease-out"
								style={{
									fontSize: '13px',
									fontWeight: 500,
									textTransform: 'uppercase',
									letterSpacing: '0.02em',
									color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
									textDecoration: 'none',
								}}
							>
								{label}
								{isActive && (
									<span
										className="absolute -bottom-5.5 left-0 right-0 h-0.5"
										style={{ backgroundColor: 'var(--accent)' }}
									/>
								)}
							</Link>
						)
					})}
				</nav>
			</div>
		</header>
	)
}
