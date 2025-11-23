// contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
	theme: Theme;
	actualTheme: 'light' | 'dark'; // The computed theme after system preference
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
	initializeTheme: (databaseTheme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		// Check localStorage first, then system preference
		const saved = localStorage.getItem('theme') as Theme;
		if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) return saved;

		return 'system'; // Default to system
	});

	// Compute actual theme (handles 'system' preference)
	const getActualTheme = (): 'light' | 'dark' => {
		if (theme === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		return theme as 'light' | 'dark';
	};

	const actualTheme = getActualTheme();

	useEffect(() => {
		// Apply theme class to document root
		const root = document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(actualTheme);

		// Save to localStorage
		localStorage.setItem('theme', theme);
	}, [theme, actualTheme]);

	// Listen for system theme changes when theme is 'system'
	useEffect(() => {
		if (theme !== 'system') return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			// Force re-render when system preference changes
			const root = document.documentElement;
			root.classList.remove('light', 'dark');
			root.classList.add(getActualTheme());
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme]);

	const toggleTheme = () => setTheme(prev => (prev === 'light') ? 'dark' : 'light');

	const setThemeDirect = (newTheme: Theme) => setTheme(newTheme);

	const initializeTheme = (databaseTheme: Theme) => {
		const saved = localStorage.getItem('theme');
		if (!saved) setTheme(databaseTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, actualTheme,toggleTheme, setTheme: setThemeDirect,initializeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
	return context;
};