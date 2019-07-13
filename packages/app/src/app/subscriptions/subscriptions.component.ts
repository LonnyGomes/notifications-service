import { Component, OnInit } from '@angular/core';
import {
  SocketIoService,
  ChannelStatesModel
} from '../services/socket-io.service';

interface ChannelsModel {
  label: string;
  name: string;
}

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  newsChecked: boolean;
  devOpsChecked: boolean;
  releasesChecked: boolean;
  channels: ChannelsModel[];
  checkedState: ChannelStatesModel = {};

  constructor(private socket: SocketIoService) {}

  ngOnInit() {
    // get channels
    this.channels = this.socket.getChannels();
    this.checkedState = this.socket.channelStates;
  }

  onToggleChange($event) {
    const source = $event.source;

    // save state of subscription for life of the app
    this.checkedState[source.name] = $event.checked;

    // either listen or mute the event name
    if ($event.checked) {
      this.socket.listenOnEventName(source.name);
    } else {
      this.socket.muteEventName(source.name);
    }
  }
}
