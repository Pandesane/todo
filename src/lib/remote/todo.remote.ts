


// import { form, getRequestEvent, query } from "$app/server";
// import  TodosAPI from "$lib/api/TodosAPI";
// import type ITodo from "$lib/interfaces/ITodo";
// import { createToast } from "$lib/state/AddToast.svelte";
// import { NewTodoFormSchema,
//  EditTodoFormSchema,
//  DeleteTodoSchema} from "$lib/schemas/TodoSchema";
// import { redirect } from "@sveltejs/kit";
// import * as v from "valibot"






// export const getTodos = query(async () => {
//   let todos: ITodo[] = await TodosAPI.list()
//   return todos
// })

// export const getTodo = query(v.union([v.string(), v.number()]), async (todo_id) => {
//   let todo: ITodo = await TodosAPI.getTodo(todo_id.toString())
//   return todo
// })



// export const createNewTodoForm = form(NewTodoFormSchema, async (data) => {

//   let response: { success: boolean, flash: string } = await TodosAPI.create(data)
//   let { cookies } = getRequestEvent()
//   if (response.success) {
//     createToast(cookies, response.flash, true, "success");
//     await getTodos().refresh()
//     throw redirect(303, "/todos");
//   } else {
//     createToast(cookies, response.flash, true, "error");
//   }
// })






// export const editTodoForm = form(EditTodoFormSchema, async (data) => {
//   console.log("Diseases form", data);

//   let response: { success: boolean, flash: string } = await TodosAPI.update(Number.parseInt(data.id.toString()), data)
//   let { cookies } = getRequestEvent()
//   if (response.success) {
//     createToast(cookies, response.flash, true, "success");
//     await getTodo(data.id).refresh()
//     throw redirect(303, `/todos/${data.id}`)
//   } else {
//     createToast(cookies, response.flash, true, "error");
//   }
// })





// export const deleteTodoForm = form(DeleteTodoSchema, async (data) => {
//   let response: { success: boolean, flash: string } =    await TodosAPI.delete(data.id)
//   let { cookies } = getRequestEvent()
//   if (response.success) {
//     createToast(cookies, response.flash, true, "success");
//     throw redirect(303, `/todos`)
//   } else {
//     createToast(cookies, response.flash, true, "error");
//   }

// });
