<script lang="ts">
	import TodoEditForm from './TodoEditForm.svelte';

	interface IProps {
		todo: any;
		relation_id: string | number;
	}
	let { todo, relation_id }: IProps = $props();

	let dialogElementEdit: HTMLDialogElement;
	let todoEditForm: TodoEditForm;
</script>

<div class="relative my-8 flex flex-col gap-4 pl-4">
	<div class="flex flex-col gap-4 md:flex-row md:gap-6">
		<div class="mt-2 font-semibold">{todo.title}</div>

		<div class="mt-2 font-semibold">{todo.description}</div>

		<div class="mt-2 font-semibold">{todo.collection}</div>

		<!-- ACTIONS -->
		<div class="mt-auto flex items-center gap-4 pt-2">
			<form >
				<input type="hidden" name="id" value={todo.id} />

				<button
					onclick={(e) => {
						let btn = e.target as HTMLButtonElement;
						btn.innerText = 'Deleting...';
					}}
					class="flex items-center gap-1 text-xs font-medium text-red-600 transition hover:text-red-700"
				>
					<span class="icon-[hugeicons--delete-02] size-4"></span>
					Delete
				</button>
			</form>

			<button
				onclick={() => {
					dialogElementEdit.showModal();
				}}
				class="flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
			>
				<span class="icon-[hugeicons--edit-02] size-4"></span>
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
			{relation_id}
		/>

		<div class="modal-action">
			<button
				onclick={() => {
					dialogElementEdit.close();
					todoEditForm.resetForm();
					todoEditForm.cleanUpForm();
				}}
				class="btn btn-primary my-4">Close</button
			>
		</div>
	</div>
</dialog>
