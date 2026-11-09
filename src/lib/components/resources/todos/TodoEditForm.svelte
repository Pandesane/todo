<script lang="ts">
	import { page } from '$app/state';
	import * as v from 'valibot';
	// import type ITodo from '#lib/interfaces/ITodo.ts';

	interface IProps {
		todo: any;
		closeModal: () => void;
		relation_id: string | number;
	}
	// Defaults
	let { todo, closeModal, relation_id }: IProps = $props();

	// Defaults
	let form: HTMLFormElement;
	let submitBtn: HTMLButtonElement;

	export function resetForm() {
		// form.reset();
	}

	export function cleanUpForm() {}
</script>

<!-- {...editTodoForm.for(todo.id).enhance(async ({ data, submit, form }) => {
		// await submit();
		// if (v.safeParse(EditTodoFormSchema, data).success) {
		// 	closeModal();
		// 	cleanUpForm();
		// }
	})} -->
<form bind:this={form} class="mx-auto my-6 flex w-full max-w-200 flex-col gap-5">
	<p class="text-center">Edit todo</p>

	<!-- HIDDEN -->
	<input type="hidden" name="id" value={todo.id} />
	<input type="hidden" name="redirect" value={page.url.href} />
	<input type="hidden" name="relation_id" value={relation_id} />

	<div class="flex flex-col gap-1.5">
		<label for="title" class="text-xs font-medium text-slate-600">title</label>

		<input
			type="text"
			id="title"
			value={todo.title}
			class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
              transition outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
		/>
	</div>

	<div class="flex flex-col gap-1.5">
		<label for="description" class="text-xs font-medium text-slate-600">description</label>

		<textarea
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
