import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SellerCategoryService {

    constructor(private http: HttpClient) { }

    private appUrl = 'http://localhost:8181/twowheelers/seller/categories';

    /**
     * Fetches all product categories from the backend.
     * 
     * @returns Observable<any> - Returns an array of categories from the backend
     */
    getCategories(): Observable<any> {
        const url = this.appUrl + '/getAll';
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get<any>(url, { headers }).pipe(
            tap(response => {
                console.log("Categories fetched successfully:", response);
            }),
            catchError(error => {
                console.error("Error fetching categories:", error);
                return of({ success: false, message: 'Failed to fetch categories', data: [] });
            })
        );
    }

    /**
     * Fetches a single category by ID from the backend.
     * 
     * @param categoryId - The ID of the category to fetch
     * @returns Observable<any> - Returns a single category object
     */
    getCategoryById(categoryId: string): Observable<any> {
        const url = this.appUrl + `/getById/${categoryId}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get<any>(url, { headers }).pipe(
            catchError(error => {
                console.error("Error fetching category by ID:", error);
                return of({ success: false, message: 'Failed to fetch category', data: null });
            })
        );
    }

    /**
     * Adds a new category to the backend.
     * 
     * @param categoryData - The category object with name, description, and image
     * @returns Observable<any> - Returns the created category object
     */
    addCategory(categoryData: any): Observable<any> {
        const url = this.appUrl + '/add';
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, categoryData, { headers }).pipe(
            catchError(error => {
                console.error("Error adding category:", error);
                return of({ success: false, message: 'Failed to add category' });
            })
        );
    }

    /**
     * Updates an existing category in the backend.
     * 
     * @param categoryId - The ID of the category to update
     * @param categoryData - The updated category object
     * @returns Observable<any> - Returns the updated category object
     */
    updateCategory(categoryId: string, categoryData: any): Observable<any> {
        const url = this.appUrl + `/update/${categoryId}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.put<any>(url, categoryData, { headers }).pipe(
            catchError(error => {
                console.error("Error updating category:", error);
                return of({ success: false, message: 'Failed to update category' });
            })
        );
    }

    /**
     * Deletes a category from the backend.
     * 
     * @param categoryId - The ID of the category to delete
     * @returns Observable<any> - Returns the deletion response
     */
    deleteCategory(categoryId: string): Observable<any> {
        const url = this.appUrl + `/delete/${categoryId}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.delete<any>(url, { headers }).pipe(
            catchError(error => {
                console.error("Error deleting category:", error);
                return of({ success: false, message: 'Failed to delete category' });
            })
        );
    }

    /**
     * Searches for categories by name.
     * 
     * @param searchTerm - The search term to filter categories
     * @returns Observable<any> - Returns filtered categories
     */
    searchCategories(searchTerm: string): Observable<any> {
        const url = this.appUrl + `/search?query=${encodeURIComponent(searchTerm)}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get<any>(url, { headers }).pipe(
            catchError(error => {
                console.error("Error searching categories:", error);
                return of({ success: false, message: 'Failed to search categories', data: [] });
            })
        );
    }
}
