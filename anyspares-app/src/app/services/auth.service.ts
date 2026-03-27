import { Injectable, signal } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private appUrl = environment.apiUrl + "/user";

  // Signal to track if user is authenticated
  isAuthenticated = signal<boolean>(!!localStorage.getItem('authToken'));
  currentUser = signal<string | null>(localStorage.getItem('currentUser') || null);

  /**
    * Sends Buyer login request to the backend.
    *
    * @param form - User credentials (e.g., username, password).
    * @returns Observable with API response or a fallback error object.
    */
  LoginBuyerUserToPortal(form: any): Observable<any> {
    console.log("INSIDE LoginUser: " + form);
    const url = this.appUrl + '/buyerAuth/login';
    console.log("url: " + url);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log("String input:: " + JSON.stringify(form));
    return this.http.post<any>(url, form, { headers })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', response.user);
          this.isAuthenticated.set(true);
          this.currentUser.set(response.user);
        })
      );
  }



  /**
     * Sends registration request to the backend.
     *
     * @param loginForm - User details for registration.
     * @returns Observable with API response or a fallback error object.
     */
  LoginSellerUserToPortal(loginForm: any): Observable<any> {
    const url = this.appUrl + '/sellerAuth/login';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("loginForm: " + loginForm.mobileNumber);
    return this.http.post<any>(url, loginForm, { headers }).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', response.user);
        this.isAuthenticated.set(true);
        this.currentUser.set(response.user);
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
