import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from "rxjs";

export interface ProductData {
  id?: number;
  name: string;
  type: 'OEM' | 'Aftermarket';
  rating: number;
  reviews: number;
  discountedPrice: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
  description?: string;
  inStock?: boolean;
  specs?: {
    partNumber: string;
    brandCompatibility: string[];
    material: string;
    warranty: string;
    weight: string;
    dimensions: string;
  };
}

export interface CartItem {
  productId: number;
  quantity: number;
  productName?: string;
  price?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class VehicleProductDetailsService {

    private productUrl = environment.apiUrl + "/buyers/vehicle-products";
    private cartUrl = environment.apiUrl + "/buyers/cart";
    private ordersUrl = environment.apiUrl + "/buyers/orders";

    constructor(private http: HttpClient) { }

    /**
     * Load product data by product ID
     */
    getProductById(productId: number, userId: number): Observable<ApiResponse<ProductData>> {
        const url = `${this.productUrl}/details/${productId}/${userId}`;
        return this.http.get<ApiResponse<ProductData>>(url);
    }

    /**
     * Load product data with filters
     */
    loadProductData(modelId: string | null, category: string | null, vehicleType: string | null): Observable<any> {
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

        return this.http.get(this.productUrl, { params });
    }

    /**
     * Add product to shopping bucket/cart
     */
    addToBucket(productId: number, quantity: number, userId: number): Observable<ApiResponse<CartItem>> {
        const url = `${this.cartUrl}/add`;
        const body = { productId, quantity, userId };
        return this.http.post<ApiResponse<CartItem>>(url, body);
    }

    /**
     * Update cart item quantity
     */
    updateCartItem(productId: number, quantity: number, userId: number): Observable<ApiResponse<CartItem>> {
        const url = `${this.cartUrl}/update`;
        const body = { productId, quantity, userId };
        return this.http.put<ApiResponse<CartItem>>(url, body);
    }

    /**
     * Remove item from cart
     */
    removeFromCart(productId: number, userId: number ): Observable<ApiResponse<any>> {
        const url = `${this.cartUrl}/${productId}`;
        return this.http.delete<ApiResponse<any>>(url);
    }

    /**
     * Get current cart items
     */
    getCartItems(): Observable<ApiResponse<CartItem[]>> {
        return this.http.get<ApiResponse<CartItem[]>>(this.cartUrl);
    }

    /**
     * Place order from cart
     */
    createOrder(orderData: any): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.ordersUrl}/create`, orderData);
    }

    /**
     * Get product reviews
     */
    getProductReviews(productId: number): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.productUrl}/${productId}/reviews`);
    }

    /**
     * Submit product review
     */
    submitReview(productId: number, rating: number, comment: string): Observable<ApiResponse<any>> {
        const body = { rating, comment };
        return this.http.post<ApiResponse<any>>(`${this.productUrl}/${productId}/reviews`, body);
    }

    /**
     * Get similar/related products
     */
    getRelatedProducts(productId: number, limit: number = 5): Observable<ApiResponse<ProductData[]>> {
        let params = new HttpParams();
        params = params.set('limit', limit.toString());
        return this.http.get<ApiResponse<ProductData[]>>(`${this.productUrl}/${productId}/related`, { params });
    }
}

