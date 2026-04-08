import { User } from "./user.interface";
import { Workspace } from "./workspace.interface";

export interface Invite {
    _id: string,
    email: string,
    contact: string,
    invitedBy: User;
    status: string,
    inviteToken: string,
    expiresAt: string,
    createdAt: string,
    __v: number
}