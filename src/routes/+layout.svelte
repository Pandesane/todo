<script lang="ts">
	/// <reference types="vite-plugin-pwa/svelte" />
	/// <reference types="vite-plugin-pwa/info" />
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	let needRefresh = $state(false);
	let offlineReady = $state(false);

	let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | undefined;

	onMount(async () => {
		console.log('Starting App onMount....');

		console.log('PWA Information:', pwaInfo);
		console.log('Development mode:', import.meta.env.DEV);
		console.log('Production mode:', import.meta.env.PROD);
		console.log('Service Worker supported:', 'serviceWorker' in navigator);

		if (!pwaInfo) return;

		const { registerSW } = await import('virtual:pwa-register');

		console.log('Running PWA init App onMount....', registerSW);
		updateServiceWorker = registerSW({
			immediate: true,

			onOfflineReady() {
				offlineReady = true;
				console.log('Application ready for offline use');
			},

			onNeedRefresh() {
				needRefresh = true;
				console.log('New application version available');
			},

			onRegisteredSW(swUrl, registration) {
				console.log('Service worker registered:', swUrl);
				console.log('Registration:', registration);
			},

			onRegisterError(error) {
				console.error('Service worker registration failed:', error);
			}
		});
		console.log('Service worker registration initialized');
		console.log('Update function:', updateServiceWorker);
	});
	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{@html pwaInfo ? pwaInfo.webManifest.linkTag : ''}
</svelte:head>
<div class="relative">
	{@render children()}
</div>

{#if offlineReady}
	<div class="pwa-notification">
		Application is ready to work offline.
		<button onclick={() => (offlineReady = false)}> Close </button>
	</div>
{/if}

{#if needRefresh}
	<div class="pwa-notification">
		A new version is available.

		<button onclick={() => updateServiceWorker?.(true)}> Reload application </button>

		<button onclick={() => (needRefresh = false)}> Later </button>
	</div>
{/if}

<style>
	.pwa-notification {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 9999;
		background: white;
		color: #222;
		padding: 16px;
		border-radius: 8px;
		box-shadow: 0 2px 12px #0002;
	}

	.pwa-notification button {
		margin-left: 8px;
		padding: 6px 12px;
	}
</style>
