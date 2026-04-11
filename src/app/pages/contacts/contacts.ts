import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../../services/chat.service';
import { ModalService } from '../../services/modal.service';
import { MemberModal } from '../../components/member-modal/member-modal';
import { InviteService } from '../../services/invite.service';
import { AppStateService } from '../../services/appstate.service';

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
    private appState: AppStateService,
    private userService: UserService,
    private conversationService: ConversationService,
    private inviteService: InviteService,
    private modal: ModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUserId = this.appState.getUser()?._id || '';
    this.loadData();
  }

  async loadData() {
    this.appState.startLoader();

    try {
      await Promise.all([
        this.getUsers()
      ]);
    } finally {
      this.appState.stopLoader();
    }
  }

  async getUsers() {
    try {
      const res = await this.userService.getRegisteredUsers();
      this.users.set(res.users || []);
    } catch (err: any) {
      this.appState.error(err?.error?.message || 'Something went wrong')
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
      this.appState.error(err?.error?.message || 'Something went wrong')
    }
  }

  async inviteMember() {
    const result = await this.modal.open(MemberModal);
    if(!result) return;

    try {
      this.appState.startLoader();

      const res = await this.inviteService.sendInvite(result);

      this.appState.success(
        'Member invited successfully'
      );
      
      this.router.navigate(['/invites']);
    } catch (err: any) {
            this.appState.error(err?.error?.message || 'Something went wrong')
    }
  }
}
