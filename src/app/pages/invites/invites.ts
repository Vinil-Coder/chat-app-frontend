import { Component } from '@angular/core';
import { GROUPS } from '../../constants/data.constant';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invites',
  imports: [CommonModule],
  templateUrl: './invites.html',
  styleUrl: './invites.scss',
})
export class Invites {

  groups: any = [];

  ngOnInit() {
    this.groups = GROUPS;
  }

  viewMembers(group: any) {

  }

  acceptInvitation(group: any) {

  }

  rejectInvitation(group: any) {

  }
}
