<script lang="ts">
	import { PouchTodoAPISingleton } from '$lib/api/api_pouch_db/PouchTodo.js';
	import TodoPouchDBStateSingleton from '$lib/state/pouchdb/TodoState.svelte';
	import TodoComponent from './TodoComponent.svelte';
	import TodoNewForm from './TodoNewForm.svelte';
	let dialogElementAdd: HTMLDialogElement;

	let todoNewForm: TodoNewForm;

	let todoPouchDBState = TodoPouchDBStateSingleton.getSupportCenterLiveDataPouchDb();
</script>

<div class="mx-2 mt-16">
	<!-- <div class="mb-5 flex items-start justify-between border-b border-slate-100 pb-3">
		<div class="flex flex-col gap-1">
			<p class="text-sm font-semibold tracking-tight text-slate-900">Todos</p>

			<p class="text-xs leading-snug text-slate-400">Support text here</p>
		</div>

		<button
			onclick={() => {
				dialogElementAdd.showModal();
				todoNewForm.resetForm();
			}}
			class="flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
		>
			<span class="icon-[hugeicons--add-01] size-4"></span>
			Add
		</button>
	</div> -->

	<div class="mt-4 w-full">
		{#each todoPouchDBState.todos as todo}
			<TodoComponent {todo} />
		{/each}
	</div>
</div>

<div class="fixed rounded-full bg-red-200 w-20 h-20 bottom-2 right-2">
	<button
		aria-label="Add Todo"
		onclick={() => {
			dialogElementAdd.showModal();
			todoNewForm.resetForm();
		}}
		class="flex items-center justify-center w-full h-full"
	>
		<span class="icon-[hugeicons--add-01] size-6"></span>
	</button>
</div>

<!-- Add New  Todo -->
<dialog bind:this={dialogElementAdd} class="modal">
	<div class="modal-box max-h-[80vh]">
		<TodoNewForm
			bind:this={todoNewForm}
			closeModal={() => {
				dialogElementAdd.close();
			}}
		/>

		<div class="modal-action">
			<button
				onclick={() => {
					dialogElementAdd.close();
					todoNewForm.resetForm();
				}}
				class="btn btn-primary my-4">Close</button
			>
		</div>
	</div>
</dialog>
