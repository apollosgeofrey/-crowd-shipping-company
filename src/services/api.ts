// servicess/api.ts
import axios from 'axios';

// Read environment variables
const appMode = import.meta.env.VITE_API_APP_MODE; // "development" or "production"
const defaultBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
const devBaseUrl = import.meta.env.VITE_API_DEVELOPMENT_BASE_URL || 'http://localhost:5008/api';
const prodBaseUrl = import.meta.env.VITE_API_PRODUCTION_BASE_URL || 'https://crowdshipping-ruby.vercel.app/api/v1' || 'https://api.crowdshipping.com/api';

// Determine the base URL based on the app mode (development or production)
let API_BASE_URL = defaultBaseUrl;
if (appMode === 'development') {
  API_BASE_URL = devBaseUrl;
} else if (appMode === 'production') {
  API_BASE_URL = prodBaseUrl;
} else {
  console.warn('Unknown app mode. Falling back to default base URL.');
}

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken');
	const apiKey = import.meta.env.VITE_API_KEY || 'TTPK_26369a22-f01f-4dcd-b494-3ac058f9ed19';

	if (token) config.headers.Authorization = `Bearer ${token}`;

	// Add API key to all requests
	config.headers['x-api-key'] = apiKey;

	return config;
});

// Handle token expiration and responses
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Token expired or invalid
		if (error.response?.status === 401 && !error.config.url.includes('/sign-in')) {
			localStorage.removeItem('authToken');
			localStorage.removeItem('user');
			window.location.href = '/login';
		}

		// Handle other common errors
		if (error.response?.status === 403) console.error('Access forbidden');
		return Promise.reject(error);
	}
);

export default api;
