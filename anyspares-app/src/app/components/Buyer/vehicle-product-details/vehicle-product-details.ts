import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from "../navbar-component/navbar-component";
import { VehicleProductDetailsService, ProductData } from '../../../services/Buyer/vehicle-productdetails.services';
import { UserDetails } from '../../shared/user-details.model';


@Component({
  selector: 'app-vehicle-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './vehicle-product-details.html',
  styleUrls: ['./vehicle-product-details.css'],
})
export class VehicleProductDetails implements OnInit {
  quantity = 1;
  activeTab: "specs" | "features" | "compatibility" = "specs";
  Math = Math;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  product: ProductData | null = null;
  relatedProducts: ProductData[] = [];
  productReviews: any[] = [];
  vehicleProductDto!: VehicleProductDto;

  defaultProduct1: ProductData = {
    name: "Carburetor Repair Kit",
    type: "Aftermarket",
    rating: 4.2,
    reviews: 74,
    discountedPrice: 449,
    originalPrice: 599,
    discount: 25,
    inStock: true,
    imageUrl: "assets/two-wheelers/product-services/carburetor-kit.jpg",
    description: "High-quality carburetor repair kit suitable for two-wheelers",
    specs: {
      partNumber: "SP-8-2024",
      brandCompatibility: ["Hero", "Honda", "Bajaj"],
      material: "High-Grade Steel",
      warranty: "6 Months",
      weight: "0.5 kg",
      dimensions: "15 x 10 x 5 cm",
    }
  };
  currentUser!: UserDetails;

  constructor(private router: Router, private route: ActivatedRoute,
    private vehicleProductDetailsService: VehicleProductDetailsService) { }


  ngOnInit(): void {
    const productParam1 = this.route.snapshot.queryParamMap.get('product');
    console.log('##Received product from route:', productParam1);
    this.vehicleProductDto = productParam1
      ? JSON.parse(productParam1) as VehicleProductDto
      : {} as VehicleProductDto;


    console.log('Current User from sessionStorage:' + JSON.stringify(localStorage.getItem('currentUser')));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as UserDetails;
    console.log('!!!!!!!!!!Parsed currentUser:', this.currentUser);
    console.log('!!!!!!!!!!Current User ID:', this.currentUser?.id);
    this.loadAllProductData(this.vehicleProductDto.id || 0, this.currentUser.id);
  }



  /**
   * Load all product-related data (details, related products, reviews)
   */
  private loadAllProductData(productId: number, userId: number): void {
    console.log('#@#@##@Loading data for product ID:', productId);
    console.log('@#@#@#Current User ID:', userId);
    this.loadProductDetails(productId, userId);
   // this.loadRelatedProducts(productId, userId);
    //this.loadProductReviews(productId, userId);
  }

  /**
   * Load product details from API
   */
  loadProductDetails(productId: number, userId: number): void {
    this.isLoading = true;
    this.error = null;

    this.vehicleProductDetailsService.getProductById(productId, userId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
        } else {
          console.warn('Failed to fetch product details, using default');
         // this.product = this.defaultProduct;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product details:', err);
        this.error = 'Failed to load product details';
        //this.product = this.defaultProduct;
        this.isLoading = false;
      }
    });
  }

  /**
   * Load related products
   */
  loadRelatedProducts(productId: number, userId: number): void {
    this.vehicleProductDetailsService.getRelatedProducts(productId, 5).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.relatedProducts = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading related products:', err);
      }
    });
  }

  /**
   * Load product reviews
   */
  loadProductReviews(productId: number, userId: number): void {
    this.vehicleProductDetailsService.getProductReviews(productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.productReviews = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }

  get total(): number {
    return this.product ? this.quantity * this.product.discountedPrice : 0;
  }

  /**
   * Add product to cart
   */
  addToCart(): void {
    this.addToBucket(() => {
      this.successMessage = `${this.quantity} item(s) added to cart successfully!`;
      setTimeout(() => this.successMessage = null, 3000);
    });
  }

  /**
   * Buy now - proceed to checkout
   */
  buyNow(): void {
    this.addToBucket(() => {
      this.router.navigate(['/view-cart']);
    });
  }

  /**
   * Private method to add product to bucket with common logic
   */
  private addToBucket(onSuccess?: () => void): void {
    if (!this.product?.id) {
      this.error = 'Product not available';
      return;
    }

    if (this.quantity <= 0) {
      this.error = 'Quantity must be at least 1';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.vehicleProductDetailsService.addToBucket(this.product.id, this.quantity, this.currentUser.id).subscribe({
      next: (response) => {
        if (response.success) {
          onSuccess?.();
        } else {
          this.error = response.message || 'Failed to add to cart';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.error = err.error?.message || 'Failed to add to cart';
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigate to orders page
   */
  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  /**
   * Navigate to cart/bucket page
   */
  goToBucket(): void {
    this.router.navigate(['/view-cart']);
  }

  /**
   * Navigate to related product details
   */
  viewRelatedProduct(product: ProductData): void {
    this.router.navigate(['/vehicle-productDetails'], {
      state: { product: product }
    });
  }

  /**
   * Navigate to dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Navigate to products page
   */
  goToProducts(): void {
    this.router.navigate(['/vehicle-products']);
  }
}