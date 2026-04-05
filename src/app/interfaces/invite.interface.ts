import { User } from "./user.interface";
import { Workspace } from "./workspace.interface";

export interface Invite {
    _id: string,
    email: string,
    contact: string,
    invitedBy: User,
    workspaceId: Workspace, 
    workspaceName: string,
    status: string,
    role: string,
    inviteToken: string,
    expiresAt: string,
    createdAt: string,
    __v: number
}