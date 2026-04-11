import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { switchMap, tap, finalize, catchError, of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { InviteService } from '../../services/invite.service';
import { AppStateService } from '../../services/appstate.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {

  form!: FormGroup;
  token = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private inviteService: InviteService,
    private activatedRoute: ActivatedRoute,
    private appState: AppStateService
  ) {}

  /* ================= INIT ================= */

  ngOnInit() {
    this.initForm();
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token') || '';
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]{10}$")
      ]),
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

    const formValue = this.form.value;

    const register$ = this.token
      ? this.inviteService.verifyInvite(this.token).pipe(
          switchMap(() =>
            this.inviteService.registerWithInvite({
              ...formValue,
              token: this.token
            })
          )
        )
      : this.authService.registerUser(formValue);

    register$
      .pipe(
        switchMap(() => this.authService.loginUser(formValue)),
        tap(() => {
          this.appState.success('Account created successfully');
          this.router.navigate(['']);
        }),
        finalize(() => this.appState.stopLoader()),
        catchError(err => this.handleError(err))
      )
      .subscribe();
  }

  /* ================= ERROR ================= */

  private handleError(err: any) {
    this.appState.error(err?.error?.message || 'Something went wrong');
    return of(null);
  }
}