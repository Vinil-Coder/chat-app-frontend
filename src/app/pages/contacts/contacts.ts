import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { from, switchMap, tap, finalize, filter, EMPTY, catchError, map } from 'rxjs';

import { UserService } from '../../services/user.service';
import { ConversationService } from '../../services/conversation.service';
import { InviteService } from '../../services/invite.service';
import { ModalService } from '../../services/modal.service';
import { AppStateService } from '../../services/appstate.service';

import { MemberModal } from '../../components/member-modal/member-modal';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements OnInit {

  users = signal<User[]>([]);
  currentUserId = '';

  constructor(
    private appState: AppStateService,
    private userService: UserService,
    private conversationService: ConversationService,
    private inviteService: InviteService,
    private modal: ModalService,
    private router: Router
  ) { }

  /* ================= INIT ================= */

  ngOnInit() {
    this.currentUserId = this.appState.getUser()?._id || '';
    this.loadUsers();
  }

  /* ================= LOAD USERS ================= */

  loadUsers() {
    this.appState.startLoader();

    this.userService.getRegisteredUsers()
      .pipe(
        tap(res => this.users.set(res.users)),
        map(res => this.mapRegisteredUsers()),
        finalize(() => this.appState.stopLoader()),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  mapRegisteredUsers() {
    this.users.update(users =>
      users.map(user =>
        this.appState.onlineUsers().includes(user._id)
          ? { ...user, isOnline: true }
          : { ...user, isOnline: false }
      )
    )
  }

  /* ================= CREATE CONVERSATION ================= */

  createConversation(user: User) {

    this.conversationService.createConversation(
      {
        type: 'direct',
        participants: [this.appState.getUser()?.id, user._id]
      }
    )
      .pipe(
        tap((res: any) => {
          this.router.navigate(['/chats'], {
            queryParams: { conversationId: res.conversation._id }
          });
        }),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= INVITE MEMBER ================= */

  inviteMember() {

    from(this.modal.open(MemberModal))
      .pipe(
        filter(Boolean),
        tap(() => this.appState.startLoader()),
        switchMap(result =>
          this.inviteService.sendInvite(result).pipe(
            finalize(() => this.appState.stopLoader())
          )
        ),
        tap(() => {
          this.appState.success('Member invited successfully');
          this.router.navigate(['/invites']);
        }),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= COMMON ================= */

  private handleError(err: any) {
    this.appState.error(err?.error?.message || 'Something went wrong');
    return EMPTY;
  }
}