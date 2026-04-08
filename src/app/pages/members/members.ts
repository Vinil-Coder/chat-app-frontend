import { Component, signal } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { AppUiStateService, ToastrType } from '../../services/ui-state.service';
import { Member } from '../../interfaces/member.interface';
import { ModalService } from '../../services/modal.service';
import { InviteService } from '../../services/invite.service';
import { MemberModal } from '../../components/member-modal/member-modal';
import { GroupService } from '../../services/group.service';
import { Workspace } from '../../interfaces/workspace.interface';
import { Router } from '@angular/router';
import { WorkspaceModalComponent } from '../../components/workspace-modal/workspace-modal';

@Component({
  selector: 'app-members',
  imports: [],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members {

  members = signal<Member[]>([]);
  workspaces = signal<Workspace[]>([]);

  constructor(
    private membersService: MemberService,
    private appUiStateService: AppUiStateService,
    private modal: ModalService,
    private inviteService: InviteService,
    private groupService: GroupService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.appUiStateService.startLoader();

    try {
      await Promise.all([
        this.getWorkSpaces(),
        this.getMembers()
      ]);
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async getWorkSpaces() {
    try {
      const res = await this.groupService.getGroups();

      this.workspaces.set(res.workspaces || []);
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get workspaces',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async getMembers() {
    try {
      const res = await this.membersService.getMembers();

      this.members.set(res.members);

    } catch (err: any) {
      console.log(err);
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get members',
        ToastrType.ERROR
      );
    }
  }

  async inviteMember() {
    try {
      const result = await this.modal.open(MemberModal, {
        mode: 'invite',
        workspaces: this.workspaces()
      });

      if (result) {

        this.appUiStateService.startLoader();

        const res = await this.inviteService.sendInvite(result);

        this.appUiStateService.showToastr(
          res.message || 'Member invited successfully',
          ToastrType.SUCCESS
        );

        this.router.navigate(['/invites']);
      }
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to create workspace',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async createWorkspace() {
    try {
      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'create'
      });

      if (!result) return;

      this.appUiStateService.startLoader();

      const res = await this.groupService.createGroup(result);

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
}
