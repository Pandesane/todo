<script lang="ts">
	import type { PouchAttachment } from '$lib/utilities/pouchdb/PouchAttachment.svelte';
	import { onMount } from 'svelte';

	interface IProps {
		audioAttachment: PouchAttachment;
		removeAttachment: (uuid: string) => void;
	}
	let { audioAttachment, removeAttachment }: IProps = $props();
	// Assuming you already have your 'audioBlob'
	// 1. Create a temporary URL pointing to the blob object

	const blobUrl = $derived(URL.createObjectURL(audioAttachment.blob!));
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
		{audioAttachment.uuid}
	</p>

	<p>
		{audioAttachment.mime_type}
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
			removeAttachment(audioAttachment.uuid);
		}}>Delete</button
	>
</div>
