import { Component, signal } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { WorkspaceModalComponent } from '../../components/workspace-modal/workspace-modal';
import { MemberModal } from '../../components/member-modal/member-modal';
import { CommonModule } from '@angular/common';
import { WorkSpaceService } from '../../services/workspace.service';
import { Workspace } from '../../interfaces/workspace.interface';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.html',
  styleUrl: './workspaces.scss',
  imports: [CommonModule],
})
export class Workspaces {

  workspaces = signal<Workspace[]>([]);
  members = signal([]);

  selectedWorkspace = signal<Workspace>({
    _id: '',
    userID: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    __v: 0
  });
  selectedWorkspaceMembers = signal([]);

  constructor(
    private modal: ModalService, 
    private workspaceService: WorkSpaceService
  ) { }

  ngOnInit() {
    this.getWorkSpaces();
  }

  async getWorkSpaces() {
    try {
      this.workspaces.set((await this.workspaceService.getWorkspaces()).workspaces);
      this.selectWorkspace(this.workspaces()?.[0] || {});
    } catch (error) {
      console.log(error);
    }
  }

  selectWorkspace(workspace: any) {
    this.selectedWorkspace.set(workspace);
    this.selectedWorkspaceMembers.set(this.members().find((member: any) => member.workspace_id === workspace._id) || []);
  }

  async createWorkspace() {
    const result = await this.modal.open(WorkspaceModalComponent, {
      mode: 'create'
    });

    if (result) {
      const res = await this.workspaceService.createWorkspace({ name: result.name });
      this.workspaces.set([...this.workspaces(), res.workspace]);
      this.selectWorkspace(res.workspace);
    }
  }

  async editWorkspace(event: Event, workspace: any) {
    event.stopPropagation();
    const result = await this.modal.open(WorkspaceModalComponent, {
      mode: 'edit',
      name: workspace.name
    });

    if (result) {
      await this.workspaceService.updateWorkspace({ id: workspace._id, name: result.name });
      this.workspaces.set([...this.workspaces(), this.workspaces()[this.workspaces().indexOf(workspace)].name = result.name]);
    }
  }

  async deleteWorkspace(event: Event, workspace: any) {
    event.stopPropagation();
    const result = await this.modal.open(WorkspaceModalComponent, {
      mode: 'delete',
      name: workspace.name
    });

    if (result) {
      await this.workspaceService.deleteWorkspace(workspace._id);
      this.workspaces.set(this.workspaces().slice(0, this.workspaces().indexOf(workspace)));
      console.log(result);
    }
  }

  async inviteMember() {
    // const result = await this.modal.open(MemberModal, {
    //   mode: 'invite'
    // });

    // if (result) {
    //   this.selectedWorkspaceMembers.push({ 
    //     user_id: this.selectedWorkspace.length + 1, 
    //     name: result.name, 
    //     email: result.email,
    //     role: result.role,
    //     status: 'Invited',
    //     contact: result.contact
    //   })
    //   console.log(result);
    // }
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
      // console.log(this.selectedWorkspace);
      // this.sele.splice(this.selectedWorkspace.indexOf(member), 1);
      // console.log(result);
    }
  }
}
