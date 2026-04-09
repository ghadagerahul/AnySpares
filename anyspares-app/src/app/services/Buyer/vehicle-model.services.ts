import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VehicleModelService {

    constructor(private http: HttpClient) { }

    private appUrl = environment.apiUrl + "/buyers/vehicle-models";


loadVehicleModels(brandId: string) {
    const url = `${this.appUrl}/load?brandId=${encodeURIComponent(brandId)}`;
    return this.http.get<any[]>(url);
  }



}