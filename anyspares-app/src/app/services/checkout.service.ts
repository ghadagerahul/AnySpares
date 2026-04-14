import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BucketItem } from './order.service';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

export interface Address {
  id?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface ContactDetails {
  name: string;
  phone: string;
  email: string;
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
  backendUrl = environment.apiUrl+'/payments/razorpay';

  constructor(private http: HttpClient) {}


  createOrder(totalAmt: number) {
   // const formValue = this.paymentForm.value;
    const body = {
      amount: totalAmt * 100, // Razorpay expects amount in paisa
      currency: 'INR',
      receipt: 'ORD_' + new Date().getTime()
    };

    this.http.post<any>(`${this.backendUrl}/create-order`, body)
      .subscribe({
        next: (order: any) => {
          console.log('Create Order Response:', JSON.stringify(order));
         // this.openCheckout(order);
        },
        error: (err: any) => {
          console.error('Create Order Error:', err);
          //this.loading = false;
          //this.message = 'Failed to create payment order. Please try again.';
          //this.cdr.detectChanges();
        }
      });
  }



  /**
   * Set checkout items
   */
  setItems(items: BucketItem[]): void {
    const currentData = this.checkoutDataSubject.value;
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.checkoutDataSubject.next({
      ...currentData,
      items,
      totalAmount
    });
  }

  /**
   * Set delivery address
   */
  setAddress(address: Address): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({
      ...currentData,
      address
    });
  }

  /**
   * Set contact details
   */
  setContact(contact: ContactDetails): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({
      ...currentData,
      contact
    });
  }

  /**
   * Set payment method
   */
  setPaymentMethod(method: string): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({
      ...currentData,
      paymentMethod: method
    });
  }

  /**
   * Get current checkout data
   */
  getCheckoutData(): CheckoutData {
    return this.checkoutDataSubject.value;
  }

  /**
   * Clear checkout data
   */
  clearCheckoutData(): void {
    this.checkoutDataSubject.next({
      items: [],
      address: null,
      contact: null,
      paymentMethod: '',
      totalAmount: 0
    });
  }

  /**
   * Check if checkout is complete
   */
  isCheckoutComplete(): boolean {
    const data = this.checkoutDataSubject.value;
    return !!(data.items.length > 0 && data.address && data.contact && data.paymentMethod);
  }
}