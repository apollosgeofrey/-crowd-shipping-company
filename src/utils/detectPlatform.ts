// src/utils/detectPlatform.ts
export type Platform = "admin" | "company" | "unknown";

function parseHostList(env?: string): Set<string> {
	return new Set(
		(env ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean)
	);
}

/**
* Detect platform using runtime hostname, falling back to VITE_DEFAULT_PLATFORM.
*/
export function detectPlatform(): Platform {
	const adminHosts = parseHostList(import.meta.env.VITE_ADMIN_HOSTNAMES);
	const companyHosts = parseHostList(import.meta.env.VITE_COMPANY_HOSTNAMES);
	const defaultPlatform = (import.meta.env.VITE_DEFAULT_PLATFORM ?? "company").toLowerCase();

	// browser runtime
	if (typeof window !== "undefined" && window.location && window.location.hostname) {
		const host = window.location.hostname.toLowerCase();
		const port = window.location.port; // useful if you need port-specific dev detection

		// explicit host matches first
		if (adminHosts.has(host)) return "admin";
		if (companyHosts.has(host)) return "company";

		// optional: handle dev ports for localhost (match your env)
		if (host === "localhost" && port === "5173") return "admin";
		if (host === "localhost" && port === "5174") return "company";

		// heuristics
		if (host.includes("admin")) return "admin";
		if (host.includes("app") || host.includes("company")) return "company";

		// fallback to default env
		if (defaultPlatform === "admin") return "admin";
		if (defaultPlatform === "company") return "company";
		return "unknown";
	}

	// non-browser (SSR/tests) use default
	if (defaultPlatform === "admin") return "admin";
	if (defaultPlatform === "company") return "company";
	return "unknown";
}
