<script lang="ts">
	import TodoAudioRecorder from '#lib/components/TodoAudioRecorder.svelte';
	import TodoAudioAttachmentPreview from '#lib/components/TodoAudioAttachmentPreview.svelte';
	import { PouchDBAttachments } from '#lib/utilities/pouchdb/PouchAttachment.svelte.ts';
	import TodoPouchDBStateSingleton from '#lib/state/pouchdb/TodoState.svelte.ts';

	interface IProps {
		closeModal: () => void;
	}

	let { closeModal }: IProps = $props();

	// Defaults
	let form: HTMLFormElement;

	let PouchTodoAPI = TodoPouchDBStateSingleton.getSupportCenterLiveDataPouchDb().PouchTodoAPI;
	let todoAttachments = new PouchDBAttachments();

	export function resetForm() {
		form.reset();
		todoAttachments.reset();
	}
</script>

<form
	bind:this={form}
	onsubmit={async (event) => {
		await PouchTodoAPI.create(event, todoAttachments.attachments);
		closeModal();
		form.reset();
		todoAttachments.reset();
	}}
	class="mx-4 mt-8 flex flex-col gap-y-4"
	enctype="multipart/form-data"
>
	<p class="text-center">Create New todo</p>

	<div class="flex flex-col gap-1.5">
		<label for="title" class="text-xs font-medium text-slate-600"> Title </label>

		<input
			id="title"
			name="title"
			type="text"
			class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
            transition outline-none
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
		/>
	</div>

	<div class="flex flex-col gap-1.5">
		<label for="start_time" class="text-xs font-medium text-slate-600"> Start Time </label>

		<input
			id="start_time"
			type="time"
			name="start_time"
			class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
            transition outline-none
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
		/>
	</div>

  <div class="flex flex-col gap-1.5">
		<label for="end_time" class="text-xs font-medium text-slate-600"> Start Time </label>

		<input
			id="end_time"
			type="time"
			name="end_time"
			class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
            transition outline-none
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
		/>
	</div>

	<div class="flex flex-col gap-1.5">
		<label for="description" class="text-xs font-medium text-slate-600">Description</label>

		<textarea
			id="description"
			name="description"
			class="h-28 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
            transition outline-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
			placeholder="Placeholder..."
		></textarea>
	</div>

	<input name="collection" type="hidden" value="todos" />

	<!--Audio Attachments -->
	<p>Audio Attachments</p>
	<TodoAudioRecorder
		uploadAudioRecording={(blob) => {
			console.log(blob);
			todoAttachments.addBlobAttachment(blob);
		}}
	/>
	<div class="flex flex-col gap-y-2">
		{#each todoAttachments.attachments as audioAttachment}
			<TodoAudioAttachmentPreview
				{audioAttachment}
				removeAttachment={(uuid) => {
					todoAttachments.removeAttachment(uuid);
				}}
			/>
		{/each}
	</div>

	<button
		type="submit"
		class="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
        transition-all duration-200
        hover:bg-blue-700 hover:shadow-sm
        active:scale-[0.98]
        disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
	>
		Create
	</button>
</form>
