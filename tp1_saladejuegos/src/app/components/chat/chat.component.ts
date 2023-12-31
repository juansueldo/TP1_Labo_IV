import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { QuerySnapshot } from 'firebase/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages$: Observable<Message[]>;
  userIsLogged: any;
  showChat = false;
  userName: any;
  message = '';
  messages: Message[] = [];
  @ViewChild('container-messages') private messageContainer: ElementRef;
  constructor(private auth: FirebaseService, private router: ActivatedRoute) {}

  ngOnInit(): void {

    this.messages$ = this.auth.getUserLogged().pipe(
      switchMap(user => {
        this.userIsLogged = user;
        this.userName = user.displayName;
        return this.auth.loadMessages();
      })
    );
  
    this.messages$.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        setTimeout(() => {
          this.scrollToBottom();
        }, 10);
      },
      (error) => {
        console.error('Error obteniendo documentos: ', error);
      }
    );
  }

  sendMessage(): void {
    const now = new Date();
    const messageNew: Message = {
      uid: this.userIsLogged.uid,
      user: this.userName,
      text: this.message,
      date: now.toLocaleString(),
    };
  
    this.auth.saveMessages(messageNew);
    this.messages.push(messageNew);
  
    setTimeout(() => {
      this.message = "";
      this.scrollToBottom();
    }, 10);
  }
  
  determineMessageClass(message: Message): string {
    return message.uid === this.userIsLogged.uid ? 'send' : 'received';
  }
  scrollToBottom() {
    const containerMessages = document.getElementById("container-messages");
    if (containerMessages) {
      const toppos = containerMessages.scrollHeight;
      containerMessages.scrollTop = toppos;
    }
  }

}
