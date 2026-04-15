import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { catchError, EMPTY, take, tap } from 'rxjs';
import { AppStateService } from '../../services/appstate.service';

@Component({
  selector: 'app-resetpassword',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.scss',
})
export class Resetpassword {

  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appState: AppStateService
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    })
  }

  get fc() {
    return this.form.controls;
  }

  async onFormSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    try {
      this.authService.changePassword(this.form.value)
        .pipe(
          tap(() => this.appState.success('Password changed successfully')),
          take(1),
          tap(() => this.router.navigate(['/login'])),
          catchError((err) => this.handleError(err))
        )
        .subscribe()
    } catch (err: any) {}
  }

  /* ================= COMMON ================= */

  private handleError(err: any) {
    this.appState.error(err?.error?.message || 'Something went wrong');
    return EMPTY;
  }
}
