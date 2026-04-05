import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalRef } from '../../services/modal-ref.service';
import { Member } from '../../interfaces/member.interface';
import { CommonModule } from '@angular/common';
import { Workspace } from '../../interfaces/workspace.interface';

@Component({
  selector: 'app-member-modal',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './member-modal.html',
  styleUrl: './member-modal.scss',
})
export class MemberModal {

  @Input() mode: 'invite' | 'edit' | 'delete' = 'invite';
  @Input() formData: Member = {} as Member;
  @Input() workspaces: Workspace[] = [];

  modalRef!: ModalRef;

  form!: FormGroup;

  workspaceDropdownOpen: boolean = false;
  selectedWorkspace: string = '';

  activeDropdown: 'role' | 'status' | 'workspace' | null = null;

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
    this.form.controls['workspaceId'].markAsTouched();
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
      contact: new FormControl('', [Validators.required]),
      workspaceId: new FormControl('', [Validators.required]),
    });
  }

  toggleDropdown(type: 'role' | 'status' | 'workspace') {
    this.activeDropdown = this.activeDropdown === type ? null : type;
    

    // mark touched when interacted
    this.form.controls[
      type === 'workspace' ? 'workspaceId' : type
    ].markAsTouched();
  }

  selectWorkspace(workspace: any, event: Event) {
    event.stopPropagation();
    this.selectedWorkspace = workspace.name;
    this.form.patchValue({
      workspaceId: workspace._id
    });

    this.toggleDropdown('workspace');
  }
}
