import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationModel } from '@cricket/utils';
import { ElectronService } from 'ngx-electron';
export interface SocketMessageModel {
  eventName: string;
  data: NotificationModel;
}

interface ChannelModel {
  label: string;
  name: string;
}
export interface ChannelStatesModel {
  [index: string]: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket = null;
  private socket$: BehaviorSubject<SocketMessageModel>;
  // tslint:disable-next-line:variable-name
  private _notifications: SocketMessageModel[];
  // tslint:disable-next-line:variable-name
  private _channelStates: ChannelStatesModel = {};

  // TODO: retrieve this list from the server
  channels: ChannelModel[] = [
    { label: 'News', name: 'news' },
    { label: 'DevOps', name: 'DevOps' },
    { label: 'Releases', name: 'Releases' }
  ];

  constructor(private electron: ElectronService) {
    this._notifications = [];
    this.socket$ = new BehaviorSubject(null);
    this.socket = io('https://server.local:3001');

    this.channels.forEach(curChan => {
      this._channelStates[curChan.name] = false;
    });

    this.socket.on('connect', () => {
      console.log('connected to socket.io server');
    });
    this.socket.emit('message', {
      timestamp: Date.now(),
      level: 'info',
      message: 'Sending to server'
    });

    this.listenOnEventName('news');
  }

  getChannels() {
    return this.channels;
  }

  get channelStates(): ChannelStatesModel {
    return this._channelStates;
  }

  get observable(): Observable<SocketMessageModel> {
    return this.socket$.asObservable();
  }

  // notifications
  get notifications(): SocketMessageModel[] {
    return this._notifications;
  }

  addNotification(model: SocketMessageModel) {
    const results = this._notifications.filter(
      curModel => curModel.data.id === model.data.id
    );
    // only add unique models to the list of notifications
    if (results.length === 0) {
      this._notifications.unshift(model);
    }
  }
  dismissAll() {
    this._notifications = [];
    return this._notifications;
  }

  removeNotification(id: string) {
    this._notifications = this._notifications.filter(
      curItem => curItem.data.id !== id
    );
  }

  muteEventName(eventName) {
    this.socket.off(eventName);
  }

  listenOnEventName(eventName) {
    this.socket.on(eventName, data => {
      // send system notification
      const myNotification = new Notification(`Message from ${eventName}`, {
        body: data.message
      });

      myNotification.addEventListener('click', evt => {
        evt.preventDefault();
        // if a URL is supplied, open it in a browser
        if (data.url) {
          if (this.electron.isElectronApp) {
            this.electron.shell.openExternal(data.url);
          }
        }
      });

      // update update subject
      this.socket$.next({
        eventName,
        data
      });
    });
  }
}
