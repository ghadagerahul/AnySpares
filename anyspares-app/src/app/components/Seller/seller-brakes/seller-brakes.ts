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
  selector: 'app-seller-brakes',
  imports: [CommonModule],
  templateUrl: './seller-brakes.html',
  styleUrl: './seller-brakes.css'
})
export class SellerBrakes {


  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  totalProducts = 38;

  products: Product[] = [
    { name: 'Brake Pad Set - Honda Activa', category: 'Brakes', stock: 30, price: 599, status: 'Active', statusLabel: 'Active' },
    { name: 'Brake Disc - Yamaha R15', category: 'Brakes', stock: 0, price: 1499, status: 'OutOfStock', statusLabel: 'Out of Stock' },
    { name: 'Brake Caliper Assembly - Bajaj Pulsar', category: 'Brakes', stock: 15, price: 2199, status: 'Active', statusLabel: 'Active' },
    { name: 'Brake Fluid DOT 4 - Hero Splendor', category: 'Brakes', stock: 20, price: 399, status: 'Active', statusLabel: 'Active' },
    { name: 'Brake Shoes - TVS Apache', category: 'Brakes', stock: 0, price: 799, status: 'Draft', statusLabel: 'Draft' }
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
