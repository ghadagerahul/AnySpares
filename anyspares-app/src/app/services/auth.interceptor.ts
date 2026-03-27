import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor  /* implements HttpInterceptor */ {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();
    console.log("AuthInterceptor: Intercepting HTTP request. Auth token:", authToken);
    console.log("AuthInterceptor: Current authentication status:", this.authService.isAuthenticated());
    alert("AuthInterceptor: Intercepting HTTP request. Auth token: " + authToken + " Current authentication status: " + this.authService.isAuthenticated());
    console.log("AuthInterceptor: --------------------------------------------------");
    // Clone the request and add the auth token if it exists
    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(req);
  }
}
