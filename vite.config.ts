
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import { withPwa } from '@vite-pwa/sveltekit';
import path from 'node:path';

export default defineConfig({
	//  resolve: {
  //   alias: {
  //     '@local-notifications': path.resolve(
  //       __dirname,
  //       '../capacitor_plugins/local_notifications/dist/esm'
  //     )
  //   }
  // },
	plugins: [
		commonjs(),
		tailwindcss(),

		withPwa(
			undefined,
			{
				// strategy: 'buildSW',


				registerType: 'prompt',

				devOptions: {
					enabled: true
				},

				manifest: {
					name: 'My SvelteKit Application',
					short_name: 'MyApp',
					description: 'My offline-capable application',
					theme_color: '#4338ca',
					background_color: '#ffffff',
					display: 'standalone',
					orientation: 'portrait',
					start_url: '/',
					scope: '/',

					icons: [
						{
							src: '/icons/icon-192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: '/icons/icon-512.png',
							sizes: '512x512',
							type: 'image/png'
						}
					]
				},


				workbox: {
					// Files to download and cache during service-worker installation.
					// These paths are relative to .svelte-kit/output.
					globPatterns: [
						'client/**/*.{js,css,ico,png,jpg,jpeg,svg,webp,avif,webmanifest,woff,woff2,ttf,otf,eot,json}',
						'prerendered/**/*.{html,json}'
					],

					cleanupOutdatedCaches: true,
					clientsClaim: true,
					skipWaiting: false,

					// Allow files up to 5 MB in the precache.
					// maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

					runtimeCaching: [

						// 1. Application pages.
						// Network first, then use the cached page when offline.
						{
							urlPattern: ({ request, url }) =>
								request.mode === 'navigate' &&
								url.origin === self.location.origin,

							handler: 'NetworkFirst',

							options: {
								cacheName: 'pages-cache',

								networkTimeoutSeconds: 3,

								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 7 * 24 * 60 * 60
								},

								cacheableResponse: {
									statuses: [200]
								}
							}
						},

						// 2. Images.
						// Load from cache first; download when not cached.
						{
							urlPattern: ({ request }) =>
								request.destination === 'image',

							handler: 'CacheFirst',

							options: {
								cacheName: 'images-cache',

								expiration: {
									maxEntries: 150,
									maxAgeSeconds: 30 * 24 * 60 * 60
								},

								cacheableResponse: {
									statuses: [0, 200]
								}
							}
						},

						// 3. Fonts.
						{
							urlPattern: ({ request }) =>
								request.destination === 'font',

							handler: 'CacheFirst',

							options: {
								cacheName: 'fonts-cache',

								expiration: {
									maxEntries: 30,
									maxAgeSeconds: 365 * 24 * 60 * 60
								},

								cacheableResponse: {
									statuses: [0, 200]
								}
							}
						},

						// 4. Documents and downloadable files.
						{
							urlPattern: ({ url }) =>
								url.origin === self.location.origin &&
								/\.(pdf|doc|docx|xls|xlsx|csv|txt)$/i.test(url.pathname),

							handler: 'CacheFirst',

							options: {
								cacheName: 'documents-cache',

								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 30 * 24 * 60 * 60
								},

								cacheableResponse: {
									statuses: [200]
								}
							}
						},

						// 5. Public, read-only API GET requests.
						// Network first, then use cached data when offline.
						{
							urlPattern: ({ url, request }) =>
								request.method === 'GET' ,

							handler: 'CacheFirst',

							options: {
								cacheName: 'public-api-cache',

								networkTimeoutSeconds: 3,

								expiration: {
									maxEntries: 100,
									maxAgeSeconds: 24 * 60 * 60
								},

								cacheableResponse: {
									statuses: [200]
								},
								// precacheFallback: {
								// 	fallbackURL: "/index.html"
								// }
							}
						}

					]
				}

			}
		)
	],

	define: {
		global: 'window'
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
				global: 'window'
			}
		}
	},

	build: {
		commonjsOptions: {
			include: [/node_modules/],
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
