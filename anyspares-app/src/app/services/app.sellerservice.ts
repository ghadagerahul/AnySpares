import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SellerService {

    constructor(private http: HttpClient) { }

    private appUrl = environment.apiUrl + "/spares/sellerAuth";


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


    // /**
    // * Sends registration request to the backend.
    // *
    // * @param loginForm - User details for registration.
    // * @returns Observable with API response or a fallback error object.
    // */
    // loginUser(loginForm: any): Observable<any> {
    //     const url = this.appUrl + '/login';
    //     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //     console.log("loginForm: " + loginForm.mobileNumber);
    //     return this.http.post<any>(url, loginForm, { headers }).pipe(
    //         catchError(error => {
    //             console.error("Error during Seller Login:", error);
    //             return of({ success: false, message: 'Seller Login failed' });
    //         })
    //     );
    // }

    /**
     * Sends forgot password request for seller to backend.
     * @param form - object with email or mobileNumber
     */
    forgotPassword(form: any): Observable<any> {
        const url = this.appUrl + '/forgot-password';
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(url, form, { headers }).pipe(
            catchError(error => {
                console.error("Error during Seller Forgot Password:", error);
                return of({ success: false, message: 'Seller Forgot password failed' });
            })
        );
    }

}