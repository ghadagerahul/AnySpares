import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleModelService } from '../../../services/Buyer/vehicle-model.services';
import { ActivatedRoute } from '@angular/router';
import { VehicleProductService } from '../../../services/Buyer/vehicle-product.services';

interface VehicleProductDto {
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
  standalone: true, // ✅ required for standalone components
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-products.html',
  styleUrls: ['./vehicle-products.css'], // ✅ plural
})
export class VehicleProducts implements OnInit {

  products: VehicleProductDto[] = [];

  modelId: string | null = null;
  category: string | null = null;
  vehicleType: string | null = null;

  constructor(
    private vehicleProductService: VehicleProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //  this.setDummyData();

    this.modelId = this.route.snapshot.queryParamMap.get('modelId');
    console.log('Received modelId:', this.modelId);

    this.category = this.route.snapshot.queryParamMap.get('category');
    console.log('Received category:', this.category);

    this.vehicleType = this.route.snapshot.queryParamMap.get('vehicleType');
    console.log('Received vehicleType:', this.vehicleType);

    // Uncomment when backend is ready
    this.loadProductsData();
  }

  setDummyData(): void {
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

  loadProductsData(): void {
    this.vehicleProductService
      .loadProductData(this.modelId, this.category, this.vehicleType)
      .subscribe((res: any) => {
        console.log('Fetched products:', res);
        if (res.success) {
          this.products = res.data;
        } else {
          console.warn('API responded with success: false. No products loaded.');
          this.products = [];
        }
      });
  }
}
