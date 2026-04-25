import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPageComponent implements OnInit {
  cartCount = 0;

  popularBrands = [
    { name: 'Honda', logo: 'assets/brands/honda.png' },
    { name: 'Yamaha', logo: 'assets/brands/yamaha.png' },
    { name: 'Bajaj', logo: 'assets/brands/bajaj.png' },
    { name: 'Hero', logo: 'assets/brands/hero.png' },
    { name: 'TVS', logo: 'assets/brands/tvs.png' },
    { name: 'Royal Enfield', logo: 'assets/brands/royal-enfield.png' }
  ];

  categories = [
    { name: 'Engine Parts', icon: '⚙️', description: 'Pistons, valves, and more' },
    { name: 'Brake System', icon: '🛑', description: 'Brake pads, discs, and rotors' },
    { name: 'Electrical', icon: '🔌', description: 'Batteries, wires, and switches' },
    { name: 'Suspension', icon: '🪜', description: 'Shocks, springs, and arms' },
    { name: 'Body Parts', icon: '🚗', description: 'Panels, lights, and accessories' },
    { name: 'Tires & Wheels', icon: '🛞', description: 'Tires, rims, and tubes' }
  ];

  featuredProducts = [
    { name: 'Honda Brake Pad Set', price: 1200, image: 'assets/products/brake-pad.png' },
    { name: 'Yamaha Engine Oil Filter', price: 450, image: 'assets/products/oil-filter.png' },
    { name: 'Bajaj Spark Plug', price: 180, image: 'assets/products/spark-plug.png' },
    { name: 'Hero Battery 12V', price: 2200, image: 'assets/products/battery.png' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.updateCartCount();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToSellerRegister() {
    this.router.navigate(['/seller-register']);
  }

  navigateToProducts() {
    this.router.navigate(['/vehicle-product']);
  }

  navigateToCart() {
    this.router.navigate(['/view-cart']);
  }

  selectBrand(brand: any) {
    this.router.navigate(['/vehicle-brands'], { queryParams: { brand: brand.name } });
  }

  selectCategory(category: any) {
    this.router.navigate(['/vehicle-category'], { queryParams: { category: category.name } });
  }

  viewProduct(product: any) {
    this.router.navigate(['/vehicle-productDetails'], { queryParams: { product: product.name } });
  }

  private updateCartCount() {
    // Get cart count from OrderService if available
    // For now, set to 0
    this.cartCount = 0;
  }
}
