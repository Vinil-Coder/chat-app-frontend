import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink],
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
