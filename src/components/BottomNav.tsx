'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Waves, PenLine, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

type NavItem = {
	label: string
	href: string
	icon: React.ComponentType<{ size?: number }>
}

const NAV_ITEMS: NavItem[] = [
	{ label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
	{ label: 'Patterns', href: '/patterns', icon: Waves },
	{ label: 'Reflections', href: '/reflections', icon: PenLine },
]

export function BottomNav() {
	const pathname = usePathname()
	const { theme, toggleTheme } = useTheme()

	return (
		<nav
			className="fixed bottom-0 left-0 w-full z-50 md:hidden rounded-t-2xl overflow-hidden"
			style={{
				backgroundColor: 'var(--nav-glass)',
				backdropFilter: 'blur(24px)',
				WebkitBackdropFilter: 'blur(24px)',
				boxShadow: '0 -20px 40px rgba(0,0,0,0.4), 0 -1px 0 rgba(255,255,255,0.04)',
			}}
		>
			<ul className="flex items-center w-full h-[72px] px-2">
				{NAV_ITEMS.map(({ label, href, icon: Icon }) => {
					const isActive = pathname === href

					return (
						<li key={href} className="flex-1">
							<Link
								href={href}
								className="flex flex-col items-center justify-center h-full gap-1.5 transition-all duration-200"
								style={{
									color: isActive ? 'var(--accent)' : 'rgba(165, 170, 192, 0.6)',
									transform: isActive ? 'scale(1.05)' : 'scale(1)',
								}}
							>
								<Icon size={22} />
								<span className="text-[11px] font-medium uppercase tracking-wide leading-none">
									{label}
								</span>
							</Link>
						</li>
					)
				})}

				<li className="flex-none px-3">
					<button
						onClick={toggleTheme}
						aria-label="Toggle theme"
						className="flex flex-col items-center justify-center h-full w-10 transition-all duration-200"
						style={{ color: 'rgba(165, 170, 192, 0.5)' }}
					>
						{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
					</button>
				</li>
			</ul>
		</nav>
	)
}
