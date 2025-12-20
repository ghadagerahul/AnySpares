import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TwowheelerService {

    constructor(private http: HttpClient) { }

    private appUrl = "http://localhost:8181/spares/twowheeler";


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


}