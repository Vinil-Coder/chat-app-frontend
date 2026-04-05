import { User } from "./user.interface";

export interface Workspace {
    _id: string,
    name: string,
    description: string,
    createdBy: User | string,
    createdAt: string,
    updatedAt: string,
    __v: number
}