import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: [ './file-upload.component.scss' ]
})
export class FileUploadComponent implements OnInit {
  pingFileSubscription: Subscription;
  noPingFiles: FileList;
  withPingFiles: FileList;

  @ViewChild('eventLog', { static: false })
  eventLog?: ElementRef<HTMLElement>;
  constructor() {}

  ngOnInit() {}

  appendMsgToEventLog(msg: string) {
    this.eventLog.nativeElement.textContent = this.eventLog.nativeElement.textContent + '\n' + msg;
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
    this.appendMsgToEventLog('start to ping selected file: ' + file.name);
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

  onStartTimer() {
    if (this.pingFileSubscription) {
      this.pingFileSubscription.unsubscribe();
    }
    const checkingTimer = timer(100, 2000);
    this.pingFileSubscription = checkingTimer.subscribe((val) => {
      console.log(val);
    });
  }
  onStopTimer() {
    this.pingFileSubscription.unsubscribe();
    this.appendMsgToEventLog('stopped ping files');
  }
  uploadSelectedFiles() {
    this.pingFileSubscription.unsubscribe();
    this.appendMsgToEventLog('stopped ping files');
    // now, we try to read the content of selected files
    // first read with-ping files
    this.appendMsgToEventLog('try to read with-ping files');
    if (this.withPingFiles && this.withPingFiles.length > 0) {
      this.pingFiles(this.withPingFiles);
    }
    // second if no-ping files, we wait 3 seconds to ensure with-ping file is readed
    this.appendMsgToEventLog('try to read no-ping files');
    setTimeout(() => {
      if (this.noPingFiles && this.noPingFiles.length > 0) {
        this.pingFiles(this.noPingFiles);
      }
    }, 2000);
  }
}
