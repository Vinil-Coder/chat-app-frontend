import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppUiStateService } from "./ui-state.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly AuthApi = 'http://localhost:5000/api/auth';
    private readonly SessionApi = 'http://localhost:5000/api/session';

    constructor(
        private http: HttpClient,
        private appUiStateService: AppUiStateService
    ) { }

    registerUser(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(this.AuthApi + '/register', payload).subscribe(
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

    loginUser(payload: { email: string, password: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(this.AuthApi + '/login', payload).subscribe(
                {
                    next: (res: any) => {
                        sessionStorage.setItem('token', res.token);
                        sessionStorage.setItem('refreshToken', res.refreshToken);
                        sessionStorage.setItem('user', JSON.stringify(res.user));
                        sessionStorage.setItem('userId', res.user._id);
                        sessionStorage.setItem('email', res.user.email);
                        sessionStorage.setItem('name', res.user.name);
                        sessionStorage.setItem('contact', res.user.contact);
                        sessionStorage.setItem('sessionId', res.sessionId);
                        resolve(res);
                    },
                    error: (err: any) => {
                        reject(err);
                    }
                }
            )
        })
    }

    logoutUser(logoutAll: boolean, sessionID?: string): Promise<any> {
        const payload = logoutAll ? { logoutAll } : { logoutAll, sessionID };
        return new Promise((resolve, reject) => {
            this.http.put(this.AuthApi + '/logout', payload).subscribe(
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

    userSessions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.SessionApi + '/').subscribe(
                {
                    next: (res: any) => {
                        const sessions = res.sessions.map((s: any) => ({
                            ...s,
                            isCurrent: s._id === sessionStorage.getItem('sessionId')
                        }));
                        resolve(sessions);
                    },
                    error: (err: any) => {
                        reject(err);
                    }
                }
            )
        })
    }

    changePassword(payload: { email: string, password: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.put(this.AuthApi + '/change-password', payload).subscribe(
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

    getSessionId(): string {
        return sessionStorage.getItem('sessionId') || '';
    }
}