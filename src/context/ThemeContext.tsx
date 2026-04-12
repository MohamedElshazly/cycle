'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextValue = {
	theme: Theme
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: 'dark',
	toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === 'undefined') return 'dark'
		return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
	})

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'dark') {
			root.classList.add('dark')
			root.style.colorScheme = 'dark'
		} else {
			root.classList.remove('dark')
			root.style.colorScheme = 'light'
		}
		localStorage.setItem('theme', theme)
	}, [theme])

	const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	return useContext(ThemeContext)
}
