import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  form!: FormGroup;

  constructor(private router: Router, private authService: AuthService) {
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
      await this.authService.loginUser(this.form.value);
      this.router.navigate(['']);
    } catch(error) {
      console.log(error);
    }
  }
}
