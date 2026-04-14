import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { AppStateService } from "../services/appstate.service";
import { SocketService } from "../services/socket.service";
import { catchError, map, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private appState: AppStateService
  ) { }

  canActivate() {

    // If already in state, skip API call
    const existingUser = this.appState.getUser();
    if (existingUser) {
      console.log('user already in state');
      return of(true);
    }

    return this.authService.isUserAuthenticated().pipe(

      tap((res: any) => {
        if (res.authenticated) {
          this.appState.setUser(res.user);
        }
      }),

      map((res: any) =>
        res.authenticated
          ? true
          : this.router.createUrlTree(['/landing'])
      ),

      catchError(() =>
        of(this.router.createUrlTree(['/landing']))
      )
    );
  }
}