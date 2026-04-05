import { Injectable, signal } from "@angular/core";
import { User } from "../interfaces/user.interface";

export enum ToastrType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
}

export interface Toastr {
    message: string,
    type: ToastrType,
    duration: number,
    show: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AppUiStateService {

    currentUser = signal<User>(JSON.parse(sessionStorage.getItem('user') || '{}'));

    // LOADER STATE
    isLoading = signal(false);

    // TOASTR STATE
    toastr = signal<Toastr>({
        message: '',
        type: ToastrType.SUCCESS,
        duration: 3000,
        show: false
    });

    private toastrTimer: any;

    constructor() {
        console.log('AppUiStateService constructor', this.currentUser());
     }

    // =========================
    // LOADER METHODS
    // =========================

    startLoader(): void {
        this.isLoading.set(true);
    }

    stopLoader(): void {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 800);
    }

    // =========================
    // TOASTR METHODS
    // =========================

    showToastr(
        message: string,
        type: ToastrType = ToastrType.SUCCESS,
        duration: number = 2000
    ): void {

        // Clear previous timeout (important fix)
        if (this.toastrTimer) {
            clearTimeout(this.toastrTimer);
        }

        // Force reset (prevents same message not showing)
        this.toastr.set({ ...this.toastr(), show: false });

        setTimeout(() => {
            this.toastr.set({
                message,
                type,
                duration,
                show: true
            });

            this.toastrTimer = setTimeout(() => {
                this.toastr.set({
                    message: '',
                    type: ToastrType.SUCCESS,
                    duration,
                    show: false
                });
            }, duration);

        }, 50); // small delay ensures UI refresh
    }
}