import { Component, HostListener } from '@angular/core';
import { Sidemenu } from '../sidemenu/sidemenu';
import { TopBar } from '../top-bar/top-bar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ModalHost } from '../modal-host/modal-host';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/appstate.service';

@Component({
  selector: 'app-layout',
  imports: [Sidemenu, TopBar, RouterModule, RouterOutlet, ModalHost, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

  isSidebarHidden = false;
  isContentFull = false;
  isMobile = false;

  constructor(
    public app: AppStateService
  ) { }

  ngOnInit() {
    this.checkScreen();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 1024;

    if (this.isMobile) {
      this.isSidebarHidden = true;
      this.isContentFull = true;
      const sideBar = document.getElementById('side-bar');
      if (sideBar) {
        sideBar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.05)'
      }
    } else {
      this.isSidebarHidden = false;
      this.isContentFull = false;
       const sideBar = document.getElementById('side-bar');
      if (sideBar) {
        sideBar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.05)'
      }
    }
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
    this.isContentFull = this.isMobile ? true : !this.isContentFull;
  }
}
