import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BuyerService {

  constructor(private http: HttpClient) { }

  private appUrl = environment.apiUrl + "user/sellerAuth";

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

  // LoginUserToPortal(form: any): Observable<any> {
  //   console.log("INSIDE LoginUser:", form);
  //   const url = this.appUrl + '/login';
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   return this.http.post<any>(url, form, { headers }).pipe(
  //     catchError(error => {
  //       console.error("Error during Buyer Login:", error);
  //       return of({ success: false, message: 'Buyer Login failed' });
  //     })
  //   );
  // }

  forgotPassword(form: any): Observable<any> {
    const url = this.appUrl + '/forgot-password';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, form, { headers }).pipe(
      catchError(error => {
        console.error('Error during Buyer Forgot Password:', error);
        return of({ success: false, message: 'Forgot password request failed' });
      })
    );
  }
}
