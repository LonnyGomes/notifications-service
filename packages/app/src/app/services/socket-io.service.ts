import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SocketMessageDataModel {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
}
export interface SocketMessageModel {
  eventName: string;
  data: SocketMessageDataModel;
}

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket = null;
  private socket$: BehaviorSubject<SocketMessageModel>;
  // tslint:disable-next-line:variable-name
  private _notifications: SocketMessageModel[];

  private SUBSCRIPTION_STATES = {
    news: true,
    DevOps: false,
    Releases: false
  };

  constructor() {
    this._notifications = [];
    this.socket$ = new BehaviorSubject(null);
    this.socket = io('https://server.local:3001');

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

  get observable(): Observable<SocketMessageModel> {
    return this.socket$.asObservable();
  }

  get subscriptionStates() {
    return this.SUBSCRIPTION_STATES;
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

      myNotification.addEventListener('click', () => {
        console.log('TODO');
      });

      // update update subject
      this.socket$.next({
        eventName,
        data
      });
    });
  }
}
