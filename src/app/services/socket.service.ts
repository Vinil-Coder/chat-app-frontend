import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket!: Socket;

  connect() {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
  }

  joinConversation(conversationId: string, userId: string) {
    this.socket.emit('join_conversation', { conversationId, userId });
  }

  sendMessage(data: any) {
    this.socket.emit('send_message', data);
  }

  receiveMessage() {
    return new Observable<any>((observer) => {
      this.socket.on('receive_message', (msg) => {
        observer.next(msg);
      });
    });
  }

  onTypingStart(conversationId: string, userId: string) {
    this.socket.emit("typing_starts", { conversationId, userId });
  }

  onTypingStop(conversationId: string, userId: string) {
    this.socket.emit("typing_stops", { conversationId, userId });
  }

  onTypingStatus() {
    return new Observable<any>((observer) => {
      this.socket.on("is_typing", (data) => {
        observer.next(data);
      });
    });
  }

  markRead(messageId: string, userId: string) {
    this.socket.emit("message_read", { messageId, userId });
  }

  onMessageRead() {
    return new Observable<any>((observer) => {
      this.socket.on("message_read", observer.next);
    });
  }

  typing(data: any) {
    this.socket.emit('typing', data);
  }

  onTyping() {
    return new Observable<any>((observer) => {
      this.socket.on('typing', observer.next);
    });
  }

  stopTyping(data: any) {
    this.socket.emit('stop_typing', data);
  }

  disconnect() {
    this.socket.emit('disconnect');
  }
}