import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SellerCategoryPartsService {

    constructor(private http: HttpClient) { }

    private appUrl = 'http://localhost:8181/twowheelers/sellercategoryparts/categories';

    /**
     * Fetches all product categories from the backend.
     * 
     * @returns Observable<any> - Returns an array of categories from the backend
     */
    getPartsUnderCategories(categoryType: string): Observable<any> {
        const url = this.appUrl + '/' + categoryType;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get<any>(url, { headers }).pipe(
            tap(response => {
                console.log("Categories fetched successfully:", response);
            }),
            catchError(error => {
                console.error("Error fetching categories:", error);
                return of({ success: false, message: 'Failed to fetch categories', data: [] });
            })
        );
    }


}