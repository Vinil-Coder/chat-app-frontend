import { inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AppStateService } from './appstate.service';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {

  private socket!: Socket;

  private destroy$ = new Subject<void>();

  /* ================= CONNECT ================= */

  connect() {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.socket.emit("join_user");
    });
  }

  isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }

  /* ================= GENERIC LISTENER ================= */

  private listen<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {

      const handler = (data: T) => observer.next(data);

      this.socket.on(event, handler);

      return () => {
        this.socket.off(event, handler);
      };
    });
  }

  /* ================= USER ================= */

  onUserOnline() {
    return this.listen<string>('user_online');
  }

  onUserOffline() {
    return this.listen<string>('user_offline');
  }

  /* ================= CONVERSATION ================= */

  joinConversation(conversationId: string) {
    this.socket.emit('join_conversation', { conversationId });
  }

  /* ================= MESSAGE ================= */

  sendMessage(data: any) {
    this.socket.emit('send_message', data);
  }

  onMessageReceived() {
    return this.listen<any>('receive_message');
  }

  /* ================= DELIVERY ================= */

  deliverMessage(messageId: string) {
    this.socket.emit('deliver_message', messageId);
  }

  onMessageDelivered() {
    return this.listen<any>('message_delivered');
  }

  /* ================= READ ================= */

  readMessage(conversationId: string) {
    this.socket.emit('read_message', conversationId);
  }

  onMessagesRead() {
    return this.listen<any>('messages_read');
  }

  /* ================= TYPING ================= */

  typingStart(conversationId: string) {
    this.socket.emit('typing_starts', conversationId);
  }

  typingStop(conversationId: string) {
    this.socket.emit('typing_stops', conversationId);
  }

  onTypingStatus() {
    return this.listen<any>('is_typing');
  }

}