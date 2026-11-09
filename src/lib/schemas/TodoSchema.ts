

import * as v from "valibot";

export const TodoSchema = v.object({

     title: v.pipe(v.string(), v.nonEmpty("title can't be blank."), v.minLength(5, "title must be at least 5 characters long")),

     description: v.pipe(v.string(), v.nonEmpty("description cannot be blank."), v.minLength(15, "description must be at least 15 characters long")),

     collection: v.pipe(v.string(), v.nonEmpty("collection can't be blank."), v.minLength(5, "collection must be at least 5 characters long")),

     //id: v.union([v.string(), v.number()]),
     // relation_id: v.union([v.string(), v.number()]),



})





export const NewTodoFormSchema = v.object({

     title: v.pipe(v.string(), v.nonEmpty("title can't be blank."), v.minLength(5, "title must be at least 5 characters long")),

     description: v.pipe(v.string(), v.nonEmpty("description cannot be blank."), v.minLength(15, "description must be at least 15 characters long")),

     collection: v.pipe(v.string(), v.nonEmpty("collection can't be blank."), v.minLength(5, "collection must be at least 5 characters long")),

     //id: v.union([v.string(), v.number()]),
     // relation_id: v.union([v.string(), v.number()]),


})


export const EditTodoFormSchema = v.object({

     title: v.pipe(v.string(), v.nonEmpty("title can't be blank."), v.minLength(5, "title must be at least 5 characters long")),

     description: v.pipe(v.string(), v.nonEmpty("description cannot be blank."), v.minLength(15, "description must be at least 15 characters long")),

     collection: v.pipe(v.string(), v.nonEmpty("collection can't be blank."), v.minLength(5, "collection must be at least 5 characters long")),

     //id: v.union([v.string(), v.number()]),
     // relation_id: v.union([v.string(), v.number()]),


})

export const DeleteTodoSchema = v.object({

     title: v.pipe(v.string(), v.nonEmpty("title can't be blank."), v.minLength(5, "title must be at least 5 characters long")),

     description: v.pipe(v.string(), v.nonEmpty("description cannot be blank."), v.minLength(15, "description must be at least 15 characters long")),

     collection: v.pipe(v.string(), v.nonEmpty("collection can't be blank."), v.minLength(5, "collection must be at least 5 characters long")),

     //id: v.union([v.string(), v.number()]),
     // relation_id: v.union([v.string(), v.number()]),


})

