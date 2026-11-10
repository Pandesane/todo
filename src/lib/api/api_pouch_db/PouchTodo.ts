import PouchDB from "pouchdb-browser"
import { COUCHDB_BASE_URL } from "../APIConstants"
import { browser } from "$app/env"
import type { PouchAttachment } from "#lib/utilities/pouchdb/PouchAttachment.svelte"
import { LocalNotificationPlugin } from "local-notifications"
// const module = await import(
//   'local-notifications'
// );

const DB_NAME = "todos"

export interface IPouchDBAttachment {
  content_type: string
  digest: string
  data: string
}
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
  _attachments?: any
  start_time: string
  end_time: string

}

export type PouchDbOnChangeHandler = (deleted: boolean, _docID: string, doc: IPouchTodo | undefined) => void

class PouchTodoApi {
  db
  onChangeEventHandlers: PouchDbOnChangeHandler[] = []

  constructor() {
    // let remoteDB = COUCHDB_BASE_URL + DB_NAME
    if (browser) {
      this.db = new PouchDB<IPouchTodo>(DB_NAME);
      // this.db.sync(remoteDB, { live: true })
      this.db.changes({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', (change) => {
        // handle change
        // if (change.doc?.collection == "todos") {
        this.onChangeEventHandlers.forEach(async (handler) => {
          if (change.deleted) {
            handler(change.deleted, change.id, undefined)

          } else {
            let doc = await this.get(change.id)
            await LocalNotificationPlugin.notify({ title: doc?.title!, body: doc?.description! });

            handler(false, change.id, doc!)
          }
        })
        // }
        this.db?.compact()


        console.log("New db change event: ", change)
      }).on('complete', function (info) {
        // changes() was canceled
        console.log("New db complete event: ", info)

      }).on('error', function (err) {
        console.log(err);
      });
    }
  }

  async addOnChangeHandler(handler: PouchDbOnChangeHandler) {
    this.onChangeEventHandlers.push(handler)
  }
  async list() {
    let doc = await
      this.db?.allDocs({ include_docs: true, attachments: true });
    let data: IPouchTodo[] = [];
    for (let i = 0; i < doc!.rows.length; i++) {
      const element = doc?.rows[i];
      data.push(element?.doc!)

    }
    console.log(data)

    return data
  }

  async get(_docID: string) {
    return await this.db?.get(_docID, { attachments: true })
  }

  // async create(event: any, newChatMessageAttachments: ChatMessageAttachments) {
  //   // Defaults to random _id
  //   let data = this.getFormData(event)
  //   const now = new Date().toISOString();

  //   const timeStamps: any = {
  //     created_at: now,
  //     updated_at: now,
  //   };

  //   if (newChatMessageAttachments.attachments.length != 0) {
  //     let response = await this.db.post({ ...data, ...timeStamps })
  //     for (let i = 0; i < newChatMessageAttachments.attachments.length; i++) {
  //       const attachment = newChatMessageAttachments.attachments[i];
  //       let buffer = await attachment.file.arrayBuffer()
  //       let blob = new Blob([buffer], { type: attachment.mime_type })
  //       response = await this.db.putAttachment(response.id, attachment.file.name, response.rev, blob, attachment.mime_type)
  //     }
  //   } else {
  //     let response = await this.db.post({ ...data, ...timeStamps })

  //   }
  // }


  async create(
    event: any,
    attachments: PouchAttachment[]
  ) {
    const data = this.getFormData(event);
    const now = new Date().toISOString();

    const timeStamps = {
      created_at: now,
      updated_at: now,
    };

    // const attachments = newChatMessageAttachments.attachments;

    // Create the message document with all attachments at once
    const document: any = {
      ...data,
      ...timeStamps,
    };

    if (attachments.length > 0) {
      document._attachments = {};

      for (const attachment of attachments) {
        let blob

        if (!attachment.isBlob) {
          blob = new Blob(
            [await attachment.file!.arrayBuffer()],
            { type: attachment.mime_type }
          );
        } else {
          blob = attachment.blob
        }

        console.log("Added the blob here", blob)


        document._attachments[attachment.uuid] = {
          content_type: attachment.mime_type,
          data: blob,
        };
      }
    }


    // One database write for the document and its attachments
    const response = await this.db?.post(document);
    console.log(document, response)

    return response;
  }



  // Include the document _id and the _rev
  async update(event: any, todo: IPouchTodo, attachments: PouchAttachment[]) {
    let data = this.getFormData(event)

    const now = new Date().toISOString();
    let document = { ...todo, ...data, updated_at: now }
    console.log(data,)
    console.log(todo)
    console.log(document)



    if (attachments.length > 0) {
      document._attachments = {};
      if (todo._attachments) {
        document._attachments = todo._attachments
      }

      for (const attachment of attachments) {
        let blob

        if (!attachment.isBlob) {
          blob = new Blob(
            [await attachment.file!.arrayBuffer()],
            { type: attachment.mime_type }
          );
        } else {
          blob = attachment.blob
        }

        console.log("Added the blob here", blob)


        document._attachments[attachment.uuid] = {
          content_type: attachment.mime_type,
          data: blob,
        };
      }
    }


    this.db?.put(document)
  }

  delete(_docID: string, _rev: string) {
    this.db?.remove(_docID, _rev)
  }

  removeAttachment(docID: string, attachmentKey: string, rev: string) {
    this.db?.removeAttachment(docID, attachmentKey, rev)
  }

  private getFormData(event: any) {
    // 1. Prevent the browser from reloading the page
    event.preventDefault();
    // 2. Safely grab the form element
    const form = event.currentTarget as HTMLFormElement;
    // 3. Extract the form data using the native browser constructor
    const formData = new FormData(form);
    // 4. Convert the FormData iterator into a standard object map
    const data = Object.fromEntries(formData.entries());
    return data

  }
}



export class PouchTodoAPISingleton {
  private static PouchTodoAPI: PouchTodoApi | undefined = undefined

  static getPouchTodoAPI() {
    if (PouchTodoAPISingleton.PouchTodoAPI) {
      return PouchTodoAPISingleton.PouchTodoAPI
    }
    PouchTodoAPISingleton.PouchTodoAPI = new PouchTodoApi()
    return PouchTodoAPISingleton.PouchTodoAPI

  }
}