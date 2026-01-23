import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SellerCategoryService } from '../../../services/Seller/seller-category.service';

interface Category {
  name: string;
  totalProducts: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-two-wheeler-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './two-wheeler-categories.html',
  styleUrl: './two-wheeler-categories.css'
})
export class SellerTwoWheelerCategories implements OnInit {

  sellerName = '';
  storeName = '';
  avtarName = '';

  categories: Category[] = [];

  newCategory = {
    name: '',
    description: '',
    icon: '',
    color: '',
    image: '',
    totalProducts: 0
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  isFormExpanded = false;

  constructor(private location: Location, private router: Router, private sellerCategoryService: SellerCategoryService) { }

  categories1: Category[] = [
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

  ngOnInit(): void {

    this.sellerName = sessionStorage.getItem('sellerName') || '';
    this.storeName = sessionStorage.getItem('businesstName') || '';
    this.avtarName = this.getAvatarName(this.sellerName);

    this.loadCategories();
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
  viewProducts(category: Category): void {
    console.log('View products for:', category.name);
    // later: route to product list page
    const categoryName = category.name;

    this.router.navigate(['/seller-category-parts'], {
      queryParams: { category: categoryName }
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

    const categoryData = {
      name: this.newCategory.name,
      description: this.newCategory.description,
      icon: this.newCategory.icon,
      color: this.newCategory.color,
      image: this.newCategory.image,
      totalProducts: 0
    };

    console.log('Submitting new category:', JSON.stringify(categoryData));

    this.sellerCategoryService.addCategory(categoryData).subscribe(
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

    if (!this.newCategory.description || !this.newCategory.description.trim()) {
      this.errorMessage = 'Description is required.';
      return false;
    }

    if (!this.newCategory.icon || !this.newCategory.icon.trim()) {
      this.errorMessage = 'Icon is required.';
      return false;
    }

    if (!this.newCategory.color) {
      this.errorMessage = 'Color theme is required.';
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
      description: '',
      icon: '',
      color: '',
      image: '',
      totalProducts: 0
    };
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
