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
  selector: 'app-seller-suspension-parts',
  imports: [CommonModule],
  templateUrl: './seller-suspension-parts.html',
  styleUrl: './seller-suspension-parts.css'
})
export class SellerSuspensionParts {


  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  totalProducts = 40;

  products: Product[] = [
    { name: 'Shock Absorber - Honda Activa', category: 'Suspension Parts', stock: 28, price: 1899, status: 'Active', statusLabel: 'Active' },
    { name: 'Front Fork Assembly - Yamaha R15', category: 'Suspension Parts', stock: 0, price: 4299, status: 'OutOfStock', statusLabel: 'Out of Stock' },
    { name: 'Spring Set - Bajaj Pulsar', category: 'Suspension Parts', stock: 14, price: 1299, status: 'Active', statusLabel: 'Active' },
    { name: 'Suspension Link - Hero Splendor', category: 'Suspension Parts', stock: 32, price: 799, status: 'Active', statusLabel: 'Active' },
    { name: 'Damper Unit - TVS Apache', category: 'Suspension Parts', stock: 0, price: 2199, status: 'Draft', statusLabel: 'Draft' }
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
