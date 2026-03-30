import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {

  toggleSidemenu() {
    document.querySelector('#side-menu')?.classList.toggle('sidemenu--hide');
    document.querySelector('#top-bar')?.classList.toggle('top-bar--full-width');
    document.querySelector('.main-content')?.classList.toggle('full-screen');
    document.querySelector('.close-icon')?.classList.toggle('show');
  }
}
