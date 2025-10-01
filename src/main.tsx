import React from "react";
import App from "./App.tsx";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { store } from "./store/index.ts";
import { detectPlatform } from "./utils/detectPlatform.ts";
import { setPlatform } from "./features/platform/store/platformSlice.ts";

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
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);