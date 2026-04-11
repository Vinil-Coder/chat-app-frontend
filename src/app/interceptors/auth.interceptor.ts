import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AppStateService } from "../services/appstate.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private appState: AppStateService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Always send cookies
    const clonedReq = req.clone({
      withCredentials: true
    });

    return next.handle(clonedReq).pipe(

      catchError((error: HttpErrorResponse) => {

        // SESSION EXPIRED / UNAUTHORIZED
        if (error.status === 401) {

          // Clear user state
          this.appState.setUser(null as any);

          // Redirect to login (avoid infinite loop)
          if (!this.router.url.includes('/login')) {
            this.router.navigate(['/login']);
          }
        }

        // FORBIDDEN (optional handling)
        if (error.status === 403) {
          this.appState.error('Access denied');
        }

        return throwError(() => error);
      })
    );
  }
}