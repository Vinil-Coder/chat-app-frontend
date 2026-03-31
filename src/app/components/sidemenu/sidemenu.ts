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

  workspaces = [
    { name: 'Workspace 1', id: 1 },
    { name: 'Workspace 2', id: 2 },
    { name: 'Workspace 3', id: 4 },
    { name: 'Workspace 4', id: 5 },
    { name: 'Workspace 5', id: 6 },
    { name: 'Workspace 6', id: 7 },
    { name: 'Workspace 7', id: 8 },
    { name: 'Workspace 8', id: 9 },
    { name: 'Workspace 9', id: 10 },
    { name: 'Workspace 10', id: 11 },
  ];

  toggleWorkspaceDropdown() {
    this.workspaceDropdownOpen = !this.workspaceDropdownOpen;
    document.querySelector('.arrow')?.classList.toggle('rotate');
  }

  selectWorkspace(workspace: any, event: Event) {
    event.stopPropagation();
    this.selectedWorkspace = workspace.name;
    this.toggleWorkspaceDropdown();
  }
}
