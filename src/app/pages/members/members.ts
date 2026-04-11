import { Component, signal } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { Member } from '../../interfaces/member.interface';
import { ModalService } from '../../services/modal.service';
import { InviteService } from '../../services/invite.service';
import { MemberModal } from '../../components/member-modal/member-modal';
import { GroupService } from '../../services/group.service';
import { Workspace } from '../../interfaces/workspace.interface';
import { Router } from '@angular/router';
import { WorkspaceModalComponent } from '../../components/workspace-modal/workspace-modal';
import { AppStateService } from '../../services/appstate.service';

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
    private appState: AppStateService,
    private modal: ModalService,
    private inviteService: InviteService,
    private groupService: GroupService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.appState.startLoader();

    try {
      await Promise.all([
        this.getWorkSpaces(),
        this.getMembers()
      ]);
    } finally {
      this.appState.stopLoader();
    }
  }

  async getWorkSpaces() {
    try {
      const res = await this.groupService.getGroups();

      this.workspaces.set(res.workspaces || []);
    } catch (err: any) {
    } finally {
      this.appState.stopLoader();
    }
  }

  async getMembers() {
    try {
      const res = await this.membersService.getMembers();

      this.members.set(res.members);

    } catch (err: any) {
    }
  }

  async inviteMember() {
    try {
      const result = await this.modal.open(MemberModal, {
        mode: 'invite',
        workspaces: this.workspaces()
      });

      if (result) {

        this.appState.startLoader();

        const res = await this.inviteService.sendInvite(result);

        this.appState.success(
          res.message || 'Member invited successfully'
        );

        this.router.navigate(['/invites']);
      }
    } catch (err: any) {
    } finally {
      this.appState.stopLoader();
    }
  }

  async createWorkspace() {
    try {
      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'create'
      });

      if (!result) return;

      this.appState.startLoader();

      const res = await this.groupService.createGroup(result);

      await this.getWorkSpaces();

      this.appState.success(
        res.message || 'Workspace created successfully'
      );

    } catch (err: any) {
    } finally {
      this.appState.stopLoader();
    }
  }
}
