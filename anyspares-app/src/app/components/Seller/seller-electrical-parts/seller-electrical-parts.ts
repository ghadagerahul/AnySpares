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
  selector: 'app-seller-electrical-parts',
  imports: [CommonModule],
  templateUrl: './seller-electrical-parts.html',
  styleUrl: './seller-electrical-parts.css'
})
export class SellerElectricalParts {


  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  totalProducts = 45;

  products: Product[] = [
    { name: 'Battery 12V - Honda Activa', category: 'Electrical Parts', stock: 22, price: 2499, status: 'Active', statusLabel: 'Active' },
    { name: 'Alternator - Yamaha R15', category: 'Electrical Parts', stock: 0, price: 3899, status: 'OutOfStock', statusLabel: 'Out of Stock' },
    { name: 'Starter Motor - Bajaj Pulsar', category: 'Electrical Parts', stock: 18, price: 1899, status: 'Active', statusLabel: 'Active' },
    { name: 'Ignition Coil - Hero Splendor', category: 'Electrical Parts', stock: 25, price: 1299, status: 'Active', statusLabel: 'Active' },
    { name: 'Spark Plug Set - TVS Apache', category: 'Electrical Parts', stock: 0, price: 899, status: 'Draft', statusLabel: 'Draft' }
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
