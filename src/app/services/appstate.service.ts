import { Injectable, signal } from "@angular/core";
import { User } from "../interfaces/user.interface";
import { Toastr, ToastrSource, ToastrType } from "../interfaces/toastr.interface";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  /* ================= GLOBAL USER ================= */

  currentUser = signal<any | null>(null);

  setUser(user: User) {
    this.currentUser.set(user);
  }

  clearUser() {
    this.currentUser.set(null);
  }

  getUser() {
    return this.currentUser();
  }

  isLoggedIn() {
    return this.currentUser() !== null;
  }

  /* ================= ONLINE USERS =================== */

  onlineUsers = signal<string[]>([]);

  setOnlineUsers(users: string[]) {
    this.onlineUsers.set(users);
  }

  clearOnlineUsers() {
    this.onlineUsers.set([]);
  }

  isUserOnline(participants: any[]) {
    const currentUserId = this.currentUser()?.id;
    const onlineSet = new Set(this.onlineUsers());

    return participants.some(
      p => p._id !== currentUserId && onlineSet.has(p._id)
    );
  }

  /* ================= LOADER ================= */

  isLoading = signal<boolean>(false);

  startLoader(): void {
    this.isLoading.set(true);
  }

  stopLoader(): void {
    this.isLoading.set(false);
  }

  /* ================= TOASTR ================= */

  toastr = signal<Toastr>({
    message: '',
    type: ToastrType.SUCCESS,
    duration: 2000,
    show: false,
    source: 'MANUAL'
  });

  private toastrTimer: any;

  showToastr(
    message: string,
    type: ToastrType = ToastrType.SUCCESS,
    duration: number = 2000,
    source: ToastrSource = 'MANUAL'
  ): void {

    // Clear previous timeout
    if (this.toastrTimer) {
      clearTimeout(this.toastrTimer);
    }

    // Reset state (important for same message re-trigger)
    this.toastr.set({ ...this.toastr(), show: false });

    setTimeout(() => {
      this.toastr.set({
        message,
        type,
        duration,
        show: true,
        source
      });

      this.toastrTimer = setTimeout(() => {
        this.toastr.set({
          message: '',
          type: ToastrType.SUCCESS,
          duration,
          show: false,
          source
        });
      }, duration);

    }, 50);
  }

  /* ================= HELPER METHODS ================= */

  success(message: string, duration: number = 2000) {
    this.showToastr(message, ToastrType.SUCCESS, duration, 'MANUAL');
  }

  error(message: string, source: ToastrSource = 'MANUAL', duration: number = 3000) {
    this.showToastr(message, ToastrType.ERROR, duration, source);
  }

  warning(message: string, duration: number = 2500) {
    this.showToastr(message, ToastrType.WARNING, duration, 'MANUAL');
  }

  info(message: string, duration: number = 2000) {
    this.showToastr(message, ToastrType.INFO, duration, 'MANUAL');
  }
}