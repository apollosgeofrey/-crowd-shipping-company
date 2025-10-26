// servicess/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

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