import { Component, signal } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { AppUiStateService, ToastrType } from '../../services/ui-state.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  user = signal<User>({} as User);

  constructor(
    private userService: UserService,
    private appUIStateService: AppUiStateService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.appUIStateService.startLoader();

    try {
      await Promise.all([
        this.getUserProfile(),
        this.getUserActivities()
      ]);
    } finally {
      this.appUIStateService.stopLoader();
    }
  }

  async getUserProfile() {
    try {
      const res = await this.userService.getUserProfile();
      this.user.set(res.user);

      this.appUIStateService.showToastr(
        'Profile fetched successfully',
        ToastrType.SUCCESS
      );
    } catch (err: any) {
      this.appUIStateService.showToastr(
        err.error?.message || 'Failed to get profile info',
        ToastrType.ERROR
      );
    }
  }

  async getUserActivities() {
    try {

    } catch (err: any) {
      this.appUIStateService.showToastr(
        err.error?.message || 'Failed to get activities',
        ToastrType.ERROR
      );
    }
  }

}
