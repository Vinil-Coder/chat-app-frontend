import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GROUPS } from '../../constants/data.constant';

@Component({
  selector: 'app-groups',
  imports: [CommonModule],
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
})
export class Groups {
  groups: any = [];

  ngOnInit() {
    this.groups = GROUPS;
  }
}
