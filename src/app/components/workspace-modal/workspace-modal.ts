import { Component, computed, Input, OnChanges, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalRef } from '../../services/modal-ref.service';
import { CommonModule } from '@angular/common';
import { Workspace } from '../../interfaces/workspace.interface';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-workspace-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './workspace-modal.html',
  styleUrls: ['./workspace-modal.scss'],
})
export class WorkspaceModalComponent implements OnChanges, OnInit {

  @Input() mode: 'create' | 'edit' | 'delete' | 'details' = 'create';
  @Input() group: Workspace = {} as Workspace;
  @Input() users: User[] = [];

  modalRef!: ModalRef;

  form!: FormGroup;

  selectedUserIds = signal<string[]>([]);
  searchText = '';
  filteredUsers = computed(() => {
    const search = this.form.value.searchText.toLowerCase();

    console.log('search text', search, this.searchText);
    return this.users.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  });

  constructor() { }

  ngOnInit() {
    this.createForm();
    console.log(this.group);
    if (this.mode === 'edit' && this.group.members) {
      this.selectedUserIds.set(this.group.members.map((m: User) => m._id));
    }
    this.form.patchValue(this.group)
  }

  ngOnChanges() {
    if (this.form) {
      this.form.patchValue(this.group)
    }
  }

  get fc() {
    return this.form.controls;
  }

  save() {
    this.form.markAllAsTouched();
    if (this.mode !== 'delete' && this.form.invalid) return;

    this.modalRef.close({
      ...this.form.value,
      members: this.selectedUserIds()
    });
  }

  close() {
    this.form.reset();
    this.modalRef.close(null);
  }

  toggleUser(user: User) {
    const current = this.selectedUserIds();

    if (current.includes(user._id)) {
      // remove
      this.selectedUserIds.set(current.filter(id => id !== user._id));
    } else {
      // add
      this.selectedUserIds.set([...current, user._id]);
    }
  }

  isSelected(userId: string): boolean {
    return this.selectedUserIds().includes(userId);
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      searchText: new FormControl(''),
    });
  }
}