import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {

  form!: FormGroup;

  constructor(private router: Router, private authService: AuthService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
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
    console.log(this.form.value);
    try {
      await this.authService.registerUser(this.form.value);
      this.router.navigate(['/login']);
    } catch(error) {
      console.log(error);
    }
  }
}
