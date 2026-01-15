import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

interface Product {
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'Active' | 'OutOfStock' | 'Draft';
  statusLabel: string;
}

@Component({
  selector: 'app-seller-hydraulic-fluids',
  imports: [CommonModule],
  templateUrl: './seller-hydraulic-fluids.html',
  styleUrl: './seller-hydraulic-fluids.css'
})
export class SellerHydraulicFluids {


  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  totalProducts = 35;

  products: Product[] = [
    { name: 'Brake Fluid DOT 4 - Honda Activa', category: 'Hydraulic / Fluids', stock: 40, price: 449, status: 'Active', statusLabel: 'Active' },
    { name: 'Coolant Concentrate - Yamaha R15', category: 'Hydraulic / Fluids', stock: 0, price: 599, status: 'OutOfStock', statusLabel: 'Out of Stock' },
    { name: 'Clutch Fluid - Bajaj Pulsar', category: 'Hydraulic / Fluids', stock: 28, price: 499, status: 'Active', statusLabel: 'Active' },
    { name: 'Power Steering Fluid - Hero Splendor', category: 'Hydraulic / Fluids', stock: 22, price: 699, status: 'Active', statusLabel: 'Active' },
    { name: 'Transmission Fluid - TVS Apache', category: 'Hydraulic / Fluids', stock: 0, price: 799, status: 'Draft', statusLabel: 'Draft' }
  ];

  constructor(private location: Location, private router:Router) { }

  addProduct(): void {
    console.log('Add Product clicked');
    this.router.navigate(['/seller-addproduct']);
  }

  goToEditProduct(){
        this.router.navigate(['/seller-editproduct']);

  }
  goBack() { this.location.back(); }


}
