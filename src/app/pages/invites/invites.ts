import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteService } from '../../services/invite.service';
import { Invite } from '../../interfaces/invite.interface';
import { AppStateService } from '../../services/appstate.service';

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

  constructor(
    private inviteService: InviteService,
    private appState: AppStateService,
  ) { }

  ngOnInit() {
    this.getInvites();
  }

  async getInvites() {
    try {
      const receivedInvites = await this.inviteService.getReceivedInvites();
      this.receivedInvites.set(receivedInvites.invites);

      const sentInvites = await this.inviteService.getSentInvites();
      this.sentInvites.set(sentInvites.invites);

    } catch (err: any) {
     
    } finally {
      this.appState.stopLoader();
    }
  }
}
