import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {

    private constants: any = {};
    private optionsLoaded$ = new BehaviorSubject<boolean>(false);
    private loadOptions$ = new BehaviorSubject<Observable<any> | null>(null);
    private configUrl = environment.configUrl;
    constructor(private http: HttpClient) {
        this.loadInitialOptions();
    }

    /**
     * Load options from JSON file on service initialization
     */
    private loadInitialOptions(): void {
        const options$ = this.http.get(this.configUrl).pipe(
            tap(data => {
                this.constants = data;
                this.optionsLoaded$.next(true);
                console.log('App constants loaded from:', this.configUrl, data);
            }),
            shareReplay(1) // Cache the result
        );
        this.loadOptions$.next(options$);
    }

    /**
     * Get the loaded options observable
     */
    loadOptions(): Observable<any> {
        return this.loadOptions$.value || this.http.get(this.configUrl).pipe(
            tap(data => {
                this.constants = data;
                this.optionsLoaded$.next(true);
            }),
            shareReplay(1)
        );
    }

    /**
     * Check if options are loaded
     */
    isLoaded(): Observable<boolean> {
        return this.optionsLoaded$.asObservable();
    }

    setOptions(data: any): void {
        this.constants = data;
        this.optionsLoaded$.next(true);
    }

    get brands(): string[] {
        return this.constants?.brands || [];
    }

    get models(): string[] {
        return this.constants?.models || [];
    }

    get categories(): string[] {
        return this.constants?.categories || [];
    }
}
