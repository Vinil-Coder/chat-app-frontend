import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Workspace } from "../interfaces/workspace.interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private readonly GroupsApi = 'http://localhost:5000/api/groups/';

    constructor(private http: HttpClient) { }

    createGroup(payload: { name: string }): Observable<any> {
        return this.http.post(`${this.GroupsApi}`, payload);
    }

    getGroups(): Observable<any> {
        return this.http.get(`${this.GroupsApi}`);
    }

    updateGroup(id: string, payload: Workspace): Observable<any> {
        return this.http.put(`${this.GroupsApi}id/${id}`, payload);
    }

    deleteGroup(id: string): Observable<any> {
        return this.http.delete(`${this.GroupsApi}id/${id}`);
    }
}