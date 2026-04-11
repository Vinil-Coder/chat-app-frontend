import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, computed } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { tap, finalize, catchError, of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AppStateService } from '../../services/appstate.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {

  /* ================= UI STATE ================= */

  activeDropdown: 'profile' | 'notifications' | null = null;
  darkMode = false;

  /* ================= USER ================= */

  userName = computed(() =>
    this.appState.getUser()?.name || ''
  );

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    public appState: AppStateService,
    private socket: SocketService
  ) {}

  /* ================= SIDEBAR ================= */

  toggleSidemenu() {
    this.toggleSidebar.emit();
  }

  /* ================= DROPDOWNS ================= */

  toggleDropdown(type: 'profile' | 'notifications') {
    this.activeDropdown =
      this.activeDropdown === type ? null : type;
  }

  closeDropdowns() {
    this.activeDropdown = null;
  }

  /* ================= DARK MODE ================= */

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  /* ================= LOGOUT ================= */

  logoutUser() {

    this.appState.startLoader();

    this.authService.logoutUser()
      .pipe(
        tap(() => {
          this.socket.disconnect();
          this.appState.setUser(null as any);
          this.router.navigate(['/landing']);
        }),
        finalize(() => this.appState.stopLoader()),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= ERROR ================= */

  private handleError(err: any) {
    this.appState.error(err?.error?.message || 'Logout failed');
    return of(null);
  }
}