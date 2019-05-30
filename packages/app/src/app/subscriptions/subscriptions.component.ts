import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../services/socket-io.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  newsChecked = true;
  constructor(private socket: SocketIoService) {}

  ngOnInit() {}

  onToggleChange($event) {
    const source = $event.source;

    if ($event.checked) {
      this.socket.listenOnEventName(source.name);
    } else {
      this.socket.muteEventName(source.name);
    }
  }
}
