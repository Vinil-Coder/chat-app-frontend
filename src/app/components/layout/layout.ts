import { Component } from '@angular/core';
import { Sidemenu } from '../sidemenu/sidemenu';
import { TopBar } from '../top-bar/top-bar';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Sidemenu, TopBar, RouterModule, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
