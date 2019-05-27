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
    this.notifications = [];
  }

  ngOnInit() {
    this.socket.observable.subscribe(model => {
      if (!model) {
        // ignore models that have no data
        return;
      }
      this.notifications.unshift(model);
    });
  }
}
