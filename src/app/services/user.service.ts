import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly UserApi = 'http://localhost:5000/api/user/';

    constructor(private http: HttpClient) { }

    getUserProfile(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.UserApi).subscribe(
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