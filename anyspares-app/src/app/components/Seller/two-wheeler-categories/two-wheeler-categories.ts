import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Category {
  name: string;
  totalProducts: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-two-wheeler-categories',
  imports: [CommonModule],
  templateUrl: './two-wheeler-categories.html',
  styleUrl: './two-wheeler-categories.css'
})
export class SellerTwoWheelerCategories {

  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  constructor(private location: Location, private router: Router) { }

  categories: Category[] = [
    { name: 'Engine Parts', totalProducts: 42, icon: '⚙️', color: 'green' },
    { name: 'Brakes', totalProducts: 28, icon: '🛑', color: 'red' },
    { name: 'Electrical', totalProducts: 35, icon: '⚡', color: 'orange' },
    { name: 'Suspension', totalProducts: 18, icon: '🌬️', color: 'purple' },
    { name: 'Body Parts', totalProducts: 15, icon: '🚗', color: 'blue' },
    { name: 'Hydraulic / Fluids', totalProducts: 7, icon: '💧', color: 'cyan' }
  ];

  summary = {
    total: 145,
    active: 128,
    outOfStock: 17
  };

  viewProducts(category: Category): void {
    console.log('View products for:', category.name);
    // later: route to product list page
    const categoryName = category.name;

    //ex
    if (categoryName != null && categoryName != undefined && categoryName == 'Engine Parts') {
      this.router.navigate(['/seller-engine-parts']);
    }

  }

  goBack() { this.location.back(); }

}
