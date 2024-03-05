import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root',
})
export class StompService {
  // Initialize the Stomp client (will be configured later)
  private stompClient: any;

  constructor() {
    // Create a WebSocket connection using SockJS
    const socket = new SockJS('http://localhost:8081/stomp-endpoint');
    // Initialize the Stomp client using the WebSocket connection
    this.stompClient = Stomp.over(socket);
    // Configure debugging (set to null for no debugging)
    this.stompClient.debug = null;
    // Connect to the WebSocket server
    this.stompClient.connect({}, () => {
      // Successful connection callback
    });
  }

  // Subscribe to a specific topic and provide a callback function to handle incoming messages
  subscribe(topic: string, callback: any): any {
    return this.stompClient.subscribe('/topic/' + topic, (frame: any): any => {
      // Parse the message body and pass it to the callback function
      callback(JSON.parse(frame.body));
    });
  }

  // Send a message to a specific application using Stomp
  send(app: string, data: any) {
    // Send the data as a JSON string to the specified application
    this.stompClient.send('/app/' + app, {}, JSON.stringify(data));
  }
}
