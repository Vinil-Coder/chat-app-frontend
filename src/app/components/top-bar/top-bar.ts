import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '../../services/auth.service';

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

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

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

  async logout() {
    try {
      await this.authService.logoutUser(localStorage.getItem('userId') as string);
      this.router.navigate(['/landing']);
    } catch (error) {
      console.log(error);
    }
  }
}
