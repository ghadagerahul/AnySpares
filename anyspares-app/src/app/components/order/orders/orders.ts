import { Component } from '@angular/core';
import { NavbarComponent } from "../../Buyer/navbar-component/navbar-component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  orders = [
    {
      id: 1,
      product: 'Carburetor Repair Kit',
      status: 'Delivered',
      date: '2024-03-20',
      price: 449
    },
    {
      id: 2,
      product: 'Brake Pads',
      status: 'In Transit',
      date: '2024-03-18',
      price: 299
    }
  ];
}