<script lang="ts">
	import type { IPouchDBAttachment } from '$lib/api/api_pouch_db/PouchTodo';
	import { onMount } from 'svelte';
	import { base64ToBlob } from 'blob-utils';

	interface IProps {
		audioAttachment: IPouchDBAttachment;
		removeAttachment: () => void;
	}
	let { audioAttachment, removeAttachment }: IProps = $props();
	// Assuming you already have your 'audioBlob'
	// 1. Create a temporary URL pointing to the blob object

	const blobUrl = $derived.by(() => {
		let blob = base64ToBlob(audioAttachment.data);
		return URL.createObjectURL(blob);
	});
	const audio = $derived(new Audio(blobUrl));

	// 2. Create a new Audio instance using that URL

	// 3. Play the audio
	// audio
	// 	.play()
	// 	.then(() => {
	// 		console.log('Audio is playing!');
	// 	})
	// 	.catch((error) => {
	// 		console.error('Playback failed:', error);
	// 	});

	onMount(() => {
		return () => {
			URL.revokeObjectURL(blobUrl);
		};
	});
</script>

<div>
	<p>
		{audioAttachment.content_type}
	</p>
	<button
		type="button"
		class="btn btn-primary"
		onclick={() => {
			if (audio.paused) {
				audio.play();
			} else {
				audio.pause();
			}
		}}>Play</button
	>

	<button
		type="button"
		class="btn btn-error"
		onclick={() => {
			removeAttachment();
		}}>Delete</button
	>
</div>
