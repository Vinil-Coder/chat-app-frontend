import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resetpassword',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.scss',
})
export class Resetpassword {

  form!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
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
      await this.authService.changePassword(this.form.value);
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
