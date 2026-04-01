import { Component } from '@angular/core';
import { Sidemenu } from '../sidemenu/sidemenu';
import { TopBar } from '../top-bar/top-bar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ModalHost } from '../modal-host/modal-host';

@Component({
  selector: 'app-layout',
  imports: [Sidemenu, TopBar, RouterModule, RouterOutlet, ModalHost],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
