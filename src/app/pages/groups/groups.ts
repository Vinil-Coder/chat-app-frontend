import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, switchMap, filter, tap, from, EMPTY, catchError } from 'rxjs';

import { ModalService } from '../../services/modal.service';
import { WorkspaceModalComponent } from '../../components/workspace-modal/workspace-modal';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AppStateService } from '../../services/appstate.service';

import { Workspace } from '../../interfaces/workspace.interface';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
})
export class Groups implements OnInit {

  groups = signal<Workspace[]>([]);
  users = signal<User[]>([]);

  constructor(
    private modal: ModalService,
    private groupService: GroupService,
    private userService: UserService,
    public appState: AppStateService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  /* ================= INIT ================= */

  loadInitialData() {
    this.appState.startLoader();

    this.userService.getRegisteredUsers()
      .pipe(
        tap(res => this.users.set(res.users || [])),
        switchMap(() => this.groupService.getGroups()),
        tap(res => this.groups.set(res.groups || [])),
        finalize(() => this.appState.stopLoader())
      )
      .subscribe({
        error: err => this.handleError(err)
      });
  }

  /* ================= CREATE ================= */

  createGroup() {
    from(this.modal.open(WorkspaceModalComponent, {
      mode: 'create',
      users: this.users()
    }))
      .pipe(
        filter(result => !!result),
        tap(() => this.appState.startLoader()),
        switchMap(result =>
          this.groupService.createGroup(result).pipe(
            switchMap(() => this.groupService.getGroups()),
            finalize(() => this.appState.stopLoader())
          )
        ),
        tap(res => {
          this.groups.set(res.groups || []);
          this.appState.success('Group created successfully');
        }),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= EDIT ================= */

  editGroup(event: Event, group: Workspace) {
    event.stopPropagation();

    from(this.modal.open(WorkspaceModalComponent, {
      mode: 'edit',
      group,
      users: this.users()
    }))
      .pipe(
        filter(result => !!result),
        tap(() => this.appState.startLoader()),
        switchMap(result =>
          this.groupService.updateGroup(group._id, result).pipe(
            switchMap(() => this.groupService.getGroups()),
            finalize(() => this.appState.stopLoader())
          )
        ),
        tap(res => {
          this.groups.set(res.groups || []);
          this.appState.success('Group updated successfully');
        }),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= DELETE ================= */

  deleteGroup(event: Event, group: Workspace) {
    event.stopPropagation();

    from(this.modal.open(WorkspaceModalComponent, {
      mode: 'delete',
      group
    }))
      .pipe(
        filter(result => !!result),
        tap(() => this.appState.startLoader()),
        switchMap(() =>
          this.groupService.deleteGroup(group._id).pipe(
            finalize(() => this.appState.stopLoader())
          )
        ),
        tap(() => {
          this.groups.set(
            this.groups().filter(g => g._id !== group._id)
          );
          this.appState.success('Group deleted successfully');
        }),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= DETAILS ================= */

  selectGroup(event: Event, group: Workspace) {
    event.stopPropagation();

    this.modal.open(WorkspaceModalComponent, {
      mode: 'details',
      group
    });
  }

  /* ================= COMMON ================= */

  private handleError(err: any) {
    this.appState.error(err?.error?.message || 'Something went wrong');
    return EMPTY;
  }
}