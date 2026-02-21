import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class VehicleBrandsService {

    constructor(private http: HttpClient) { }

    private appUrl = "http://localhost:8181/buyers/vehicle-brands";


loadVehicleBrands(brand: string) {
    const url = `${this.appUrl}/load?vehicletype=${encodeURIComponent(brand)}`;
    return this.http.get<any[]>(url);
  }



}