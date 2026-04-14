import { Component, HostListener, OnInit } from '@angular/core';
import { Sidemenu } from '../sidemenu/sidemenu';
import { TopBar } from '../top-bar/top-bar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ModalHost } from '../modal-host/modal-host';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/appstate.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Sidemenu, TopBar, RouterModule, RouterOutlet, ModalHost, CommonModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout implements OnInit {

  isSidebarHidden = false;
  isMobile = false;

  constructor(public app: AppStateService) {}

  ngOnInit() {
    this.updateView();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateView();
  }

  private updateView() {
    const mobile = window.innerWidth <= 1024;

    if (this.isMobile !== mobile) {
      this.isMobile = mobile;
      this.isSidebarHidden = mobile;
    }
  }

  get isContentFull(): boolean {
    return this.isMobile || this.isSidebarHidden;
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}