import { User } from "./user.interface";

export interface Profile {
    _id: string,
    userId: User;
    gender: string,
    country: string,
    avatar: string,
    bio: string,
    lastSeen: string,
    githubUrl: string,
    linkedInUrl: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}