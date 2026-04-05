import { User } from "./user.interface";

export interface Account {
    _id: string,
    userId: User;
    active: boolean,
    isVerified: boolean,
    isBlocked: boolean,
    provider: string,
    loginAttempts: number,
    lockUntil: Date,
    role: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}