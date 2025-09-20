import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  private appUrl = "http://localhost:8181/auth";

  registerUser(form: any): Observable<any> {

    const url = this.appUrl + '/register';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(url, form.value, { headers })
      .pipe(
        catchError(error => {
          console.error("Error during registration:", error);
          return of({ success: false, message: 'Registration failed' });
        })
      );
  }



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
          return of({ success: false, message: 'Login failed' });
        })
      );
  }


}
