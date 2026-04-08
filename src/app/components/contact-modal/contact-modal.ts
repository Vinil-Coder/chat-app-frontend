import { Component, Input, signal } from '@angular/core';
import { ModalRef } from '../../services/modal-ref.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-modal',
  imports: [CommonModule],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss',
})
export class ContactModal {

  @Input() mode: 'list' = 'list';
  @Input() contacts: User[] = [];

  modalRef!: ModalRef;

  selectedUser: User | null = null;

  constructor() { }

  close() {
    this.modalRef.close(null);
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  confirmSelection() {
    if (!this.selectedUser) return;
    this.modalRef.close(this.selectedUser);
  }
}
