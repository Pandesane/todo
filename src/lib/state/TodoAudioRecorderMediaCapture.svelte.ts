import { filesize } from "filesize";



export default class TodoAudioRecorderMediaCapture {
  audioDevices: MediaDeviceInfo[] = $state([]);
  videoDevices: MediaDeviceInfo[] = $state([]);
  selectedAudioDevice?: MediaDeviceInfo = $state();
  testRecordedStream: boolean = $state(false);
  recordingEnded: boolean = $state(false);
  uploadProgress: number | undefined = $state();
  triggeredRestartRecording: boolean = false
  startedRecording: boolean = $state(false)
  blobUploadDone: boolean = $state(false)
  mediaRecorder?: MediaRecorder;
  capturedBlobData: Blob[] = [];
  mediaElement: HTMLMediaElement

  // TODO: Selecting audio or video depending on the chosen user device for the camera and audio input
  mediaStreams: MediaStream[] = []


  constructor(mediaElement: HTMLMediaElement) {
    this.getMediaDevices()
    this.mediaElement = mediaElement
    this.selectedAudioDevice = this.audioDevices[0]

  }



  async getMediaDevices() {
    let mediaDevices = await navigator.mediaDevices.enumerateDevices();

    if (this.audioDevices.length != 0 && this.videoDevices.length != 0) {
      return;
    }
    mediaDevices.forEach((device) => {
      if (device.kind == 'audioinput') {
        this.audioDevices.push(device);
      } else if (device.kind == 'videoinput') {
        this.videoDevices.push(device);
      }
    });

    console.log(this.videoDevices);
    console.log(this.audioDevices);
  }

  getAudioDevices() {
    return this.audioDevices;
  }

  getVideoDevices() {
    return this.videoDevices;
  }

  toggleRecording() {
    if (!this.startedRecording) {
      this.record()
    }
    else {
      this.stopRecording()
    }
  }

  async getMediaStream() {
    // TODO: enable video and audio
    let mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: this.selectedAudioDevice?.deviceId
      }
    });

    this.mediaStreams.push(mediaStream)
    return mediaStream;
  }



  async record() {
    let stream = await this.getMediaStream();
    this.mediaElement.srcObject = stream
    console.log("Gotten stream", stream);
    if (stream) {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event) => {
        console.log("Triggered Recording ondata: ", this.triggeredRestartRecording)

        this.capturedBlobData.push(event.data);

      };
      this.mediaRecorder.onstop = () => {

        this.recordingEnded = true;
        console.log("Triggered Recording onstop: ", this.triggeredRestartRecording)
        this.startedRecording = false;

      };
      this.mediaRecorder.start();
      this.startedRecording = true;
      console.log('Started mediaRecorder');
    }
  }




  async stopRecording() {
    this.mediaRecorder?.stop();
    this.mediaRecorder = undefined;
    this.releaseStream();
    console.log('Stopped mediaRecorder');
  }

  async restartRecording(deviceId: string, onRestartRecording: VoidFunction) {
    // Delete uploaded file in case it has already been uploaded to the server
    // Release the current stream being recorded
    console.log('Restarting recording');
    onRestartRecording()
    this.triggeredRestartRecording = true

    if (this.blobUploadDone) {
      this.blobUploadDone = false
    }
    await this.stopRecording();
    await this.setAudioDevice(deviceId)
    this.recordingEnded = false;
    this.testRecordedStream = false
    this.uploadProgress = 0

    // await this.record()
  }

  async getBlobDataUrl() {
    let blob = this.getBlob()
    const audioURL = URL.createObjectURL(blob);
    console.log('Getting blob url', audioURL);
    return audioURL;
  }

  async uploadBlobData() {
    if (this.blobUploadDone) return
    let blob = this.getBlob()
    console.log('Uploading blob data with its uuid');
  }

  async setAudioDevice(deviceId: string) {
    if (deviceId == 'undefined') return;
    this.audioDevices.forEach((device) => {
      if (deviceId == device.deviceId) {
        this.selectedAudioDevice = device;
      }
    });
  }

  getActiveAudioDevice() {
    return this.selectedAudioDevice?.deviceId
  }

  async switchMediaDevice(mediaType: "video" | "audio", deviceId: string) {

    if (mediaType == "audio") {
      await this.stopRecording()
      this.restartRecording(deviceId, () => console.log("Recording restarted"))


    }

  }


  private async releaseStream() {
    this.mediaStreams.forEach((stream) => {

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

    });
    this.mediaStreams = [];
  }

  getBlob() {
    return new Blob([this.capturedBlobData[this.capturedBlobData.length - 1]], { type: 'audio/ogg; codecs=opus' });

  }

  blobFileSize() {
    let blob = this.getBlob()
    return filesize(blob.size)

  }
}