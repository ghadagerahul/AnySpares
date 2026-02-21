import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class VehicleCategoryService {

    constructor(private http: HttpClient) { }

    private appUrl = "http://localhost:8181/buyers/vehicle-categories";


    loadVehicleCategories(vehicleType: any) {
        console.log('Loading vehicle categories for type:', vehicleType);
        const url = `${this.appUrl}/load?vehicleType=${encodeURIComponent(vehicleType)}`;
        return this.http.get<any[]>(url);
    }

}



