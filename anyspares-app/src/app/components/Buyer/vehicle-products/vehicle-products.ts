import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';



interface Product {
  name: string;
  type: 'OEM' | 'Aftermarket';
  rating: number;
  reviews: number;
  discountedPrice: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
}

@Component({
  selector: 'app-vehicle-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-products.html',
  styleUrl: './vehicle-products.css',
})
export class VehicleProducts {

  products: Product[] = [];

  ngOnInit(): void {

    this.products = [
      {
        name: 'Air Filter Element',
        type: 'OEM',
        rating: 4.6,
        reviews: 145,
        discountedPrice: 399,
        originalPrice: 499,
        discount: 20,
        imageUrl: 'assets/two-wheelers/product/air-filter.jpg'
      },
      {
        name: 'Engine Oil Filter',
        type: 'OEM',
        rating: 4.5,
        reviews: 128,
        discountedPrice: 299,
        originalPrice: 399,
        discount: 25,
        imageUrl: 'assets/two-wheelers/product/oil-filter.jpg'
      },
      {
        name: 'Spark Plug Set (2pcs)',
        type: 'Aftermarket',
        rating: 4.3,
        reviews: 89,
        discountedPrice: 189,
        originalPrice: 249,
        discount: 24,
        imageUrl: 'assets/two-wheelers/product/spark-plug.jpg'
      }
    ];
  }

}
