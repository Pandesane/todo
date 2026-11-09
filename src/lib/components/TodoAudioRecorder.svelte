<script lang="ts">
	import { browser } from '$app/environment';
	import TodoAudioRecorderMediaCapture from '$lib/state/TodoAudioRecorderMediaCapture.svelte';
	import { Time } from '$lib/utilities/Time';
	import { onMount } from 'svelte';
	import RoomSelect from './RoomSelect.svelte';

	interface IProps {
		uploadAudioRecording: (blob: Blob) => void;
	}
	let { uploadAudioRecording }: IProps = $props();

	let audioElement: HTMLAudioElement;
	let mediaCaptureMediaElement: HTMLMediaElement;
	let selectedAudioDevice: string = $state('undefined');
	let currentTime = $state(0);

	let mediaCapture: TodoAudioRecorderMediaCapture | undefined = $state();

	// Create an media recorder object
	// Provide preview of recorded audio content
	// Send the file to the server & Save file to the server using uuid
	// Provide a save feature or cancel

	onMount(() => {
		if (browser) {
			mediaCapture = new TodoAudioRecorderMediaCapture(mediaCaptureMediaElement!);
		}
	});

	export function cleanUpResources() {
		mediaCapture?.stopRecording();
	}
</script>

<div class=" flex gap-x-2 items-center">
	<!-- DEVICE SELECT -->
	<!-- <RoomSelect
		title="Microphones"
		icon={'icon-[hugeicons--mic-02]'}
		type={'audioinput'}
		bind:activeDevice={() => mediaCapture?.getActiveAudioDevice()!, (value) => value}
		devices={mediaCapture?.audioDevices!}
		onSelect={(deviceId) => {
			console.log('Audio Device ID: ', deviceId);
			mediaCapture?.switchMediaDevice('audio', deviceId);
		}}
	/> -->

	<!-- CONTROLS -->
	{#if mediaCapture}
		<div
			class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
		>
			<!-- TIMER -->
			<div class="text-xs font-medium text-blue-600">
				{Time.formatTime(currentTime)}
			</div>

			<!-- ACTIONS -->
			<div class="flex items-center gap-4">
				<!-- PLAY/PAUSE -->
				<button
					type="button"
					disabled={!mediaCapture?.recordingEnded}
					onclick={async () => {
						let url = await mediaCapture!.getBlobDataUrl();
						audioElement.src = url;

						if (mediaCapture?.testRecordedStream) {
							audioElement.pause();
						} else {
							audioElement.play();
						}
						mediaCapture!.testRecordedStream = !mediaCapture?.testRecordedStream;
					}}
					class="rounded-lg p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40"
				>
					{#if !mediaCapture?.testRecordedStream}
						<span class="icon-[hugeicons--play] size-5"></span>
					{:else}
						<span class="icon-[hugeicons--pause] size-5"></span>
					{/if}
				</button>

				<!-- RECORD -->
				<button
					type="button"
					disabled={mediaCapture.recordingEnded}
					onclick={async () => {
						mediaCapture?.toggleRecording();
					}}
					class="group flex h-14 w-14 items-center justify-center rounded-full
						   border border-red-200 bg-white shadow-sm transition
						   hover:border-red-300 disabled:opacity-40"
				>
					{#if mediaCapture.startedRecording}
						<span class="icon-[ic--round-stop] size-8 text-red-500"></span>
					{:else}
						<div class="h-4 w-4 rounded-full bg-red-500 transition group-hover:scale-110"></div>
					{/if}
				</button>

				<!-- RESTART -->
				<button
					aria-label="Restart Recording"
					type="button"
					onclick={async () => {
						mediaCapture?.restartRecording(selectedAudioDevice, () => {
							audioElement.pause();
							mediaCaptureMediaElement.srcObject = null;
						});
					}}
					class="rounded-lg p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
				>
					<span class="icon-[hugeicons--redo] size-5"></span>
				</button>
				{#if mediaCapture?.recordingEnded}
					<button
						aria-label="Upload Recorded Audio"
						type="button"
						onclick={() => {
							console.log('Accepted audio');
							// finishedRecordingAndUploaded();
							let blob = mediaCapture?.getBlob();
							if (blob) uploadAudioRecording(blob);
							mediaCapture?.restartRecording(selectedAudioDevice, () => {
								audioElement.pause();
								mediaCaptureMediaElement.srcObject = null;
							});
						}}
						class="rounded-xl bg-blue-600 p-1 text-white transition hover:bg-blue-700"
					>
						<span class="icon-[hugeicons--upload-02] size-5"></span>
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
<audio bind:currentTime bind:this={mediaCaptureMediaElement} muted autoplay> </audio>
<audio
	bind:this={audioElement}
	onended={() => {
		console.log('Stopped Playing the audio');
		mediaCapture!.testRecordedStream = !mediaCapture?.testRecordedStream;
	}}
>
</audio>
