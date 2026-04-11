import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { switchMap, tap, finalize, catchError, of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AppStateService } from '../../services/appstate.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  form!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appState: AppStateService,
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get fc() {
    return this.form.controls;
  }

  /* ================= SUBMIT ================= */

  onFormSubmit() {

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.appState.startLoader();

    const payload = this.form.value;

    this.authService.loginUser(payload)
      .pipe(
        switchMap(() => this.authService.isUserAuthenticated()),
        tap((res: any) => {
          this.appState.setUser(res.user as User);
          this.appState.success('Login successful');
          this.router.navigate(['']);
        }),
        finalize(() => this.appState.stopLoader()),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= ERROR ================= */

  private handleError(err: any) {
    this.appState.error(err?.error?.message || 'Invalid credentials');
    return of(null);
  }
}