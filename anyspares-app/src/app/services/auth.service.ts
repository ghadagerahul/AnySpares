import { Injectable, signal } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private appUrl = environment.apiUrl + "/user/v1/auth";

  isAuthenticated = signal<boolean>(!!localStorage.getItem('authToken'));
  currentUser = signal<string | null>(localStorage.getItem('currentUser') || null);

  /**
    * Sends Buyer login request to the backend.
    *
    * @param form - User credentials (e.g., username, password).
    * @returns Observable with API response or a fallback error object.
    */
  LoginUserToPortal(form: any): Observable<any> {
    console.log("INSIDE LoginUser: " + form);
    const url = this.appUrl + '/login';
    console.log("url: " + url);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log("String input:: " + JSON.stringify(form));
    return this.http.post<any>(url, form, { headers })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.isAuthenticated.set(true);
          this.currentUser.set(response.user);
        })
      );
  }


  /**
    * Sends registration request to the backend.
    *
    * @param regForm - User details for registration.
    * @returns Observable with API response or a fallback error object.
    */
  registerUser(regForm: any): Observable<any> {
    const url = this.appUrl + '/register';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("regForm: " + regForm.businesstName);
    return this.http.post<any>(url, regForm, { headers }).pipe(
      catchError(error => {
        console.error("Error during Seller registration:", error);
        return of({ success: false, message: 'Seller Registration failed' });
      })
    );
  }



  forgotPassword(form: any): Observable<any> {
    const url = this.appUrl + '/forgot-password';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, form, { headers }).pipe(
      catchError(error => {
        console.error('Error during Buyer Forgot Password:', error);
        return of({ success: false, message: error.error?.message });
      })
    );
  }

  verifyOtp(form: any): Observable<any> {
    const url = this.appUrl + '/verify-otp';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, form, { headers }).pipe(
      catchError(error => {
        console.error('Error during Buyer OTP verification:', error);
        return of({ success: false, message: 'OTP verification failed' });
      })
    );
  }

  resetPassword(form: any): Observable<any> {
    const url = this.appUrl + '/reset-password';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, form, { headers }).pipe(
      catchError(error => {
        console.error('Error during Buyer password reset:', error);
        return of({ success: false, message: 'Password reset failed' });
      })
    );
  }




  // Logout method
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
