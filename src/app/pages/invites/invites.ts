import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, finalize, tap, catchError, EMPTY } from 'rxjs';

import { InviteService } from '../../services/invite.service';
import { AppStateService } from '../../services/appstate.service';
import { Invite } from '../../interfaces/invite.interface';

@Component({
  selector: 'app-invites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invites.html',
  styleUrl: './invites.scss',
})
export class Invites implements OnInit {

  activeTab = 'sent';

  receivedInvites = signal<Invite[]>([]);
  sentInvites = signal<Invite[]>([]);

  constructor(
    private inviteService: InviteService,
    private appState: AppStateService,
  ) {}

  /* ================= INIT ================= */

  ngOnInit() {
    this.loadInvites();
  }

  /* ================= LOAD INVITES ================= */

  loadInvites() {
    this.appState.startLoader();

    forkJoin({
      received: this.inviteService.getReceivedInvites(),
      sent: this.inviteService.getSentInvites()
    })
      .pipe(
        tap(({ received, sent }) => {
          this.receivedInvites.set(received.invites || []);
          this.sentInvites.set(sent.invites || []);
        }),
        finalize(() => this.appState.stopLoader()),
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