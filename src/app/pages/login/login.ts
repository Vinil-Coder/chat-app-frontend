import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { AppStateService } from '../../services/appstate.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
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
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
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
      await firstValueFrom(this.authService.loginUser(this.form.value));

      const res = await firstValueFrom(this.authService.isUserAuthenticated());
      this.appState.setUser(res.user as User);

      this.router.navigate(['']);

    } catch (err) {
  
    }
  }
}
