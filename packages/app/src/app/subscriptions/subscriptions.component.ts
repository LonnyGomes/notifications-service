import { Component, OnInit } from '@angular/core';
import {
  SocketIoService,
  TopicStatesModel,
  TopicModel
} from '../services/socket-io.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  topics: TopicModel[];
  checkedState: TopicStatesModel = {};

  constructor(private socket: SocketIoService) {}

  ngOnInit() {
    // get topics
    this.topics = this.socket.getTopics();
    this.checkedState = this.socket.topicStates;
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
