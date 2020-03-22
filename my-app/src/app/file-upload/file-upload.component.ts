import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: [ './file-upload.component.scss' ]
})
export class FileUploadComponent implements OnInit {
  // for timer
  counter: number;
  timerRef = 0;
  running = false;
  // end for timer
  pingFileSubscription: Subscription;
  noPingFiles: FileList;
  withPingFiles: FileList;

  @ViewChild('eventLog', { static: false })
  eventLog?: ElementRef<HTMLElement>;

  constructor() {}

  ngOnInit() {}

  appendMsgToEventLog(msg: string) {
    const eventLogEl = this.eventLog.nativeElement;
    const now = moment().format('LTS');
    eventLogEl.textContent = this.eventLog.nativeElement.textContent + '\n' + now + ' ' + msg;
    eventLogEl.scrollTop = eventLogEl.scrollHeight;
  }

  onSelectedFiles(e, ping: boolean) {
    const files: FileList = e.target.files;
    if (ping) {
      this.withPingFiles = files;

      if (this.pingFileSubscription) {
        this.pingFileSubscription.unsubscribe();
      }

      if (files && files.length > 0) {
        this.pingSelectedFiles(files);
      }
    } else {
      this.clearTimer();
      this.counter = 0;
      this.startTimer();
      this.noPingFiles = files;
    }
  }

  pingSelectedFiles(files: FileList) {
    const checkingTimer = timer(100, 2000);
    this.pingFileSubscription = checkingTimer.subscribe((val) => {
      this.appendMsgToEventLog('start to ping selected files, count: ' + val);
      this.pingFiles(files);
    });
  }

  pingFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.pingFile(files.item(i));
    }
  }

  pingFile(file: File) {
    this.appendMsgToEventLog('start to read some first bytes of selected file: ' + file.name);
    const reader = new FileReader();
    reader.onabort = () => {
      this.appendMsgToEventLog('reader onabort');
    };
    reader.onloadend = () => {
      this.appendMsgToEventLog('reader onloadend with result: ' + reader.result);
    };
    reader.onerror = () => {
      this.appendMsgToEventLog('reader onerror');
    };
    reader.onprogress = (e) => {
      this.appendMsgToEventLog('reader onprogress with loaded: ' + e.loaded);
    };
    const blob = file.slice(0, 16);
    reader.readAsText(blob);
  }

  uploadSelectedFiles() {
    if (this.pingFileSubscription) {
      this.pingFileSubscription.unsubscribe();
      this.appendMsgToEventLog('stopped ping files');
    }
    // now, we try to read the content of selected files
    // first read with-ping files
    this.appendMsgToEventLog('try to read with-ping files');
    if (this.withPingFiles && this.withPingFiles.length > 0) {
      this.pingFiles(this.withPingFiles);
    }
    // second if no-ping files, we wait 3 seconds to ensure with-ping file is readed
    setTimeout(() => {
      this.appendMsgToEventLog('try to read no-ping files');
      if (this.noPingFiles && this.noPingFiles.length > 0) {
        this.pingFiles(this.noPingFiles);
      }
    }, 3000);
  }

  startTimer() {
    this.running = !this.running;
    if (this.running) {
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Math.round((Date.now() - startTime) / 1000);
      });
    } else {
      clearInterval(this.timerRef);
    }
  }

  clearTimer() {
    this.running = false;
    this.counter = 0;
    clearInterval(this.timerRef);
  }
}
