import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chats',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './chats.html',
  styleUrl: './chats.scss',
})
export class Chats {

  chats = [
    { id: 1, name: 'John', lastMessage: 'Hello', time: '10:30 AM' },
    { id: 2, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM' }
  ];

  messages: any[] = [];
  selectedChat: any;
  newMessage = '';

  selectChat(chat: any) {
    this.selectedChat = chat;

    // mock messages
    this.messages = [
      { text: 'Hi', isMe: false, time: '10:00' },
      { text: 'Hello!', isMe: true, time: '10:01' }
    ];
  }

  sendMessage() {
    if (!this.newMessage) return;

    this.messages.push({
      text: this.newMessage,
      isMe: true,
      time: new Date().toLocaleTimeString()
    });

    this.newMessage = '';
  }
}
