import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class WorkSpaceService {

    private readonly WorkSpaceApi = 'http://localhost:5000/api/workspace/';

    constructor(private http: HttpClient) { }

    createWorkspace(payload: { name: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.WorkSpaceApi}`, payload).subscribe(
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

    getWorkspaces(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.WorkSpaceApi}`).subscribe(
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

    updateWorkspace(payload: { id: string, name: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.put(`${this.WorkSpaceApi}`, payload).subscribe(
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

    deleteWorkspace(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.delete(`${this.WorkSpaceApi}id/${id}`).subscribe(
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