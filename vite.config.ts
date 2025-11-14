// vite.config.ts
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Convert ESM URL to dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	resolve: {
		alias: {
		  	'@': path.resolve(__dirname, './src'),
		  	'@hooks': path.resolve(__dirname, './src/hooks'),
		  	'@services': path.resolve(__dirname, './src/services'),
		},
	},
	plugins: [react()],
});