import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalRef } from '../../services/modal-ref.service';
import { CommonModule } from '@angular/common';
import { Workspace } from '../../interfaces/workspace.interface';

@Component({
  selector: 'app-workspace-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './workspace-modal.html',
  styleUrls: ['./workspace-modal.scss'],
})
export class WorkspaceModalComponent implements OnChanges, OnInit {

  @Input() mode: 'create' | 'edit' | 'delete' = 'create';
  @Input() formData: Workspace = {} as Workspace;

  modalRef!: ModalRef;

  form!: FormGroup;

  constructor() { }

  ngOnInit() {
    this.createForm();
    console.log(this.formData);
    this.form.patchValue(this.formData)
  }

  ngOnChanges() {
    if (this.form) {
      this.form.patchValue(this.formData)
    }
  }

  get fc() {
    return this.form.controls;
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.modalRef.close(this.form.value);
  }

  close() {
    this.form.reset();
    this.modalRef.close(null);
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }
}