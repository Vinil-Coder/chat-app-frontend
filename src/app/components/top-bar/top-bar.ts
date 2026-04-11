import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { AppStateService } from '../../services/appstate.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {

  showProfile: boolean = false;
  showNotifications: boolean = false;
  showSettings: boolean = false;
  darkMode: boolean = false;

  userName = signal<String>(sessionStorage.getItem('name') || '');

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    public appState: AppStateService
  ) {}

  toggleSidemenu() {
    this.toggleSidebar.emit();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  async logoutUser() {
    
    await firstValueFrom(this.authService.logoutUser());

    this.router.navigate(['/landing']);
  }
}
