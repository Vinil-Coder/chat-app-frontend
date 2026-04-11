import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket!: Socket;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
  }

  isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  joinConversation(conversationId: string) {
    this.socket.emit('join_conversation', { conversationId });
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

  onTypingStart(conversationId: string) {
    this.socket.emit("typing_starts", { conversationId });
  }

  onTypingStop(conversationId: string) {
    this.socket.emit("typing_stops", { conversationId });
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

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}