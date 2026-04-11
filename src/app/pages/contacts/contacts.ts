import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { from, switchMap, tap, finalize, filter, EMPTY, catchError } from 'rxjs';

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
  ) {}

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
        tap(res => this.users.set(res.users || [])),
        finalize(() => this.appState.stopLoader()),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= CREATE CONVERSATION ================= */

  createConversation(user: User) {

    const payload = {
      type: 'direct',
      receiverId: user._id,
      participants: [this.currentUserId, user._id]
    };

    this.conversationService.createConversation(payload)
      .pipe(
        tap(() => {
          this.router.navigate(['/chats'], {
            queryParams: { userId: user._id }
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