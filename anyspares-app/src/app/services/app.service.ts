import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  private appUrl = environment.apiUrl + "/auth";
  // ...existing code...
  // Make sure to update environment.ts and environment.prod.ts for apiUrl




  /**
  * Sends registration request to the backend.
  *
  * @param regForm - User details for registration.
  * @returns Observable with API response or a fallback error object.
  */
  registerUser(regForm: any): Observable<any> {
    const url = this.appUrl + '/register';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, regForm, { headers }).pipe(
      catchError(error => {
        console.error("Error during registration:", error);
        return of({ success: false, message: 'Registration failed' });
      })
    );
  }



  /**
    * Sends login request to the backend.
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
        catchError(error => {
          console.error("Error during Login:", error);
          return of({ success: false, message: 'Login failed..!!! Invalid Credientials.' });
        })
      );
  }


}
