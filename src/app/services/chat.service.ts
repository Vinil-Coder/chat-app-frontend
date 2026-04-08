import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private readonly ChatApi = 'http://localhost:5000/api/chat/';

  constructor(private http: HttpClient) { }

  getConversations(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.ChatApi}conversations`).subscribe(
        {
          next: (res: any) => {
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          }
        }
      )
    })
  }

  createConversation(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.ChatApi}`, payload).subscribe(
        {
          next: (res: any) => {
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          }
        }
      )
    })
  }

  getMessages(conversationId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.ChatApi}messages/${conversationId}`).subscribe(
        {
          next: (res: any) => {
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          }
        }
      )
    })
  }

}