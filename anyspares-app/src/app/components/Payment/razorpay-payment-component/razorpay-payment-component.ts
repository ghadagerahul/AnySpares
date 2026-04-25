import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '../../../services/checkout.service';
import { OrderService } from '../../../services/order.service';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';

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
  orderId: string = '';
  orderAmount: number = 0;

  private backendUrl = '';
  private razorpayKey = 'rzp_test_SHeIIvLsLonxGH';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.backendUrl = environment.apiUrl + '/payments/razorpay';
    this.paymentForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      currency: ['INR', Validators.required],
      description: ['Payment for spare parts order', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get order data from query params and checkout service
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || localStorage.getItem('pendingOrderId') || '';
      this.orderAmount = parseFloat(params['amount']) || 0;
    });

    // Subscribe to checkout data for order details
    this.checkoutService.checkoutData$.subscribe(data => {
      this.checkoutData = data;
    });

    // Get current checkout data
    this.checkoutData = this.checkoutService.getCheckoutData();

    // Set amount from order or checkout data
    const amount = this.orderAmount || this.calculateTotalAmount();
    this.paymentForm.patchValue({
      amount: amount
    });

    // If we have an order ID, proceed with payment
    if (this.orderId) {
      this.createOrder();
    } else {
      this.message = 'Order information not found. Please try again.';
    }
  }

  calculateTotalAmount(): number {
    const subtotal = this.checkoutData.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    return subtotal + shipping + tax;
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

          this.router.navigate(['/orders'], {
            queryParams: {
              orderId: this.orderId,
              paymentStatus: 'success',
              message: 'Payment completed successfully'
            }
          }); 
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
    // Update order payment status
    this.updateOrderPaymentStatus(this.orderId, 'paid').subscribe({
      next: (response: any) => {
        if (response && response.success !== false) {
          // Clear the bucket and checkout data
          this.checkoutService.clearCheckoutData();
          this.orderService.clearBucket();

          // Clear pending order ID
          localStorage.removeItem('pendingOrderId');

          // Navigate to orders page with success status
          this.router.navigate(['/orders'], {
            queryParams: {
              orderId: this.orderId,
              paymentStatus: 'success',
              message: 'Payment completed successfully'
            }
          });
        } else {
          this.message = 'Order update failed after payment. Please contact support.';
        }
      },
      error: (error: any) => {
        console.error('Error updating order after payment:', error);
        this.message = 'Order update failed. Please contact support.';
      }
    });
  }

  private updateOrderPaymentStatus(orderId: string, status: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/buyers/vehicle-orders/payment-status/${orderId}/${status}`, {});
  }
}
