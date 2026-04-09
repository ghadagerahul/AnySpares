import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService, CheckoutData } from '../../../services/checkout.service';

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css'
})
export class OrderSummaryComponent implements OnInit {
  checkoutData: CheckoutData;

  constructor(private checkoutService: CheckoutService) {
    this.checkoutData = this.checkoutService.getCheckoutData();
  }

  ngOnInit(): void {
    this.checkoutService.checkoutData$.subscribe(data => {
      this.checkoutData = data;
    });
  }

  getSubtotal(): number {
    return this.checkoutData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() > 500 ? 0 : 50;
  }

  getTaxAmount(): number {
    return Math.round(this.getSubtotal() * 0.18); // 18% GST
  }

  getTotalAmount(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTaxAmount();
  }
}