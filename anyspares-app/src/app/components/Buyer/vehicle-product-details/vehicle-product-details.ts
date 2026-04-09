import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../navbar-component/navbar-component";
import { VehicleProductDetailsService, ProductData } from '../../../services/Buyer/vehicle-productdetails.services';

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

  // Default product for fallback
  defaultProduct: ProductData = {
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vehicleProductDetailsService: VehicleProductDetailsService
  ) { }

  ngOnInit(): void {
    // Try to get product from router state first
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['product']) {
      this.product = navigation.extras.state['product'] as ProductData;
      if (this.product?.id) {
        this.loadProductDetails(this.product.id);
        this.loadRelatedProducts(this.product.id);
        this.loadProductReviews(this.product.id);
      }
    } else {
      // Try to get product ID from route parameters
      this.route.paramMap.subscribe(params => {
        const productId = params.get('id');
        if (productId) {
          this.loadProductDetails(parseInt(productId));
          this.loadRelatedProducts(parseInt(productId));
          this.loadProductReviews(parseInt(productId));
        } else {
          // Fallback to default product
          this.product = this.defaultProduct;
        }
      });
    }
  }

  /**
   * Load product details from API
   */
  loadProductDetails(productId: number): void {
    this.isLoading = true;
    this.error = null;

    this.vehicleProductDetailsService.getProductById(productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
        } else {
          console.warn('Failed to fetch product details, using default');
          this.product = this.defaultProduct;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product details:', err);
        this.error = 'Failed to load product details';
        this.product = this.defaultProduct;
        this.isLoading = false;
      }
    });
  }

  /**
   * Load related products
   */
  loadRelatedProducts(productId: number): void {
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
  loadProductReviews(productId: number): void {
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
    if (!this.product || !this.product.id) {
      this.error = 'Product not available';
      
      
      
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.vehicleProductDetailsService.addToBucket(this.product.id, this.quantity).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `${this.quantity} item(s) added to cart successfully!`;
          this.isLoading = false;
          setTimeout(() => this.successMessage = null, 3000);
        } else {
          this.error = response.message || 'Failed to add to cart';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.error = err.error?.message || 'Failed to add to cart';
        this.isLoading = false;
      }
    });
  }

  /**
   * Buy now - proceed to checkout
   */
  buyNow(): void {
    if (!this.product || !this.product.id) {
      this.error = 'Product not available';
      return;
    }

    this.isLoading = true;
    // First add to cart, then navigate to checkout
    this.vehicleProductDetailsService.addToBucket(this.product.id, this.quantity).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        console.error('Error in buy now:', err);
        this.error = 'Failed to proceed to checkout';
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
    this.router.navigate(['/my-bucket']);
  }

  /**
   * Navigate to related product details
   */
  viewRelatedProduct(product: ProductData): void {
    this.router.navigate(['/vehicle-productDetails'], {
      state: { product: product }
    });
  }
}