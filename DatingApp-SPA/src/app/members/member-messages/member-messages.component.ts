import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../_models/message';
import { UserService } from '../../_services/user.service';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { tap } from 'rxjs/operators';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  nick = '';
  public hubConnection: HubConnection;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
   this.loadMessages();
   this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/chatsystem', {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  }).build();
   this.hubConnection.on('sendPrivately', (msg) => {
     // this.messages.push(msg);
     this.messages.unshift(msg);

     // this.loadMessages();
     // console.log('New Data Received');

   });
   this.hubConnection.start().then(
     () => {
       console.log('Connection Started');
     }
   ).catch(err => {
    console.log(err);
   });
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService
      .getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap(messages => {
          for (let i = 0; i < messages.length; i++) {
            if (
              messages[i].isRead === false &&
              messages[i].recipientId === currentUserId
            ) {
              console.log('Is read: ' + messages[i].content);
              this.userService.markAsRead(currentUserId, messages[i].id);
              messages[i].isRead = true;
            }
          }
        })
      )
      .subscribe(
        messages => {
          this.messages = messages;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          //this.messages.unshift(message);
          this.newMessage.content = '';
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  sendMessageWithSignalR() {
    // this.hubConnection.invoke('SendMessageToEveryOne', this.newMessage);
    this.newMessage.recipientId = this.recipientId;
    this.hubConnection.invoke('SendPrivateMessage', this.authService.decodedToken.nameid, this.newMessage);
  }



}
