import { Account } from "./account.interface";
import { Profile } from "./profile.interface";

export interface User {
    _id: string,
    name: string
    email: string,
    contact: string,
    password: string,
    status: string,
    profileId: Profile | string,
    accountId: Account | string,
    createdAt: string,
    updatedAt: string,
    __v: number
}