import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';

// export interface VehicleProductDto {
//   name: string;
//   type: 'OEM' | 'Aftermarket';
//   rating: number;
//   reviews: number;
//   discountedPrice: number;
//   originalPrice: number;
//   discount: number;
//   imageUrl: string;
// }

@Injectable({
    providedIn: 'root'
})
export class VehicleProductService {

    private appUrl = environment.apiUrl + "/buyers/vehicle-products";
    // ...existing code...

    constructor(private http: HttpClient) { }

    loadProductData(modelId: string | null, category: string | null, vehicleType?: string | null) {
        let params = new HttpParams();

        if (modelId) {
            params = params.set('modelId', modelId);
        }
        if (category) {
            params = params.set('category', category);
        }
        if (vehicleType) {
            params = params.set('vehicleType', vehicleType);
        }

        const url = `${this.appUrl}/load?${params.toString()}`;
        console.log('Loading products with URL:', url);

        return this.http.get<any[]>(url);

        // return this.http.get<VehicleProductDto[]>(url);
        //return this.http.get<VehicleProductDto[]>(`${this.appUrl}/load`, { params });
        //return this.http.get<VehicleProductDto[]>(`${this.appUrl}/load?modelId=${modelId}&category=${category}&vehicleType=${vehicleType}`);
        //return this.http.get<VehicleProductDto[]>(`${this.appUrl}/load?${params.toString()}`);
        //return this.http.get<VehicleProductDto[]>(`${this.appUrl}/load`, { params });
        //return this.http.get<VehicleProductDto[]>(`${this.appUrl}/load?modelId=${modelId}&category=${category}&vehicleType=${vehicleType}`);
        //return this.http.get<VehicleProductDto[]>(`${this.appUrl}/load?${params.toString()}`);
        //return this.http.get<ApiResponse<VehicleProductDto[]>>(`${this.appUrl

        //return this.http.get<ApiResponse<VehicleProductDto[]>>(`${this.appUrl}/load`, { params });  }
    }
}
