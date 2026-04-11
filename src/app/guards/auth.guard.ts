import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError, map, of } from "rxjs";
import { AppStateService } from "../services/appstate.service";
import { SocketService } from "../services/socket.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private appState: AppStateService,
    private socket: SocketService
  ) {}

  canActivate() {

    return this.authService.isUserAuthenticated().pipe(
      map((res: any) => {
        if (res.authenticated) {
          this.appState.setUser({
            ...res.user,
            _id: res.user.id
          });
          console.log('user', this.appState.getUser());
          this.socket.connect();
          return true;
        } else {
          this.router.navigate(['/landing']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/landing']);
        return of(false);
      })
    );

  }
}