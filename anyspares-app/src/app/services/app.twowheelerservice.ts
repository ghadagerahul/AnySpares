import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TwowheelerService {

    constructor(private http: HttpClient) { }

    private appUrl = "http://localhost:8181/buyer";


    /**
    * Sends registration request to the backend.
    *
    * @param regForm - User details for registration.
    * @returns Observable with API response or a fallback error object.
    */
    loadTwoWheelerBrands(): Observable<any> {
        const url = this.appUrl + '/loadModels';
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  const dummyResponse = {
      success: true,
      data: ['Honda', 'Yamaha', 'Suzuki', 'Bajaj', 'TVS']
    };
  // Return as Observable
  return of(dummyResponse);

        // return this.http.post<any>(url, { headers }).pipe(
        //     catchError(error => {
        //         console.error("Error during registration:", error);
        //         return of({ success: false, message: 'Registration failed' });
        //     })
        // );
    }


     loadTwoWheelerModels(selectedModel: any): Observable<any>{


  const dummyResponse = {
    success: true,
    data: [
      {
        company: 'Honda',
        models: ['Activa 6G', 'Dio', 'Shine', 'Hornet']
      },
      {
        company: 'Yamaha',
        models: ['FZ', 'R15', 'MT-15']
      },
      {
        company: 'Suzuki',
        models: ['Access 125', 'Burgman Street', 'Gixxer']
      },
      {
        company: 'Bajaj',
        models: ['Pulsar 150', 'Dominar 400', 'CT 100']
      },
      {
        company: 'TVS',
        models: ['Apache RTR 160', 'Jupiter', 'Ntorq']
      }
    ]
  };

 const match = dummyResponse.data.find(
    item => item.company.toLowerCase() === selectedModel.toLowerCase()
  );

  return of(match || null);


     }

    /**
     * Fetches vehicle categories from the backend.
     * 
     * @returns Observable<any> - Returns an array of vehicle categories
     */
    getVehicleCategories(): Observable<any> {
        const url = this.appUrl + '/vehicleCategories';
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // Dummy data for now - replace with actual API call when backend is ready
        const dummyResponse = {
            success: true,
            data: [
                {
                    id: 1,
                    name: 'Two-Wheeler',
                    description: 'Motorbikes, Scooters & Mopeds',
                    icon: 'bi-bicycle',
                    route: '/twowheelersdashboard',
                    gradientClass: 'bg-gradient-blue'
                },
                {
                    id: 2,
                    name: 'Three-Wheeler',
                    description: 'Auto-rickshaws & Cargo Trikes',
                    icon: 'bi-truck-front',
                    route: '/threewheelersdashboard',
                    gradientClass: 'bg-gradient-green'
                },
                {
                    id: 3,
                    name: 'Four-Wheeler',
                    description: 'Cars, SUVs & Vans',
                    icon: 'bi-car-front-fill',
                    route: '/fourwheelersdashboard',
                    gradientClass: 'bg-gradient-orange'
                },
                {
                    id: 4,
                    name: 'Heavy Vehicles',
                    description: 'Trucks, Buses & Construction',
                    icon: 'bi-truck',
                    route: '/heavyvehiclesdashboard',
                    gradientClass: 'bg-gradient-purple'
                }
            ]
        };

        return of(dummyResponse);

        // Uncomment when backend API is ready
        // return this.http.get<any>(url, { headers }).pipe(
        //     tap(response => {
        //         console.log("Vehicle categories fetched successfully:", response);
        //     }),
        //     catchError(error => {
        //         console.error("Error fetching vehicle categories:", error);
        //         return of({ success: false, message: 'Failed to fetch vehicle categories', data: [] });
        //     })
        // );
    }

}