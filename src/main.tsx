import React from "react";
import App from "./App.tsx";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { store } from "./store/index.ts";
import { detectPlatform } from "./utils/detectPlatform.ts";
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { setPlatform } from "./features/platform/store/platformSlice.ts";
import { systemPreferencesApi } from "./features/system_settings/services/systemPreferencesApi.ts";


// ThemeInitializer component to fetch and set theme from database
function ThemeInitializer() {
	const { initializeTheme } = useTheme();

	React.useEffect(() => {
		const fetchUserTheme = async () => {
			try {
				const response = await systemPreferencesApi.getPreferences();
				if (response.code === 200 && response.data.theme) {
					// Initialize theme from database only if no localStorage preference exists
					initializeTheme(response.data.theme);
				}
			} catch (error) {
				console.error('Failed to fetch user theme preference:', error);
				// If database fails, theme will fall back to localStorage → system preference
			}
		};

		fetchUserTheme();
	}, [initializeTheme]);

	return null; // This component doesn't render anything
}

// Optionally read server-injected global first
const injected = (window as any).__PLATFORM__ as "admin" | "company" | undefined;

// choose platform: prefer injected value, otherwise detect
const platform = injected ?? detectPlatform();

// Only dispatch if it differs from current store value (avoids unnecessary update)
const current = store.getState().platform?.platform;
if (current !== platform) {
	store.dispatch(setPlatform(platform as any));
}

// render UI
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider>
			<Provider store={store}>
				<ThemeInitializer />
				<App />
			</Provider>
		</ThemeProvider>
	</React.StrictMode>
);