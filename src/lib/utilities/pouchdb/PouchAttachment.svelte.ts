export class PouchAttachment {
  uuid
  mime_type
  file: File | undefined
  previewUrl: string
  isBlob: boolean = false
  blob: Blob | undefined = undefined

  constructor(file: File | Blob, isBlob: boolean = false) {
    this.uuid = self.crypto.randomUUID()
    this.mime_type = file.type
    this.isBlob = isBlob
    if (isBlob) {
      this.blob = file
      this.file = undefined
      this.previewUrl = URL.createObjectURL(this.blob);

    } else {
      this.file = file as File
      this.previewUrl = URL.createObjectURL(file);

    }

  }

}


export class PouchDBAttachments {
  attachments: PouchAttachment[] = $state([])


  addAttachment(file: File) {
    this.attachments = [...this.attachments, new PouchAttachment(file)]
    console.log(this.attachments);
  }

  addBlobAttachment(blob: Blob) {
    let attachment = new PouchAttachment(blob, true)
    this.attachments = [...this.attachments, attachment]
    console.log(this.attachments);
  }


  removeAttachment(uuid: string) {
    this.attachments = this.attachments.filter((v) => {
      return v.uuid != uuid
    })
  }

  reset() {
    this.attachments = []
  }

  getAllFileAttachmentPreviews() {
    return this.attachments.map((attachment) => {
      return { url: attachment.previewUrl, type: attachment.mime_type }
    })
  }
}