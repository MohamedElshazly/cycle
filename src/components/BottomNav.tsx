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

export function BottomNav() {
	const pathname = usePathname()

	return (
		<nav
			className="fixed bottom-0 left-0 w-full z-50 md:hidden"
			style={{
				backgroundColor: 'rgba(22, 27, 39, 0.6)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
			}}
		>
			<ul className="flex justify-around items-center w-full h-14">
				{NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href

					return (
						<li key={item.href} className="flex-1">
							<Link
								href={item.href}
								className="flex flex-col items-center justify-center h-14 transition-colors duration-150 ease-in-out"
								style={{
									color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
								}}
							>
								<span
									className="text-[13px] font-medium uppercase tracking-[0.02em] leading-none"
								>
									{item.label}
								</span>
								{isActive && (
									<span className="w-1 h-1 rounded-full mx-auto mt-1 bg-accent" />
								)}
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
