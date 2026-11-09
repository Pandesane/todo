
import API from "./API"
// import { BASE_URL_PATH } from "./APIConstants"

class TodosApi extends API {

  constructor() {
    // super(`${BASE_URL_PATH}/todos`)
    super(`http://localhost:5000/api/todos`)

  }

  async getTodo(slug: string): Promise<any> {
    return await super.get(slug)

  }


}
const TodosAPI = new TodosApi()

export default TodosAPI

 
