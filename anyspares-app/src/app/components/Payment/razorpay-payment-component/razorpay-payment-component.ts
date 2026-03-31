import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../services/checkout.service';
import { OrderService } from '../../../services/order.service';

declare var Razorpay: any;

@Component({
  selector: 'app-razorpay-payment-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './razorpay-payment-component.html',
  styleUrls: ['./razorpay-payment-component.css'],
})
export class RazorpayPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  loading = false;
  message = '';
  checkoutData: any;

  private backendUrl = 'http://localhost:8085/rozorpay';
  private razorpayKey = 'rzp_test_SHeIIvLsLonxGH';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      currency: ['INR', Validators.required],
      description: ['Payment for spare parts order', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkoutData = this.checkoutService.getCheckoutData();

    // Set amount from checkout data
    const totalAmount = this.calculateTotalAmount();
    this.paymentForm.patchValue({
      amount: totalAmount
    });

    // If COD, place order directly
    if (this.checkoutData.paymentMethod === 'cod') {
      this.placeOrderForCOD();
    }
  }

  calculateTotalAmount(): number {
    const subtotal = this.checkoutData.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const codCharges = this.checkoutData.paymentMethod === 'cod' ? 50 : 0;
    return subtotal + shipping + tax + codCharges;
  }

  placeOrderForCOD(): void {
    this.loading = true;
    this.message = 'Placing your order...';

    const buyerId = localStorage.getItem('userId') || 'guest-user';

    this.orderService.placeOrder(buyerId)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.checkoutService.clearCheckoutData();
            this.orderService.clearBucket();
            this.router.navigate(['/order-success'], {
              queryParams: { orderId: response.orderId || 'COD001' }
            });
          } else {
            this.message = response.message || 'Failed to place order';
            this.loading = false;
          }
        },
        error: (error: any) => {
          console.error('Error placing COD order:', error);
          this.message = 'Failed to place order. Please try again.';
          this.loading = false;
        }
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
        next: (order: any) => {
          console.log('Create Order Response:', JSON.stringify(order));
          this.openCheckout(order);
        },
        error: (err: any) => {
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

          // Place the order after successful payment
          this.placeOrderAfterPayment();
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

  private placeOrderAfterPayment(): void {
    const buyerId = localStorage.getItem('userId') || 'guest-user';

    this.orderService.placeOrder(buyerId)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.checkoutService.clearCheckoutData();
            this.orderService.clearBucket();
            this.router.navigate(['/order-success'], {
              queryParams: { orderId: response.orderId || 'PAY001' }
            });
          } else {
            this.message = 'Order placement failed after payment. Please contact support.';
          }
        },
        error: (error: any) => {
          console.error('Error placing order after payment:', error);
          this.message = 'Order placement failed. Please contact support.';
        }
      });
  }
}