import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { BucketItem } from './order.service';
import { UserDetails } from '../components/shared/user-details.model';

export interface Address {
  id?: string;
  userId?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactDetails {
  userId?: string;
  name: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckoutData {
  items: BucketItem[];
  address: Address | null;
  contact: ContactDetails | null;
  paymentMethod: string;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private checkoutDataSubject = new BehaviorSubject<CheckoutData>({
    items: [],
    address: null,
    contact: null,
    paymentMethod: '',
    totalAmount: 0
  });

  public checkoutData$ = this.checkoutDataSubject.asObservable();

  private apiUrl = environment.apiUrl + '/buyers/checkout';

  constructor(private http: HttpClient) { }

  private parseStoredUser(): any | null {
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!storedUser) {
      console.warn('No currentUser found in storage.');
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing currentUser from storage:', error, storedUser);
      return null;
    }
  }

  private resolveUserId(user: any): number | null {
    if (!user || typeof user !== 'object') {
      return null;
    }

    const rawId = user.id ?? user.userId ?? user._id;
    const userId = typeof rawId === 'number' ? rawId : Number(rawId);

    if (!Number.isFinite(userId) || userId <= 0) {
      console.warn('Invalid currentUser id:', rawId);
      return null;
    }

    return userId;
  }

  public getCurrentUserId(): number | null {
    const currentUser = this.parseStoredUser();
    return this.resolveUserId(currentUser);
  }

  // Address Management APIs
  saveAddress(address: Address): Observable<any> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('Invalid user ID for saving address'));
    }

    const payload = { ...address, userId };
    console.log('Saving address with payload:', JSON.stringify(payload));
    return this.http.post(`${this.apiUrl}/order-address`, payload);
  }

  getUserAddresses(): Observable<any> {
    const userId = this.getCurrentUserId();
    console.log('Fetching addresses for userId:', userId);
    if (!userId) {
      return throwError(() => new Error('Invalid user ID for loading addresses'));
    }
    const url = `${this.apiUrl}/order-address/${userId}`;
    console.log('URL for fetching addresses:', url);
    return this.http.get(url);
  }

  updateAddress(addressId: string, address: Partial<Address>): Observable<any> {
    console.log('Updating address with id:', addressId, 'payload:', JSON.stringify(address));
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('Invalid user ID for updating address'));
    }

    const payload = { ...address, userId };
    return this.http.put(`${this.apiUrl}/order-address/${addressId}`, payload);
  }

  deleteAddress(addressId: string): Observable<any> {
    console.log('Deleting address with id:', addressId);
    return this.http.delete(`${this.apiUrl}/order-address/${addressId}`);
  }

  // ======================= Contact Management APIs =======================
  saveContactDetails(contact: ContactDetails): Observable<any> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('Invalid user ID for saving contact details'));
    }

    const payload = { ...contact, userId };
    return this.http.post(`${this.apiUrl}/order-contact`, payload);
  }

  getUserContactDetails(): Observable<any> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('Invalid user ID for loading contact details'));
    }

    return this.http.get(`${this.apiUrl}/order-contact/${userId}`);
  }

  // Order Management APIs
  placeOrder(orderData: {
    userId: string;
    items: BucketItem[];
    address: Address;
    contact: ContactDetails;
    paymentMethod: string;
    totalAmount: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/vehicle-orders/place-order`, orderData);
  }

  getUserOrders(): Observable<any> {
    const userId = this.getCurrentUserId();
    return this.http.get(`${this.apiUrl}/vehicle-orders/user/${userId}`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicle-orders/${orderId}`);
  }

  // Checkout Data Management
  setItems(items: BucketItem[]): void {
    const currentData = this.checkoutDataSubject.value;
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.checkoutDataSubject.next({
      ...currentData,
      items,
      totalAmount
    });
  }

  setAddress(address: Address): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({
      ...currentData,
      address
    });
  }

  setContact(contact: ContactDetails | null): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({
      ...currentData,
      contact
    });
  }

  setPaymentMethod(method: string): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({
      ...currentData,
      paymentMethod: method
    });
  }

  getCheckoutData(): CheckoutData {
    return this.checkoutDataSubject.value;
  }

  clearCheckoutData(): void {
    this.checkoutDataSubject.next({
      items: [],
      address: null,
      contact: null,
      paymentMethod: '',
      totalAmount: 0
    });
  }

  isCheckoutComplete(): boolean {
    const data = this.checkoutDataSubject.value;
    return !!(data.items.length > 0 && data.address && data.contact && data.paymentMethod);
  }

}