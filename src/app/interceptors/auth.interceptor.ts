import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";


export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        if(!token) return next.handle(req);
        
        const clonedReq = req.clone({
            setHeaders: {
                token: token || '',
                refreshToken: refreshToken || ''
            }
        })

        return next.handle(clonedReq);
    }
}