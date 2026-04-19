import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  private getCurrentUserId(): number {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as UserDetails;
    return currentUser?.id || 0;
  }

  // Address Management APIs
  saveAddress(address: Address): Observable<any> {
    const userId = this.getCurrentUserId();
    const payload = { ...address, userId };
    console.log('Saving address with payload:', JSON.stringify(payload));
    return this.http.post(`${this.apiUrl}/order-address`, payload);
  }

  getUserAddresses(): Observable<any> {
    const userId = this.getCurrentUserId();
    return this.http.get(`${this.apiUrl}/order-address/${userId}`);
  }

  updateAddress(addressId: string, address: Partial<Address>): Observable<any> {
    console.log('Updating address with id:', addressId, 'payload:', JSON.stringify(address));
     const userId = this.getCurrentUserId();
    const payload = { ...address, userId };
    return this.http.put(`${this.apiUrl}/order-address/${addressId}`, payload);
  }

  deleteAddress(addressId: string): Observable<any> {
    console.log('Deleting address with id:', addressId);
    return this.http.delete(`${this.apiUrl}/order-address/${addressId}`);
  }

  // ======================= Contact Management APIs =======================
  saveContactDetails(contact: ContactDetails): Observable<any> {
    const userId :number= this.getCurrentUserId();
    const payload = { ...contact, userId };
    return this.http.post(`${this.apiUrl}/order-contact`, payload);
  }

  getUserContactDetails(): Observable<any> {
    const userId = this.getCurrentUserId();
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
    return this.http.post(`${this.apiUrl}/api/orders/place-order`, orderData);
  }

  getUserOrders(): Observable<any> {
    const userId = this.getCurrentUserId();
    return this.http.get(`${this.apiUrl}/api/orders/user/${userId}`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/orders/${orderId}`);
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