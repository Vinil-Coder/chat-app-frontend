import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private readonly ChatApi = 'http://localhost:5000/api/chat/';

  constructor(private http: HttpClient) { }

  getConversations(): Observable<any> {
    return this.http.get(`${this.ChatApi}conversations`);
  }

  createConversation(payload: any): Observable<any> {
    return this.http.post(`${this.ChatApi}`, payload);
  }

  getMessages(conversationId: string): Observable<any> {
    return this.http.get(`${this.ChatApi}messages/${conversationId}`);
  }

}