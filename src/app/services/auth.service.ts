import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly AuthApi = 'http://localhost:5000/api/auth';

    constructor(private http: HttpClient) {}

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
                        localStorage.setItem('token', res.token);
                        localStorage.setItem('refreshToken', res.refreshToken);
                        localStorage.setItem('userId', res.user._id);
                        resolve(res);
                    },
                    error: (err: any) => {
                        reject(err);
                    }
                }
            )
        })
    }

    logoutUser(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(this.AuthApi + '/logout', { id: userId }).subscribe(
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
}