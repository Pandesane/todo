<script lang="ts">
	// import PouchTodoAPI from '#lib/api/api_pouch_db/PouchTodo.ts';
	import TodoComponent from './TodoComponent.svelte';
	import TodoNewForm from './TodoNewForm.svelte';
	let dialogElementAdd: HTMLDialogElement;

	let { relation_id }: { relation_id: string | number } = $props();
	let todoNewForm: TodoNewForm;

	// let todos = $derived(await PouchTodoAPI.list());
	let todos = $derived([]);
</script>

<div class="mx-2 mt-4">
	<div class="mb-5 flex items-start justify-between border-b border-slate-100 pb-3">
		<!-- TITLE BLOCK -->
		<div class="flex flex-col gap-1">
			<p class="text-sm font-semibold tracking-tight text-slate-900">Todos</p>

			<p class="text-xs leading-snug text-slate-400">Support text here</p>
		</div>

		<!-- ACTION -->
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
	</div>

	<div class="mt-4 w-full">
		{#each todos as todo}
			<TodoComponent {relation_id} {todo} />
		{/each}
	</div>
</div>

<!-- Add New  Todo -->
<dialog bind:this={dialogElementAdd} class="modal">
	<div class="modal-box max-h-[80vh]">
		<TodoNewForm
			bind:this={todoNewForm}
			closeModal={() => {
				dialogElementAdd.close();
			}}
			{relation_id}
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
