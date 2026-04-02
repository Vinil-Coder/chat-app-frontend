import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from "@angular/router";

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

  logout() {
    console.log('logout');
  }
}
