import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { WorkspaceModalComponent } from '../../components/workspace-modal/workspace-modal';
import { MemberModal } from '../../components/member-modal/member-modal';
import { MEMBERS, WORK_SPACES } from '../../constants/data.constant';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.html',
  styleUrl: './workspaces.scss',
  imports: [CommonModule],
})
export class Workspaces {

  workspaces: any = [];
  members: any = [];

  selectedWorkSpace: any = {};
  selectedWorkSpaceMembers: any = [];

  constructor(private modal: ModalService) { }

  ngOnInit() {
    this.workspaces = WORK_SPACES;
    this.members = MEMBERS;
    this.selectWorkspace(this.workspaces[0]);
  }

  selectWorkspace(workspace: any) {
    this.selectedWorkSpace = workspace;
    this.selectedWorkSpaceMembers = this.members.find((member: any) => member.workspace_id === workspace.workspace_id)?.users || [];
    console.log('workspace selected', this.selectedWorkSpace, this.selectedWorkSpaceMembers)
  }

  async createWorkspace() {
    const result = await this.modal.open(WorkspaceModalComponent, {
      mode: 'create'
    });

    if (result) {
      this.workspaces.push({ workspace_id: this.workspaces.length + 1, user_id: 1, name: result.name })
      console.log(result);
    }
  }

  async editWorkspace(event: Event, workspace: any) {
    event.stopPropagation();
    const result = await this.modal.open(WorkspaceModalComponent, {
      mode: 'edit',
      name: workspace.name
    });

    if (result) {
      this.workspaces.find((workspace: any) => workspace.workspace_id === workspace.workspace_id).name = result.name;
      console.log(result);
    }
  }

  async deleteWorkspace(event: Event, workspace: any) {
    event.stopPropagation();
    const result = await this.modal.open(WorkspaceModalComponent, {
      mode: 'delete',
      name: workspace.name
    });

    if (result) {
      this.workspaces.splice(this.workspaces.indexOf(workspace), 1);
      this.selectWorkspace(this.workspaces[0]);
      console.log(result);
    }
  }

  async inviteMember() {
    const result = await this.modal.open(MemberModal, {
      mode: 'invite'
    });

    if (result) {
      this.selectedWorkSpaceMembers.push({ 
        user_id: this.selectedWorkSpaceMembers.length + 1, 
        name: result.name, 
        email: result.email,
        role: result.role,
        status: 'Invited',
        contact: result.contact
      })
      console.log(result);
    }
  }

  async editMember(member: any) {
    const result = await this.modal.open(MemberModal, {
      mode: 'edit',
      name: member.name,
      email: member.email,
      contact: member.contact,
      role: member.role
    });

    if (result) {
      console.log(result);
    }
  }

  async removeMember(member: any) {
    const result = await this.modal.open(MemberModal, {
      mode: 'remove',
      name: member.name
    });

    if (result) {
      console.log(this.selectedWorkSpaceMembers);
      this.selectedWorkSpaceMembers.splice(this.selectedWorkSpaceMembers.indexOf(member), 1);
      console.log(result);
    }
  }
}
