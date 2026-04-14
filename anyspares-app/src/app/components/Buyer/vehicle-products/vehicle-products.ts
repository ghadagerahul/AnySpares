import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleModelService } from '../../../services/Buyer/vehicle-model.services';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleProductService } from '../../../services/Buyer/vehicle-product.services';
import { NavbarComponent } from "../navbar-component/navbar-component";



@Component({
  selector: 'app-vehicle-products',
  standalone: true, // ✅ required for standalone components
  imports: [CommonModule, FormsModule, NavbarComponent],
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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.modelId = this.route.snapshot.queryParamMap.get('modelId');
    console.log('Received modelId:', this.modelId);

    this.category = this.route.snapshot.queryParamMap.get('category');
    console.log('Received category:', this.category);

    this.vehicleType = this.route.snapshot.queryParamMap.get('vehicleType');
    console.log('Received vehicleType:', this.vehicleType);

    this.getSessionData(this.modelId, this.category, this.vehicleType);

    this.loadProductsData();
  }


  getSessionData(modelId: string | null, category: string | null, vehicleType: string | null): void {

    if (!modelId || !category || !vehicleType) {
      this.modelId = sessionStorage.getItem('selectedModelId');
      this.category = sessionStorage.getItem('selectedCategory');
      this.vehicleType = sessionStorage.getItem('selectedVehicleType');
      console.warn('Missing query parameters. Attempting to retrieve from session storage.');
      return;
    }
    sessionStorage.setItem('selectedModelId', modelId || '');
    sessionStorage.setItem('selectedCategory', category || '');
    sessionStorage.setItem('selectedVehicleType', vehicleType || '');

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

  setDummyData(): void {
    this.products = [
      {
        id: 1,
        name: "Carburetor Repair Kit",
        type: "Aftermarket" as const,
        rating: 4.2,
        reviews: 74,
        discountedPrice: 449,
        originalPrice: 599,
        discount: 25,
        imageUrl: "assets/two-wheelers/product-services/carburetor-kit.jpg"
      },
      {
        id: 2,
        name: "Brake Pad Set",
        type: "OEM" as const,
        rating: 4.8,
        reviews: 156,
        discountedPrice: 899,
        originalPrice: 1200,
        discount: 25,
        imageUrl: "assets/two-wheelers/product-services/brake-pad.jpg"
      },
      {
        id: 3,
        name: "Engine Oil Filter",
        type: "Aftermarket" as const,
        rating: 4.5,
        reviews: 92,
        discountedPrice: 199,
        originalPrice: 299,
        discount: 33,
        imageUrl: "assets/two-wheelers/product-services/oil-filter.jpg"
      },
      {
        id: 4,
        name: "Spark Plug Set",
        type: "OEM" as const,
        rating: 4.7,
        reviews: 203,
        discountedPrice: 349,
        originalPrice: 499,
        discount: 30,
        imageUrl: "assets/two-wheelers/product-services/spark-plug.jpg"
      }
    ];
  }

  navigateToProductDetails(product: VehicleProductDto): void {
    this.router.navigate(['/vehicle-productDetails'], { queryParams: { product: JSON.stringify(product) } });
  }

  /**
   * Navigate to dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
