import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly AuthApi = 'http://localhost:5000/api/auth';

    constructor(private http: HttpClient) { }

    registerUser(payload: any): Observable<any> {
        return this.http.post(`${this.AuthApi}/register`, payload);
    }

    loginUser(payload: { email: string, password: string }): Observable<any> {
        return this.http.post(`${this.AuthApi}/login`, payload);
    }

    isUserAuthenticated(): Observable<any> {
        return this.http.get(`${this.AuthApi}/me`);
    }

    logoutUser(): Observable<any> {
        return this.http.get(`${this.AuthApi}/logout`);
    }

    changePassword(payload: { email: string, password: string }): Observable<any> {
        return this.http.put(`${this.AuthApi}/change-password`, payload);
    }
}