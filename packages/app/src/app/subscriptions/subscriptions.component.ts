import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../services/socket-io.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  newsChecked: boolean;
  devOpsChecked: boolean;
  releasesChecked: boolean;
  constructor(private socket: SocketIoService) {}

  ngOnInit() {
    this.newsChecked = this.socket.subscriptionStates.news;
    this.devOpsChecked = this.socket.subscriptionStates.DevOps;
    this.releasesChecked = this.socket.subscriptionStates.Releases;
  }

  onToggleChange($event) {
    const source = $event.source;

    // save state of subscription for life of the app
    this.socket.subscriptionStates[source.name] = $event.checked;

    // either listen or mute the event name
    if ($event.checked) {
      this.socket.listenOnEventName(source.name);
    } else {
      this.socket.muteEventName(source.name);
    }
  }
}
