import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TwoWheelerDashboardService {

    constructor(private http: HttpClient) { }

    private appUrl = 'http://localhost:8181/twowheelers/seller/dashboard';

    /**
     * Loads dashboard stats data
     */
    loadStatsData(): Observable<any> {
        const url = this.appUrl + `/stats`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.get<any>(url, { headers }).pipe(
            catchError(error => {
                console.error('Error during stats data load:', error);
                return of({ success: false, message: 'Stats Data Load failed' });
            })
        );
    }

    /**
     * Loads dashboard Inventory data
     */
    loadInventoryData(): Observable<any> {
        const url = this.appUrl + `/inventory`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.get<any>(url, { headers }).pipe(
            catchError(error => {
                console.error('Error during stats data load:', error);
                return of({ success: false, message: 'Stats Data Load failed' });
            })
        );
    }

    /**
     * Loads dashboard Recent Activities data
     */
    loadRecentActivities(): Observable<any> {
        const url = this.appUrl + `/recentActivities`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.get<any>(url, { headers }).pipe(
            catchError(error => {
                console.error('Error during stats data load:', error);
                return of({ success: false, message: 'Stats Data Load failed' });
            })
        );
    }
}