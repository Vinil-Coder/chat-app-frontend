import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
}
