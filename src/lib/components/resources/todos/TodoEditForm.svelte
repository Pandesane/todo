<script lang="ts">
	import type { IPouchTodo } from '$lib/api/api_pouch_db/PouchTodo';
	import TodoAudioAttachmentPreview from '$lib/components/TodoAudioAttachmentPreview.svelte';
	import TodoAudioRecorder from '$lib/components/TodoAudioRecorder.svelte';
	import TodoPouchDBStateSingleton from '$lib/state/pouchdb/TodoState.svelte';
	import { PouchDBAttachments } from '$lib/utilities/pouchdb/PouchAttachment.svelte';
	// import type ITodo from '#lib/interfaces/ITodo.ts';

	interface IProps {
		todo: IPouchTodo;
		closeModal: () => void;
	}
	// Defaults
	let { todo, closeModal }: IProps = $props();

	// Defaults
	let form: HTMLFormElement;
	let submitBtn: HTMLButtonElement;
	let PouchTodoAPI = TodoPouchDBStateSingleton.getSupportCenterLiveDataPouchDb().PouchTodoAPI;
	let todoAttachments = new PouchDBAttachments();

	export function resetForm() {
		form.reset();
	}

	export function cleanUpForm() {}
</script>

<form
	bind:this={form}
	onsubmit={async (event) => {
		await PouchTodoAPI.update(event, todo, todoAttachments.attachments);
		closeModal();
		form.reset();
		todoAttachments.reset();
	}}
	class="mx-auto my-6 flex w-full max-w-200 flex-col gap-5"
>
	<p class="text-center">Edit todo</p>

	<!-- HIDDEN -->
	<input type="hidden" name="_id" value={todo._id} />
	<input type="hidden" name="_rev" value={todo._rev} />

	<div class="flex flex-col gap-1.5">
		<label for="title" class="text-xs font-medium text-slate-600">title</label>

		<input
			type="text"
			id="title"
			name="title"
			value={todo.title}
			class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
              transition outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
		/>
	</div>

	<div class="flex flex-col gap-1.5">
		<label for="start_time" class="text-xs font-medium text-slate-600"> Start Time </label>

		<input
			id="start_time"
			type="time"
			name="start_time"
			value={todo.start_time ?? null}
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
		<label for="description" class="text-xs font-medium text-slate-600">description</label>

		<textarea
			name="description"
			id="description"
			class="h-28 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
              transition outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{todo.description}</textarea
		>
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
		bind:this={submitBtn}
		class="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
        transition hover:bg-blue-700 active:scale-[0.98]"
	>
		Save
	</button>
</form>
