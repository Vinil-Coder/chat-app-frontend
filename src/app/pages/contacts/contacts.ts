import { Component, signal } from '@angular/core';
import { AppUiStateService, ToastrType } from '../../services/ui-state.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../../services/chat.service';
import { ModalService } from '../../services/modal.service';
import { MemberModal } from '../../components/member-modal/member-modal';
import { InviteService } from '../../services/invite.service';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {

  users = signal<User[]>([]);
  currentUserId = '';

  constructor(
    private appUiStateService: AppUiStateService,
    private userService: UserService,
    private conversationService: ConversationService,
    private inviteService: InviteService,
    private modal: ModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUserId = this.appUiStateService.currentUser()._id;
    this.loadData();
  }

  async loadData() {
    this.appUiStateService.startLoader();

    try {
      await Promise.all([
        this.getUsers()
      ]);
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async getUsers() {
    try {
      const res = await this.userService.getRegisteredUsers();
      this.users.set(res.users || []);
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get users',
        ToastrType.ERROR
      );
    }
  }

  async createConversation(user: User) {
    try {
      const paylod = {
        type: 'direct',
        receiverId: user._id,
        participants: [this.currentUserId, user._id]
      }
      const res = await this.conversationService.createConversation(paylod);

      this.router.navigate(['/chats'], {
        queryParams: {
          userId: user._id
        }
      });
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get users',
        ToastrType.ERROR
      );
    }
  }

  async inviteMember() {
    const result = await this.modal.open(MemberModal);
    if(!result) return;

    try {
      this.appUiStateService.startLoader();

      const res = await this.inviteService.sendInvite(result);

      this.appUiStateService.showToastr(
        'Member invited successfully',
        ToastrType.SUCCESS
      );
      
      this.router.navigate(['/invites']);
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to invite member',
        ToastrType.ERROR
      )
    }
  }
}
