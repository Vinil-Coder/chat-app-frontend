import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-groups',
  imports: [CommonModule],
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
})
export class Groups {
  groups = [
    { id: 1, name: 'Project Team', members: '5', time: '11:00 AM' },
    { id: 2, name: 'Family', members: '3', time: '08:00 AM' }
  ];
}
