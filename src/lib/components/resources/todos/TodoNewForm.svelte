<script lang="ts">
	import { PouchTodoAPISingleton } from '$lib/api/api_pouch_db/PouchTodo.js';
	import { browser } from '$app/environment';
	import TodoPouchDBStateSingleton from '$lib/state/pouchdb/TodoState.svelte';

	interface IProps {
		closeModal: () => void;
	}

	let { closeModal }: IProps = $props();

	// Defaults
	let formStatus = $state('Enabled after file is uploaded to server');
	let form: HTMLFormElement;
	let submitBtn: HTMLButtonElement;

	let PouchTodoAPI = TodoPouchDBStateSingleton.getSupportCenterLiveDataPouchDb().PouchTodoAPI;

	export function resetForm() {
		form.reset();
	}
</script>

<form
	bind:this={form}
	onsubmit={(event) => {
		PouchTodoAPI.create(event);
		closeModal();
		form.reset();
	}}
	class="mx-4 mt-8 flex flex-col gap-y-4"
	enctype="multipart/form-data"
>
	<p class="text-center">Create New todo</p>

	<div class="flex flex-col gap-1.5">
		<label for="title" class="text-xs font-medium text-slate-600"> title </label>

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
		<label for="description" class="text-xs font-medium text-slate-600">description</label>

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
