import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SellerCategoryService } from '../../../services/Seller/seller-category.service';

interface Category {
  image: any;
  name: string;
  totalProducts: number;
  icon: string;
  color: string;
}
@Component({
  selector: 'app-seller-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-category.html',
  styleUrl: './seller-category.css',
})
export class SellerCategory implements OnInit {

  sellerName = '';
  storeName = '';
  avtarName = '';

  categories: Category[] = [];

  newCategory = {
    name: '',
    forvehicletype: '',
    description: '',
    totalProducts: 0,
    image: null
  };

  selectedFile: File | null = null;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  isFormExpanded = false;
  vehicleType: string | null = "";

  constructor(private location: Location, private router: Router, private sellerCategoryService: SellerCategoryService, private route: ActivatedRoute) { }

  // categories1: Category[] = [
  //   { name: 'Engine Parts', totalProducts: 42, icon: '⚙️', color: 'green' },
  //   { name: 'Brakes', totalProducts: 28, icon: '🛑', color: 'red' },
  //   { name: 'Electrical', totalProducts: 35, icon: '⚡', color: 'orange' },
  //   { name: 'Suspension', totalProducts: 18, icon: '🌬️', color: 'purple' },
  //   { name: 'Body Parts', totalProducts: 15, icon: '🚗', color: 'blue' },
  //   { name: 'Hydraulic / Fluids', totalProducts: 7, icon: '💧', color: 'cyan' }
  // ];

  summary = {
    total: 0,
    active: 0,
    outOfStock: 0
  };

  ngOnInit(): void {

    this.vehicleType = this.route.snapshot.queryParamMap.get('vehicleType');
    console.log('Received vehicleType:', this.vehicleType);
    this.sellerName = sessionStorage.getItem('sellerName') || '';
    this.storeName = sessionStorage.getItem('businesstName') || '';
    this.avtarName = this.getAvatarName(this.sellerName);

    this.loadCategories();
    this.loadSummary();
  }

  getAvatarName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return parts.length === 1 ? parts[0][0].toUpperCase() : '';
  }
  /**
   * Loads categories from the service
   */
  loadCategories(): void {
    this.sellerCategoryService.getCategories().subscribe((response) => {
      console.log('Fetched categories response:', response.data);

      // Handle different response formats
      if (Array.isArray(response)) {
        this.categories = response;
      } else if (response && Array.isArray(response.data)) {
        this.categories = response.data;
      } else if (response && Array.isArray(response.categories)) {
        this.categories = response.categories;
      } else {
        console.warn('Unexpected response format. Expected array or object with data/categories property.');
        this.categories = [];
      }

      console.log('Categories assigned:', this.categories);
    }, (error) => {
      console.error('Error fetching categories:', error);
      this.categories = [];
    });
  }

  loadSummary(): void {
    this.sellerCategoryService.getProductSummary().subscribe((response) => {
      if (response.success) {
        console.log('Fetched summary response:', response);
        this.summary = response.data;
      }
    });
  }

  viewProducts(category: Category): void {
    console.log('View products for:', category.name);
    // later: route to product list page
    const categoryName = category.name;

    this.router.navigate(['/seller-category-parts'], {
      queryParams: { category: categoryName, vehicleType: this.vehicleType }
    });

    //   //ex
    //   if (categoryName != null && categoryName != undefined && categoryName == 'Engine Parts') {
    //     this.router.navigate(['/seller-engine-parts'], { 
    //   queryParams: { category: categoryName } 
    // });
    //   } else if (categoryName != null && categoryName != undefined && categoryName == 'Brakes') {
    //     this.router.navigate(['/seller-brakes-parts'], { 
    //   queryParams: { category: categoryName } 
    // });
    //   } else if (categoryName != null && categoryName != undefined && categoryName == 'Electrical') {
    //     this.router.navigate(['/seller-electrical-parts'], { 
    //   queryParams: { category: categoryName } 
    // });
    //   } else if (categoryName != null && categoryName != undefined && categoryName == 'Suspension') {
    //     this.router.navigate(['/seller-suspension-parts'], { 
    //   queryParams: { category: categoryName } 
    // });
    //   } else if (categoryName != null && categoryName != undefined && categoryName == 'Body Parts') {
    //     this.router.navigate(['/seller-bodyshow-parts'], { 
    //   queryParams: { category: categoryName } 
    // });
    //   } else if (categoryName != null && categoryName != undefined && categoryName == 'Hydraulic / Fluids') {
    //     this.router.navigate(['/seller-hydrolic-parts'], { 
    //   queryParams: { category: categoryName } 
    // });
    //   }

  }

  goBack() { this.location.back(); }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  getRandomColor(): string {
    const colors = ['green', 'red', 'orange', 'purple', 'blue', 'cyan'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Adds a new category by calling the service
   */
  onAddCategory(): void {
    console.log("onAddCategory() called...!!!");
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('name', this.newCategory.name);
    formData.append('forvehicletype', this.newCategory.forvehicletype);
    formData.append('description', this.newCategory.description);
    formData.append('color', this.getRandomColor());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    formData.append('totalProducts', this.newCategory.totalProducts.toString());

    console.log('Submitting new category:', formData);

    this.sellerCategoryService.addCategory(formData).subscribe(
      (response) => {
        console.log('Category added successfully:', response);
        this.isSubmitting = false;
        this.successMessage = `Category "${this.newCategory.name}" added successfully!`;
        this.resetForm();
        this.isFormExpanded = false;
        // Refresh the categories list
        this.loadCategories();
      },
      (error) => {
        console.error('Error adding category:', error);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to add category. Please try again.';
      }
    );
  }

  /**
   * Validates the form before submission
   */
  validateForm(): boolean {
    if (!this.newCategory.name || !this.newCategory.name.trim()) {
      this.errorMessage = 'Category name is required.';
      return false;
    }

    if (!this.newCategory.forvehicletype || !this.newCategory.forvehicletype.trim()) {
      this.errorMessage = 'Vehicle type is required.';
      return false;
    }

    if (!this.newCategory.description || !this.newCategory.description.trim()) {
      this.errorMessage = 'Description is required.';
      return false;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Image is required.';
      return false;
    }

    return true;
  }

  /**
   * Resets the form to empty state
   */
  resetForm(): void {
    this.newCategory = {
      name: '',
      forvehicletype: '',
      description: '',
      totalProducts: 0,
      image: null
    };
    this.selectedFile = null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  /**
   * Toggles the form expansion state
   */
  toggleFormExpanded(): void {
    this.isFormExpanded = !this.isFormExpanded;
  }

}
