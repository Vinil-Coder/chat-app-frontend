import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly UserApi = 'http://localhost:5000/api/user/';

    constructor(private http: HttpClient) { }

    getRegisteredUsers(): Observable<any> {
        return this.http.get(`${this.UserApi}registered-users`);
    }
}