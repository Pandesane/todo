import { browser } from "$app/env"
import PouchDB from "pouchdb-browser"
import { COUCHDB_BASE_URL } from "../APIConstants"

const DB_NAME = "todos"

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
        this.onChangeEventHandlers.forEach((handler) => {
          if (change.deleted) {
            handler(change.deleted, change.id, undefined)

          } else {
            handler(false, change.id, change.doc!)
          }
        })
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
      this.db?.allDocs({ include_docs: true });
    let data: IPouchTodo[] = [];
    for (let i = 0; i < doc!.rows.length; i++) {
      const element = doc?.rows[i];
      data.push(element?.doc!)

    }
    console.log(data)

    return data
  }

  async get(_docID: string) {
    return await this.db?.get(_docID)
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

    // if (attachments.length > 0) {
    //   document._attachments = {};

    //   for (const attachment of attachments) {
    //     let blob

    //     if (!attachment.isBlob) {
    //       blob = new Blob(
    //         [await attachment.file!.arrayBuffer()],
    //         { type: attachment.mime_type }
    //       );
    //     } else {
    //       blob = attachment.blob
    //     }

    //     console.log("Added the blob here", blob)


    //     document._attachments[attachment.uuid] = {
    //       content_type: attachment.mime_type,
    //       data: blob,
    //     };
    //   }
    // }

    // One database write for the document and its attachments
    const response = await this.db?.post(document);

    return response;
  }



  // Include the document _id and the _rev
  update(event: any) {
    let data = this.getFormData(event)

    const now = new Date().toISOString();
    //TODO: Cleanup this.db.put({ ...data, updated_at: now })
  }

  delete(_docID: string, _rev: string) {
    this.db?.remove(_docID, _rev)
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



class PouchTodoAPISingleton {
  private static PouchTodoAPI: PouchTodoApi | undefined = undefined

  static getPouchTodoAPI() {
    if (PouchTodoAPISingleton.PouchTodoAPI) {
      return PouchTodoAPISingleton.PouchTodoAPI
    }
    PouchTodoAPISingleton.PouchTodoAPI = new PouchTodoApi()
    return PouchTodoAPISingleton.PouchTodoAPI

  }
}