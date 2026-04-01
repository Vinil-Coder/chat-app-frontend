import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalRef } from '../../services/modal-ref.service';

@Component({
  selector: 'app-workspace-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './workspace-modal.html',
  styleUrls: ['./workspace-modal.scss'],
})
export class WorkspaceModalComponent {

  @Input() mode: 'create' | 'edit' | 'delete' = 'create';
  @Input() name = '';

  modalRef!: ModalRef;

  save() {
    this.modalRef.close({
      name: this.name,
      mode: this.mode
    });
  }

  close() {
    this.modalRef.close(null);
  }
}