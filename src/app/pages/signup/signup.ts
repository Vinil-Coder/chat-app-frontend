import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InviteService } from '../../services/invite.service';
import { AppUiStateService, ToastrType } from '../../services/ui-state.service';
import { Toastr } from '../../components/toastr/toastr';

@Component({
  selector: 'app-signup',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {

  form!: FormGroup;
  token!: string;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private inviteService: InviteService,
    private activatedRoute: ActivatedRoute,
    private appUiStateService: AppUiStateService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      password: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token') || '';
  }

  get fc() {
    return this.form.controls;
  }

  async onFormSubmit() {

    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    try {
      if(this.token) {
        await this.registerWithInvite();
      } else {
        await this.authService.registerUser(this.form.value);
      }
      await this.authService.loginUser(this.form.value);
      this.router.navigate(['/']);
    } catch(err: any) {
      this.appUiStateService.showToastr(
        err.message,
        ToastrType.ERROR
      )
    }
  }

  async registerWithInvite() {
    try {
      await this.inviteService.verifyInvite(this.token);
      await this.inviteService.registerWithInvite({
        ...this.form.value,
        token: this.token
      });
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.message,
        ToastrType.ERROR
      )
    }
  }
}
