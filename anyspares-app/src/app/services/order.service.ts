import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private apiUrl = environment.apiUrl + '/orders';
  private bucketSubject = new BehaviorSubject<BucketItem[]>([]);
  public bucket$ = this.bucketSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadBucketFromStorage();
  }

  /**
   * Load bucket from localStorage
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
   * Save bucket to localStorage
   */
  private saveBucketToStorage(): void {
    const currentBucket = this.bucketSubject.value;
    localStorage.setItem('bucket', JSON.stringify(currentBucket));
  }

  /**
   * Get current bucket items
   */
  getBucketItems(): BucketItem[] {
    return this.bucketSubject.value;
  }

  /**
   * Add item to bucket
   */
  addItemToBucket(item: BucketItem): void {
    const currentBucket = this.bucketSubject.value;
    const existingItem = currentBucket.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentBucket.push(item);
    }

    this.bucketSubject.next([...currentBucket]);
    this.saveBucketToStorage();
  }

  /**
   * Remove item from bucket
   */
  removeItemFromBucket(productId: string): void {
    const currentBucket = this.bucketSubject.value;
    const filteredBucket = currentBucket.filter(i => i.productId !== productId);
    this.bucketSubject.next(filteredBucket);
    this.saveBucketToStorage();
  }

  /**
   * Update quantity of item in bucket
   */
  updateItemQuantity(productId: string, quantity: number): void {
    const currentBucket = this.bucketSubject.value;
    const item = currentBucket.find(i => i.productId === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeItemFromBucket(productId);
      } else {
        item.quantity = quantity;
        this.bucketSubject.next([...currentBucket]);
        this.saveBucketToStorage();
      }
    }
  }

  /**
   * Clear entire bucket
   */
  clearBucket(): void {
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
}
