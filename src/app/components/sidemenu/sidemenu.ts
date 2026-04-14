import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidemenu.html',
  styleUrl: './sidemenu.scss',
})
export class Sidemenu {

  workspaceDropdownOpen = false;
  selectedWorkspace = 'Select Workspace';
  isMobile: boolean = window.innerWidth <= 1024;
  
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 1024;
    });
    console.log(this.isMobile);
  }

  closeSidenav() {
    this.toggleSidebar.emit();
  }
}
