import { browser } from '$app/env';

export interface IPouchTodo {
  _id: string
  _rev: string
  attachments: any[]
  created_at: string
  updated_at: string
  // More
  title: string
  description: string
  collection: string


}


const DB_NAME = 'todos';

export type PouchDbOnChangeHandler = (
  deleted: boolean,
  _docID: string,
  doc: IPouchTodo | undefined
) => void;

class PouchTodoApi {
  private db: any = undefined;

  private onChangeEventHandlers: PouchDbOnChangeHandler[] = [];

  private constructor() { }

  static async create(): Promise<PouchTodoApi> {
    const instance = new PouchTodoApi();

    if (!browser) {
      throw new Error('PouchDB can only be initialized in the browser');
    }

    await instance.initialize();

    return instance;
  }

  private async initialize() {
    const module = await import('pouchdb-browser');

    const PouchDB = module.default;

    this.db = new PouchDB(DB_NAME);

    this.db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change: any) => {

      this.onChangeEventHandlers.forEach((handler) => {
        if (change.deleted) {
          handler(true, change.id, undefined);
        } else {
          handler(false, change.id, change.doc);
        }
      });

      console.log('New database change:', change);
    }).on('error', (error: Error) => {
      console.error('PouchDB changes error:', error);
    });
  }

  async addOnChangeHandler(handler: PouchDbOnChangeHandler) {
    this.onChangeEventHandlers.push(handler);
  }

  async list(): Promise<IPouchTodo[]> {
    if (!this.db) {
      throw new Error('PouchDB has not been initialized');
    }

    const result = await this.db.allDocs({
      include_docs: true
    });

    return result.rows
      .filter((row: any) => !row.value.deleted)
      .map((row: any) => row.doc as IPouchTodo);
  }

  async get(docID: string) {
    return await this.db.get(docID);
  }

  async create(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    const now = new Date().toISOString();

    const document = {
      ...data,
      created_at: now,
      updated_at: now
    };

    console.log(document)
    // return await this.db.post(document);
  }

  async delete(docID: string, rev: string) {
    return await this.db.remove(docID, rev);
  }
}

export default class PouchTodoAPISingleton {
  private static PouchTodoAPI: PouchTodoApi | undefined;

  static async getPouchTodoAPI(): Promise<PouchTodoApi> {
    if (!this.PouchTodoAPI) {
      this.PouchTodoAPI = await PouchTodoApi.create();
    }

    return this.PouchTodoAPI;
  }
}