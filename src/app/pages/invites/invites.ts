import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteService } from '../../services/invite.service';
import { AppUiStateService, ToastrType } from '../../services/ui-state.service';
import { Invite } from '../../interfaces/invite.interface';
import { MemberModal } from '../../components/member-modal/member-modal';
import { ModalService } from '../../services/modal.service';
import { Workspace } from '../../interfaces/workspace.interface';
import { WorkSpaceService } from '../../services/workspace.service';
import { WorkspaceModalComponent } from '../../components/workspace-modal/workspace-modal';

@Component({
  selector: 'app-invites',
  imports: [CommonModule],
  templateUrl: './invites.html',
  styleUrl: './invites.scss',
})
export class Invites {

  activeTab = 'sent';
  receivedInvites = signal<Invite[]>([]);
  sentInvites = signal<Invite[]>([]);
  workspaces = signal<Workspace[]>([]);

  constructor(
    private inviteService: InviteService,
    private appUiStateService: AppUiStateService,
    private workspaceService: WorkSpaceService,
    private modal: ModalService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.appUiStateService.startLoader();

    try {
      await Promise.all([
        this.getInvites(),
        this.getWorkSpaces()
      ]);
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async getWorkSpaces() {
    try {
      const res = await this.workspaceService.getWorkspaces();
      this.workspaces.set(res.workspaces || []);

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get workspaces',
        ToastrType.ERROR
      );
    }
  }

  async getInvites() {
    try {
      const receivedInvites = await this.inviteService.getReceivedInvites();
      this.receivedInvites.set(receivedInvites.invites);

      const sentInvites = await this.inviteService.getSentInvites();
      this.sentInvites.set(sentInvites.invites);

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get invites',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async inviteMember() {
    try {
      const result = await this.modal.open(MemberModal, {
        mode: 'invite',
        workspaces: this.workspaces()
      });

      if (!result) return;

      this.appUiStateService.startLoader();

      const res = await this.inviteService.sendInvite(result);

      await this.getInvites();
      this.activeTab = 'sent';

      this.appUiStateService.showToastr(
        res.message || 'Member invited successfully',
        ToastrType.SUCCESS
      );

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to invite member',
        ToastrType.ERROR
      );
    }
  }

  async createWorkspace() {
    try {
      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'create'
      });

      if (!result) return;

      this.appUiStateService.startLoader();

      const res = await this.workspaceService.createWorkspace(result);

      await this.getWorkSpaces();

      this.appUiStateService.showToastr(
        res.message || 'Workspace created successfully',
        ToastrType.SUCCESS
      );

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to create workspace',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async updateInviteStatus(inviteId: string, status: string) {
    this.appUiStateService.startLoader();

    try {
      await this.inviteService.updateInviteStatus(inviteId, status);

      await this.getInvites();

      this.appUiStateService.showToastr(
        'Invite accepted successfully',
        ToastrType.SUCCESS
      );
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to accept invite',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }
}
