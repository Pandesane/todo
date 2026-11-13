import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
	plugins: [
		commonjs(),
		tailwindcss(),
		sveltekit()
	],

	define: {
		// Maps Node's global object to window for browser compatibility
		global: 'window',
	},

	optimizeDeps: {
		include: [
			'pouchdb-browser',
			'spark-md5',
			'pouchdb-utils'
		],
		force: true,
		esbuildOptions: {
			define: {
				global: 'window',
			},
		},
	},

	build: {
		commonjsOptions: {
			include: [
				/node_modules/
			],
			transformMixedEsModules: true,
			defaultIsModuleExports: true
		}
	},

	server: {
		headers: {
			'Cache-Control': 'no-store'
		}
	}
});