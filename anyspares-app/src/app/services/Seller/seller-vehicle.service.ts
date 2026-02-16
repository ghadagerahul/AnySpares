import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of, tap } from "rxjs";

interface VehicleBrandResponse {
    success: boolean;
    message: string;
}

interface VehicleModelResponse {
    success: boolean;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class SellerVehicleService {
  
    private apiUrl = 'http://localhost:8181/sellers/Vehicles';
    
    constructor(private http: HttpClient) { }

  getVehicleBrands() {
      const url = this.apiUrl + "/getVehicleBrands";
      return this.http.get(url);
    }

    addVehicleBrand(apiPayload: FormData): Observable<any> {

      const url = this.apiUrl + "/addVehicleBrand";
        return this.http.post<VehicleBrandResponse>(url, apiPayload).pipe(
            tap(response => {
                if(response && response.success) {
                    console.log("Brand added successfully:", response);
                }
            }),
            catchError(error => {
                console.error("Error adding brand:", error);
                if (error.status === 409) {
                    return of({ success: false, message: 'Details already exists' });
                }
                return of({ success: false, message: 'Failed to add brand' });
            })
        );
    }

    addVehicleModel(apiPayload: FormData): Observable<any> {

        const url = this.apiUrl + "/addVehicleModel";
        return this.http.post<VehicleModelResponse>(url, apiPayload).pipe(
            tap(response => {
                if(response && response.success) {
                    console.log("Model added successfully:", response);
                }
            }),
            catchError(error => {
                console.error("Error adding model:", error);
                if (error.status === 409) {
                    return of({ success: false, message: 'Details already exists' });
                }
                return of({ success: false, message: 'Failed to add model' });
            })
        );
    }

}