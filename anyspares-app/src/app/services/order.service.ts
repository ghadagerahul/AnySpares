import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Constants } from '../Constants/Constants';
import { Address, ContactDetails } from './checkout.service';

export interface BucketItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description?: string;
}

export interface Order {
  items: BucketItem[];
  totalPrice: number;
  buyerId: string;
  orderDate?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + '/buyers';
  private bucketSubject = new BehaviorSubject<BucketItem[]>([]);
  public bucket$ = this.bucketSubject.asObservable();

  private bucketApiUrl = environment.apiUrl + '/buyers/cart'; 


  constructor(private http: HttpClient) {
    this.loadBucketFromAPI(); 
  }

  /**
   * Load bucket from API instead of localStorage
   */
  private loadBucketFromAPI(): void {
    const userId = this.getCurrentUserId(); // You'll need to implement this
    if (userId) {
      this.getBucketFromAPI(userId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.bucketSubject.next(response.data);
          }
        },
        error: (error) => {
          console.error('Error loading bucket from API:', error);
          // Fallback to localStorage if API fails
          this.loadBucketFromStorage();
        }
      });
    } else {
      // Fallback for guest users
      this.loadBucketFromStorage();
    }
  }

  /**
   * Fallback: Load bucket from localStorage (for guest users)
   */
  private loadBucketFromStorage(): void {
    const savedBucket = localStorage.getItem('bucket');
    if (savedBucket) {
      try {
        const bucketItems = JSON.parse(savedBucket);
        this.bucketSubject.next(bucketItems);
      } catch (error) {
        console.error('Error loading bucket from storage:', error);
      }
    }
  }

  /**
   * Get current user ID (implement based on your auth service)
   */
  private getCurrentUserId(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser?.id || null;
  }

  /**
   * Get bucket from API
   */
  getBucketFromAPI(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.bucketApiUrl}/view-bucket/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching bucket from API:', error);
        return of({ success: false, message: 'Failed to fetch bucket', data: [] });
      })
    );
  }

  /**
   * Add item to bucket via API
   */
  addItemToBucketAPI(userId: string, item: BucketItem): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = { userId, item };
    return this.http.post<any>(`${this.bucketApiUrl}/add`, payload, { headers }).pipe(
      catchError(error => {
        console.error('Error adding item to bucket:', error);
        return of({ success: false, message: 'Failed to add item to bucket' });
      })
    );
  }

  /**
   * Update item quantity in bucket via API
   */
  updateBucketItemAPI(userId: string, productId: string, quantity: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = { userId, productId, quantity };
    return this.http.put<any>(`${this.bucketApiUrl}/update`, payload, { headers }).pipe(
      catchError(error => {
        console.error('Error updating bucket item:', error);
        return of({ success: false, message: 'Failed to update item quantity' });
      })
    );
  }

  /**
   * Remove item from bucket via API
   */
  removeBucketItemAPI(userId: string, productId: string, removeType: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.bucketApiUrl}/remove/${userId}/${productId}/${removeType}`, { headers }).pipe(
      catchError(error => {
        console.error('Error removing bucket item:', error);
        return of({ success: false, message: 'Failed to remove item from bucket' });
      })
    );
  }

  /**
   * Clear bucket via API
   */
  clearBucketAPI(userId: string, productId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.removeBucketItemAPI(userId, productId, Constants.REMOVETYPE_ALL).pipe( 
      catchError(error => {
        console.error('Error clearing bucket:', error);
        return of({ success: false, message: 'Failed to clear bucket' });
      })
    );
  }

  /**
   * Get current bucket items
   */
  getBucketItems(): BucketItem[] {
    return this.bucketSubject.value;
  }

  /**
   * Add item to bucket (now uses API)
   */
  addItemToBucket(item: BucketItem): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      // Use API for logged-in users
      this.addItemToBucketAPI(userId, item).subscribe({
        next: (response) => {
          if (response.success) {
            // Update local state with API response
            this.bucketSubject.next(response.data || []);
          } else {
            console.error('Failed to add item to bucket:', response.message);
          }
        },
        error: (error) => {
          console.error('API error adding item:', error);
          // Fallback to localStorage for offline functionality
          this.addItemToBucketLocal(item);
        }
      });
    } else {
      // Fallback for guest users
      this.addItemToBucketLocal(item);
    }
  }

  /**
   * Local fallback for adding item (guest users)
   */
  private addItemToBucketLocal(item: BucketItem): void {
    const currentBucket = this.bucketSubject.value;
    const existingItem = currentBucket.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentBucket.push(item);
    }

    this.bucketSubject.next([...currentBucket]);
    // Save to localStorage for guest users
    localStorage.setItem('bucket', JSON.stringify(this.bucketSubject.value));
  }

  /**
   * Remove item from bucket (now uses API)
   */
  removeItemFromBucket(productId: string): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      // Use API for logged-in users
      this.removeBucketItemAPI(userId, productId, Constants.REMOVETYPE_SINGLE).subscribe({
        next: (response) => {
          if (response.success) {
            // Update local state with API response
            this.bucketSubject.next(response.data || []);
          } else {
            console.error('Failed to remove item from bucket:', response.message);
          }
        },
        error: (error) => {
          console.error('API error removing item:', error);
          // Fallback to localStorage
          this.removeItemFromBucketLocal(productId);
        }
      });
    } else {
      // Fallback for guest users
      this.removeItemFromBucketLocal(productId);
    }
  }

  /**
   * Local fallback for removing item (guest users)
   */
  private removeItemFromBucketLocal(productId: string): void {
    const currentBucket = this.bucketSubject.value;
    const filteredBucket = currentBucket.filter(i => i.productId !== productId);
    this.bucketSubject.next(filteredBucket);
    // Save to localStorage for guest users
    localStorage.setItem('bucket', JSON.stringify(this.bucketSubject.value));
  }

  /**
   * Update quantity of item in bucket (now uses API)
   */
  updateItemQuantity(productId: string, quantity: number): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      // Use API for logged-in users
      this.updateBucketItemAPI(userId, productId, quantity).subscribe({
        next: (response) => {
          if (response.success) {
            // Update local state with API response
            this.bucketSubject.next(response.data || []);
          } else {
            console.error('Failed to update item quantity:', response.message);
          }
        },
        error: (error) => {
          console.error('API error updating quantity:', error);
          // Fallback to localStorage
          this.updateItemQuantityLocal(productId, quantity);
        }
      });
    } else {
      // Fallback for guest users
      this.updateItemQuantityLocal(productId, quantity);
    }
  }

  /**
   * Local fallback for updating quantity (guest users)
   */
  private updateItemQuantityLocal(productId: string, quantity: number): void {
    const currentBucket = this.bucketSubject.value;
    const item = currentBucket.find(i => i.productId === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeItemFromBucketLocal(productId);
      } else {
        item.quantity = quantity;
        this.bucketSubject.next([...currentBucket]);
        // Save to localStorage for guest users
        localStorage.setItem('bucket', JSON.stringify(this.bucketSubject.value));
      }
    }
  }

  /**
   * Clear entire bucket (now uses API)
   */
  clearBucket(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      // Use API for logged-in users
      this.clearBucketAPI(userId, '1').subscribe({
        next: (response) => {
          if (response.success) {
            // Update local state
            this.bucketSubject.next([]);
          } else {
            console.error('Failed to clear bucket:', response.message);
          }
        },
        error: (error) => {
          console.error('API error clearing bucket:', error);
          // Fallback to localStorage
          this.clearBucketLocal();
        }
      });
    } else {
      // Fallback for guest users
      this.clearBucketLocal();
    }
  }

  /**
   * Local fallback for clearing bucket (guest users)
   */
  private clearBucketLocal(): void {
    this.bucketSubject.next([]);
    localStorage.removeItem('bucket');
  }

  /**
   * Get total price of bucket
   */
  getTotalPrice(): number {
    const currentBucket = this.bucketSubject.value;
    return currentBucket.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Get bucket item count
   */
  getBucketCount(): number {
    const currentBucket = this.bucketSubject.value;
    return currentBucket.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Place an order with bucket items
   */
  placeOrder(buyerId: string): Observable<any> {
    const currentBucket = this.bucketSubject.value;
    const order: Order = {
      items: currentBucket,
      totalPrice: this.getTotalPrice(),
      buyerId: buyerId,
      orderDate: new Date().toISOString(),
      status: 'Pending'
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/place-order`, order, { headers }).pipe(
      catchError(error => {
        console.error('Error placing order:', error);
        return of({ success: false, message: 'Failed to place order' });
      })
    );
  }

  /**
   * Get user orders
   */
  getUserOrders(buyerId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any>(`${this.apiUrl}/user-orders/${buyerId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user orders:', error);
        return of({ success: false, message: 'Failed to fetch orders', data: [] });
      })
    );
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any>(`${this.apiUrl}/${orderId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching order:', error);
        return of({ success: false, message: 'Failed to fetch order' });
      })
    );
  }



  // Order Management APIs
  //===================================================
  proceedToPayment(orderData: {
    userId: string;
    items: BucketItem[];
    address: Address;
    contact: ContactDetails;
    paymentMethod: string;
    totalAmount: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/vehicle-orders/place-order`, orderData);
  }

}
