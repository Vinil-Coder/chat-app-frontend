import { Invite } from "./invite.interface";
import { User } from "./user.interface";
import { Workspace } from "./workspace.interface";

export interface Member {
    _id: string,
    workspaceID: Workspace,
    userId: User,
    role: string,
    joinedAt: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}