import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalRef } from '../../services/modal-ref.service';
import { Member } from '../../interfaces/member.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-modal',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './member-modal.html',
  styleUrl: './member-modal.scss',
})
export class MemberModal {

  @Input() formData: Member = {} as Member;

  modalRef!: ModalRef;

  form!: FormGroup;

  constructor() { }

  ngOnInit() {
    this.createForm();
  }

  get fc() {
    return this.form.controls;
  }

  save() {
    this.form.markAllAsTouched();
    console.log(this.form.value);
    if (this.form.invalid) return;
    this.modalRef.close(this.form.value);
  }

  close() {
    this.form.reset();
    this.modalRef.close(null);
  }

  createForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required])
    });
  }
}
