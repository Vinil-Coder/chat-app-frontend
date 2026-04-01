import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { ModalRef } from '../../services/modal-ref.service';

@Component({
  selector: 'app-member-modal',
  imports: [FormsModule],
  templateUrl: './member-modal.html',
  styleUrl: './member-modal.scss',
})
export class MemberModal {

  @Input() mode: 'edit' | 'remove' | 'invite' = 'invite';
  @Input() name = '';
  @Input() email = '';
  @Input() contact = '';
  @Input() role = 'Member';

  constructor(private modal: ModalService) { }

  modalRef!: ModalRef;

  save() {
    this.modalRef.close({
      name: this.name,
      email: this.email,
      contact: this.contact,
      role: this.role
    });
  }

  close() {
    this.modalRef.close(null);
  }
}
