import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

interface Product {
[x: string]: any;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'Active' | 'OutOfStock' | 'Draft';
  statusLabel: string;
}

@Component({
  selector: 'app-seller-body-parts',
  imports: [CommonModule],
  templateUrl: './seller-body-parts.html',
  styleUrl: './seller-body-parts.css'
})
export class SellerBodyParts {


  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  totalProducts = 52;

  products: Product[] = [
    { name: 'Side Panel - Honda Activa', category: 'Body Parts', stock: 35, price: 1599, status: 'Active', statusLabel: 'Active' },
    { name: 'Headlight Assembly - Yamaha R15', category: 'Body Parts', stock: 0, price: 2199, status: 'OutOfStock', statusLabel: 'Out of Stock' },
    { name: 'Seat Cover - Bajaj Pulsar', category: 'Body Parts', stock: 26, price: 899, status: 'Active', statusLabel: 'Active' },
    { name: 'Mudguard - Hero Splendor', category: 'Body Parts', stock: 19, price: 699, status: 'Active', statusLabel: 'Active' },
    { name: 'Tail Light Unit - TVS Apache', category: 'Body Parts', stock: 0, price: 1299, status: 'Draft', statusLabel: 'Draft' }
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
