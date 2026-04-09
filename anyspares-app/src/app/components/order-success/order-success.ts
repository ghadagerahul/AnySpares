import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../Buyer/navbar-component/navbar-component';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './order-success.html',
  styleUrl: './order-success.css'
})
export class OrderSuccessComponent implements OnInit {
  orderId: string = '';
  estimatedDelivery: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || 'ORD001';
    });

    // Calculate estimated delivery (3-5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4); // 4 days from now for mid-point
    this.estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  continueShopping(): void {
    this.router.navigate(['/vehicle-product']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }
}