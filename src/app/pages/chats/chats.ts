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
    { id: 1, name: 'John', lastMessage: 'Hello', time: '10:30 AM', unreadCount:  1, isTyping: true },
    { id: 2, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 2, isTyping: false },
    { id: 3, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 0, isTyping: false },
    { id: 4, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 0, isTyping: false },
    { id: 5, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 5, isTyping: false },
    { id: 6, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 0, isTyping: false },
    { id: 7, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 0, isTyping: false },
    { id: 8, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 8, isTyping: false },
    { id: 9, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 9, isTyping: false },
    { id: 10, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 0, isTyping: false },
    { id: 11, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 11, isTyping: false },
    { id: 12, name: 'Team', lastMessage: 'Meeting at 5', time: '09:00 AM', unreadCount: 12, isTyping: false }
  ];

  messages: any[] = [];
  selectedChat: any;
  newMessage = '';
  isTyping = false;

  selectChat(chat: any) {
    this.selectedChat = chat;
    console.log('Selected chat:', chat, window.innerHeight);
    this.chats = this.chats.map(c => {
      c['unreadCount'] = c['id'] === chat['id'] ? 0 : c['unreadCount']
      return c;
    });
    // mock messages
    this.messages = [
      { text: 'Hi', isMe: false, time: '10:00' },
      { text: 'Hello!', isMe: true, time: '10:01' }
    ];
  }

  onSendMessage() {
    if (!this.newMessage) return;

    this.messages.push({
      text: this.newMessage,
      isMe: true,
      time: new Date().toLocaleTimeString()
    });

    this.newMessage = '';
  }
}
