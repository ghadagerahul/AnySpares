import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../../services/checkout.service';

@Component({
  selector: 'app-payment-method',
  imports: [CommonModule],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.css'
})
export class PaymentMethodComponent implements OnInit {
  selectedMethod: string = '';
  paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay and other cards accepted',
      popular: false
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive your order',
      popular: false
    }
  ];

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    const currentMethod = this.checkoutService.getCheckoutData().paymentMethod;
    if (currentMethod) {
      this.selectedMethod = currentMethod;
    }
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedMethod = methodId;
    this.checkoutService.setPaymentMethod(methodId);
  }

  isMethodSelected(methodId: string): boolean {
    return this.selectedMethod === methodId;
  }
}