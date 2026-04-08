import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Workspace } from "../interfaces/workspace.interface";

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private readonly GroupsApi = 'http://localhost:5000/api/groups/';

    constructor(private http: HttpClient) { }

    createGroup(payload: { name: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.GroupsApi}`, payload).subscribe(
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

    getGroups(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.GroupsApi}`).subscribe(
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

    updateGroup(id: string, payload: Workspace): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.put(`${this.GroupsApi}id/${id}`, payload).subscribe(
                {
                    next: (res: any) => {
                        resolve(res);
                    },
                    error: (err: any) => {
                        console.log(err);
                        reject(err);
                    }
                }
            )
        })
    }

    deleteGroup(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.delete(`${this.GroupsApi}id/${id}`).subscribe(
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