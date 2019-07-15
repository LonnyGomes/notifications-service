import { Component, OnInit } from '@angular/core';
import {
  SocketIoService,
  SocketMessageModel
} from '../services/socket-io.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications-feed',
  templateUrl: './notifications-feed.component.html',
  styleUrls: ['./notifications-feed.component.scss']
})
export class NotificationsFeedComponent implements OnInit {
  notifications: SocketMessageModel[];

  constructor(private socket: SocketIoService) {
    this.notifications = this.socket.notifications;
  }

  ngOnInit() {
    this.socket.observable.subscribe(model => {
      if (!model) {
        // ignore models that have no data
        return;
      }
      this.socket.addNotification(model);
    });
  }

  get isChecked(): boolean {
    return this.socket.isMuted;
  }

  removeNotification(id: string) {
    this.socket.removeNotification(id);
    this.notifications = this.socket.notifications;
  }

  dismissAll() {
    this.socket.dismissAll();
    this.notifications = this.socket.notifications;
  }

  onMuteToggleChange($event) {
    this.socket.isMuted = $event.checked;
  }
}
