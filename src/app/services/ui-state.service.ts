import { Injectable, signal } from "@angular/core";

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

    isLoading = signal(false);
    toastr = signal<Toastr>({
        message: '',
        type: ToastrType.SUCCESS,
        duration: 3000,
        show: false
    });
    
    constructor() { }

    startLoader(): void {
        this.isLoading.set(true);
    }

    stopLoader(): void {
        this.isLoading.set(false);
    }

    showToastr(
        message: string,
        type: ToastrType = ToastrType.SUCCESS,
        duration: number = 2000): void {
        this.toastr.set(this.toastr().show ? { ...this.toastr(), show: false } : this.toastr());
        this.toastr.set({ message, type, duration, show: true });
        setTimeout(() => {
            this.toastr.set({ message: '', type: ToastrType.SUCCESS, duration, show: false });
        }, duration);
    }
}
