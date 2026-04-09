import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VehicleBrandsService {

    constructor(private http: HttpClient) { }

    private appUrl = environment.apiUrl + "/buyers/vehicle-brands";


loadVehicleBrands(brand: string) {
    const url = `${this.appUrl}/load?vehicletype=${encodeURIComponent(brand)}`;
   console.log('Loading vehicle brands for type:', brand);
   console.log('Constructed URL:', url);
    return this.http.get<any[]>(url);
  }



}