import { Component, signal } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { WorkspaceModalComponent } from '../../components/workspace-modal/workspace-modal';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { Workspace } from '../../interfaces/workspace.interface';
import { AppUiStateService, ToastrType } from '../../services/ui-state.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
  imports: [CommonModule],
})
export class Groups {

  groups = signal<Workspace[]>([]);
  users = signal<User[]>([]);
  members = signal([]);

  selectedGroup = signal<Workspace>({} as Workspace);
  selectedGroupMembers = signal([]);

  constructor(
    private modal: ModalService,
    private groupService: GroupService,
    private usersService: UserService,
    public appUiStateService: AppUiStateService
  ) { }

  async ngOnInit() {
    this.getGroups();
     await Promise.all([
      this.loadUsers(),
      this.getGroups()
    ]);
  }

  async loadUsers() {
    try {
      this.appUiStateService.startLoader();

      const res = await this.usersService.getRegisteredUsers();

      this.users.set(res.users || []);

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get users',
        ToastrType.ERROR
      );
    }
  }

  async getGroups() {
    try {
      this.appUiStateService.startLoader();

      const res = await this.groupService.getGroups();

      this.groups.set(res.groups || []);

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get groups',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async createGroup() {
    try {
      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'create',
        users: this.users()
      });

      if (result) {
        this.appUiStateService.startLoader();

        const res = await this.groupService.createGroup(result);

        this.getGroups();

        this.appUiStateService.showToastr(
          res.message || 'Group created successfully',
          ToastrType.SUCCESS
        );

      }
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to create group',
        ToastrType.ERROR
      );
    }
  }

  async editGroup(event: Event, workspace: Workspace) {
    event.stopPropagation();
    try {

      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'edit',
        group: workspace,
        users: this.users()
      });

      if (!result) return;

      this.appUiStateService.startLoader();

      const res = await this.groupService.updateGroup(workspace._id, result);

      this.getGroups();

      this.appUiStateService.showToastr(
        res.message || 'Group updated successfully',
        ToastrType.SUCCESS
      );

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to update group',
        ToastrType.ERROR
      );
    }
  }

  async deleteGroup(event: Event, workspace: Workspace) {
    event.stopPropagation();

    try {

      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'delete',
        group: workspace
      });

      if (!result) return;

      this.appUiStateService.startLoader();

      const res = await this.groupService.deleteGroup(workspace._id);

      this.groups.set(
        this.groups().filter(w => w._id !== workspace._id)
      );

       this.appUiStateService.showToastr(
        res.message || 'Group deleted successfully',
        ToastrType.SUCCESS
      );

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to delete group',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async selectGroup(event: Event, group: Workspace) {
    event.stopPropagation();

    await this.modal.open(WorkspaceModalComponent, {
      mode: 'details',
      group
    })
  }
}
