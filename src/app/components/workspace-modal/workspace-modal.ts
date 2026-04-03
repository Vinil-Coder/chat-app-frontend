import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalRef } from '../../services/modal-ref.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workspace-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './workspace-modal.html',
  styleUrls: ['./workspace-modal.scss'],
})
export class WorkspaceModalComponent implements OnChanges, OnInit {

  @Input() mode: 'create' | 'edit' | 'delete' = 'create';
  @Input() name = '';

  modalRef!: ModalRef;

  form!: FormGroup;

  constructor() { }

  ngOnInit() {
    this.createForm();
    this.form.patchValue({
      name: this.name
    });
  }

  ngOnChanges() {
    if (this.form) {
      this.form.patchValue({
        name: this.name
      });
    }
  }

  get fc() {
    return this.form.controls;
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.modalRef.close({
      name: this.form.value.name,
      mode: this.mode
    });
  }

  close() {
    this.form.reset();
    this.modalRef.close(null);
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }
}