<script lang="ts">
	import { page } from '$app/state';
	import type { IPouchTodo } from '$lib/api/api_pouch_db/PouchTodo';
	import TodoPouchDBStateSingleton from '$lib/state/pouchdb/TodoState.svelte';
	// import type ITodo from '#lib/interfaces/ITodo.ts';

	interface IProps {
		todo: IPouchTodo;
		closeModal: () => void;
	}
	// Defaults
	let { todo, closeModal,  }: IProps = $props();

	// Defaults
	let form: HTMLFormElement;
	let submitBtn: HTMLButtonElement;
	let PouchTodoAPI = TodoPouchDBStateSingleton.getSupportCenterLiveDataPouchDb().PouchTodoAPI;

	export function resetForm() {
		form.reset();
	}

	export function cleanUpForm() {}
</script>

<form
	bind:this={form}
	onsubmit={(event) => {
		PouchTodoAPI.update(event, todo);
		closeModal();
		form.reset();
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

	<button
		bind:this={submitBtn}
		class="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
        transition hover:bg-blue-700 active:scale-[0.98]"
	>
		Save
	</button>
</form>
