import { PouchTodoAPISingleton, type IPouchTodo } from "#lib/api/api_pouch_db/PouchTodo"

class TodoPouchDBState {
  todos: IPouchTodo[] = $state([])

  PouchTodoAPI
  constructor() {
    this.PouchTodoAPI = PouchTodoAPISingleton.getPouchTodoAPI()
    this.loadData()
    this.PouchTodoAPI.addOnChangeHandler((deleted, id, doc) => {
      this.onTodoPouchEventHandler(this, deleted, id, doc)
    }
    )
  }

  async loadData() {
    this.todos = await this.PouchTodoAPI.list()

  }

  onTodoPouchEventHandler(thisContext: TodoPouchDBState, deleted: boolean, id: string, doc: IPouchTodo | undefined) {
    if (deleted) {
      thisContext.todos = thisContext.todos.filter((data) => {
        return data._id != id
      })
      console.log("This context", thisContext.todos)

    } else {
      if (doc!._rev.split("-")[0] != "1") {
        thisContext.todos = thisContext.todos.filter((data) => {
          return data._id != id
        })
        thisContext.todos = [...thisContext.todos, doc!];
        console.log("This context", thisContext.todos)

      } else {
        thisContext.todos = [...thisContext.todos, doc!];
        console.log("This context", thisContext.todos)
      }
    }
  }

  delete(id: string, rev: string) {
    this.PouchTodoAPI.delete(id, rev)
  }


}


export default class TodoPouchDBStateSingleton {
  private static todoPouchDBState: TodoPouchDBState | undefined = undefined

  static getSupportCenterLiveDataPouchDb(): TodoPouchDBState {
    if (TodoPouchDBStateSingleton.todoPouchDBState) {
      return TodoPouchDBStateSingleton.todoPouchDBState

    }

    TodoPouchDBStateSingleton.todoPouchDBState = new TodoPouchDBState()
    return TodoPouchDBStateSingleton.todoPouchDBState
  }
}



