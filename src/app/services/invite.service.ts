import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class InviteService {

    private readonly InviteApi = 'http://localhost:5000/api/invite/';

    constructor(private http: HttpClient) { }

    sendInvite(payload: { email: string, contact: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.InviteApi}sendInvite`, payload).subscribe(
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

    verifyInvite(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.InviteApi}verify/${token}`).subscribe(
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

    registerWithInvite(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.InviteApi}register`, payload).subscribe(
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

    getReceivedInvites(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.InviteApi}received`).subscribe(
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

    getSentInvites(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.InviteApi}sent`).subscribe(
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