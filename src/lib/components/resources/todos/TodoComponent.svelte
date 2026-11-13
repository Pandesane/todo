<script lang="ts">
	import type { IPouchTodo } from '$lib/api/api_pouch_db/PouchTodo';
	import TodoPouchDBStateSingleton from '$lib/state/pouchdb/TodoState.svelte';
	import TodoEditForm from './TodoEditForm.svelte';

	interface IProps {
		todo: IPouchTodo;
	}
	let { todo,  }: IProps = $props();

	let dialogElementEdit: HTMLDialogElement;
	let todoEditForm: TodoEditForm;
	let PouchTodoAPI = TodoPouchDBStateSingleton.getSupportCenterLiveDataPouchDb().PouchTodoAPI;
</script>

<div class="relative my-8 flex flex-col gap-4 pl-4">
	<div class="flex flex-col gap-4 md:flex-row md:gap-6">
		<div class="font-semibold text-sm">{todo.title}</div>

		<div class="">{todo.description}</div>


		<!-- ACTIONS -->
		<div class="mt-auto flex items-center gap-4 pt-2">
			<button
				onclick={() => PouchTodoAPI.delete(todo._id, todo._rev)}
				class="flex items-center gap-1 text-xs font-medium text-red-600 transition hover:text-red-700"
			>
				<span class="icon-[hugeicons--delete-02] size-4"></span>
				Delete
			</button>

			<button
				onclick={() => {
					dialogElementEdit.showModal();
				}}
				class="flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
			>
				<span class="icon-[hugeicons--edit-03] size-4"></span>
				Edit
			</button>
		</div>
	</div>
</div>

<!-- Edit Todo -->
<dialog bind:this={dialogElementEdit} class="modal">
	<div class="modal-box max-h-[80vh]">
		<TodoEditForm
			bind:this={todoEditForm}
			closeModal={() => {
				dialogElementEdit.close();
			}}
			{todo}

		/>

		<div class="modal-action">
			<button
				onclick={() => {
					dialogElementEdit.close();
					todoEditForm.resetForm();
				}}
				class="btn btn-primary my-4">Close</button
			>
		</div>
	</div>
</dialog>
