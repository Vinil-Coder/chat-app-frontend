import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class InviteService {

    private readonly InviteApi = 'http://localhost:5000/api/invite/';

    constructor(private http: HttpClient) { }

    sendInvite(payload: { email: string, contact: string }): Observable<any> {
        return this.http.post(`${this.InviteApi}sendInvite`, payload);
    }

    verifyInvite(token: string): Observable<any> {
        return this.http.get(`${this.InviteApi}verify/${token}`);
    }

    registerWithInvite(payload: any): Observable<any> {
        return this.http.post(`${this.InviteApi}register`, payload);
    }

    getReceivedInvites(): Observable<any> {
        return this.http.get(`${this.InviteApi}received`);
    }

    getSentInvites(): Observable<any> {
        return this.http.get(`${this.InviteApi}sent`);
    }
}