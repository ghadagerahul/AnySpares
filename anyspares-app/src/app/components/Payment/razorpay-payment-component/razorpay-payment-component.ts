import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


declare var Razorpay: any;

@Component({
  selector: 'app-razorpay-payment-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './razorpay-payment-component.html',
  styleUrls: ['./razorpay-payment-component.css'],
})
export class RazorpayPaymentComponent {

  paymentForm: FormGroup;
  loading = false;
  message = '';

  private backendUrl = 'http://localhost:8085/rozorpay';
  private razorpayKey = 'rzp_test_SHeIIvLsLonxGH';

  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.paymentForm = this.fb.group({
      amount: [300, [Validators.required, Validators.min(1)]],
      currency: ['INR', Validators.required],
      description: ['Payment for spare parts', Validators.required]
    });
  }

  // STEP 1 → User clicks Pay
  pay() {
    if (this.paymentForm.invalid) {
      this.message = 'Please fill in all required fields correctly.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.message = 'Creating payment order...';
    this.cdr.detectChanges();

    this.createOrder();
  }

  private createOrder() {
    const formValue = this.paymentForm.value;
    const body = {
      amount: formValue.amount * 100, // Razorpay expects amount in paisa
      currency: formValue.currency,
      receipt: 'ORD_' + new Date().getTime()
    };

    this.http.post<any>(`${this.backendUrl}/create-order`, body)
      .subscribe({
        next: (order) => {
          console.log('Create Order Response:', JSON.stringify(order));
          this.openCheckout(order);
        },
        error: (err) => {
          console.error('Create Order Error:', err);
          this.loading = false;
          this.message = 'Failed to create payment order. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }


  // STEP 3 → Open Razorpay Checkout
  private openCheckout(order: any) {
    const formValue = this.paymentForm.value;

    const options = {
      key: this.razorpayKey,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'AnySpares',
      description: formValue.description,

      handler: (response: any) => {
        this.verifyPayment(response);
      },

      modal: {
        ondismiss: () => {
          this.loading = false;
          this.message = 'Payment was cancelled.';
          this.cdr.detectChanges();
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }



  // STEP 4 → Verify Payment
  private verifyPayment(response: any) {

    this.http.post(`${this.backendUrl}/verify`, response)
      .subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Payment successful! Your order has been confirmed. ✅';
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.message = 'Payment verification failed. Please contact support if amount was debited. ❌';
          this.cdr.detectChanges();
        },
        complete: () => {
          this.cdr.detectChanges();
        }
      });
  }

}
