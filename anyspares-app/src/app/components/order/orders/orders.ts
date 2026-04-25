import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../Buyer/navbar-component/navbar-component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CheckoutService } from '../../../services/checkout.service';

@Component({
  selector: 'app-orders',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders: any[] = [];
  loading = false;
  paymentMessage = '';
  paymentStatus = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    // Check for payment status from query params
    this.route.queryParams.subscribe(params => {
      if (params['paymentStatus'] === 'success') {
        this.paymentStatus = 'success';
        this.paymentMessage = params['message'] || 'Payment completed successfully!';
      }
    });

    this.loadUserOrders();
  }

  private loadUserOrders(): void {
    const userId = this.checkoutService.getCurrentUserId()?.toString();
    if (!userId) {
      return;
    }

    this.loading = true;
    this.orderService.getUserOrders(userId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          this.orders = response.data;
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  dismissMessage(): void {
    this.paymentMessage = '';
    this.paymentStatus = '';
  }
}