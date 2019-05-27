import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket = null;
  constructor() {
    this.socket = io('https://server.local:3001');
    this.socket.on('news', data => {
      console.log('got news', data);
    });
    this.socket.on('connect', () => {
      console.log('we got it!');
    });
    this.socket.emit('message', { my: 'data' });
  }
}
