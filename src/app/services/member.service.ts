import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Member } from "../interfaces/member.interface";

@Injectable({
    providedIn: 'root'
})
export class MemberService {

    private readonly WorkspaceMembersApi = 'http://localhost:5000/api/workspace-members/';

    constructor(private http: HttpClient) { }

    getMembers(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.WorkspaceMembersApi}`).subscribe(
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