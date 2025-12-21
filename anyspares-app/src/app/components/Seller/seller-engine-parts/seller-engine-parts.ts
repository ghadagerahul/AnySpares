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
  selector: 'app-seller-engine-parts',
  imports: [CommonModule],
  templateUrl: './seller-engine-parts.html',
  styleUrl: './seller-engine-parts.css'
})
export class SellerEngineParts {


  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  totalProducts = 42;

  products: Product[] = [
    { name: 'Piston Ring Set - Honda Activa', category: 'Engine Parts', stock: 25, price: 899, status: 'Active', statusLabel: 'Active' },
    { name: 'Cylinder Head Gasket - Yamaha R15', category: 'Engine Parts', stock: 0, price: 1299, status: 'OutOfStock', statusLabel: 'Out of Stock' },
    { name: 'Camshaft Assembly - Bajaj Pulsar', category: 'Engine Parts', stock: 12, price: 2499, status: 'Active', statusLabel: 'Active' },
    { name: 'Valve Set - Hero Splendor', category: 'Engine Parts', stock: 8, price: 1599, status: 'Active', statusLabel: 'Active' },
    { name: 'Connecting Rod - TVS Apache', category: 'Engine Parts', stock: 0, price: 1899, status: 'Draft', statusLabel: 'Draft' }
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
