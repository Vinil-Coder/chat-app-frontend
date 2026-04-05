import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { SESSIONS } from '../../constants/data.constant';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {

  activeTab = 'sessions';
  sessions = signal<any[]>([]);
  currentSessionId: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.currentSessionId = this.authService.getSessionId();
    this.getSessions();
  }

  async getSessions() {
    this.sessions.set([]);
    this.sessions.set(await this.authService.userSessions())
  }

  async logoutAll() {
    await this.authService.logoutUser(true);
    this.onUserLogout();
  }

  async logoutSession(sessionId: string) {
    await this.authService.logoutUser(false, sessionId);
    if (this.currentSessionId === sessionId) {
      this.onUserLogout();
    } else {
      this.getSessions();
    }
  }

  onUserLogout() {
    sessionStorage.clear();
    this.router.navigate(['/landing']);
  }
}
