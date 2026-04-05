import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InviteService } from '../../services/invite.service';

@Component({
  selector: 'app-invite',
  imports: [CommonModule],
  templateUrl: './invite.html',
  styleUrls: ['./invite.scss']
})
export class Invite implements OnInit {

  token!: string;
  inviteData: any;
  loading = true;
  error = '';
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private inviteService: InviteService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.isLoggedIn = !!sessionStorage.getItem('token');

    this.verifyInvite();
  }

  async verifyInvite() {
    try {
      const res = await this.inviteService.verifyInvite(this.token);
      this.inviteData = res;
    } catch (err: any) {

    }
  }

  acceptInvite() {
    this.http.post(`/api/invite/accept/${this.token}`, {}).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  goToSignup() {
    this.router.navigate(['/signup'], {
      queryParams: { token: this.token }
    });
  }

  goToLogin() {
    this.router.navigate(['/login'], {
      queryParams: { token: this.token }
    });
  }
}