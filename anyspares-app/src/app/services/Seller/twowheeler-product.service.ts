import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TwoWheelerProductService {

    constructor(private http: HttpClient) { }

    private appUrl = 'http://localhost:8181/twowheelers/seller/products';



    /**
     * Adds a new product. Expects a FormData with fields and files (multipart/form-data).
     * Adjust the endpoint path if your backend exposes a different URL.
     */
    addProduct(formData: FormData): Observable<any> {
        const url = this.appUrl + `/addProduct`;

        for (const [key, value] of formData.entries()) {
            console.log('FormData entry:', key, value);
        }

        return this.http.post<any>(url, formData).pipe(
            catchError(error => {
                console.log("Error adding product:", error);
                return of({ success: false, message: 'Add Product failed' });
            })
        );
    }


    fetchFormLoadDataList(): Observable<any> {
        const url = this.appUrl + `/fetchFormLoadData`;
        return this.http.get<any>(url).pipe(
            catchError(error => {
                console.log("Error fetching form load data:", error);
                return of({ success: false, message: 'Failed to fetch form load data' });
            })
        );
    }

}