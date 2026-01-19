import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SellerCategoryPartsService } from '../../../services/Seller/seller-category-parts.services';



interface Product {
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'Active' | 'OutOfStock' | 'Draft';
  statusLabel: string;
}

@Component({
  selector: 'app-seller-category-parts',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-category-parts.html',
  styleUrl: './seller-category-parts.css'
})
export class SellerCategoryParts implements OnInit {


  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  totalProducts = 0;
  products: Product[] = [];
  paginatedProducts: Product[] = [];


  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  // Search and Filter properties
  searchQuery: string = '';
  selectedStatus: string = 'All';
  filteredProducts: Product[] = [];
  statusOptions = ['All', 'Active', 'OutOfStock', 'Draft'];

  // products1: Product[] = [
  //   { name: 'Piston Ring Set - Honda Activa', category: 'Engine Parts', stock: 25, price: 899, status: 'Active', statusLabel: 'Active' },
  //   { name: 'Cylinder Head Gasket - Yamaha R15', category: 'Engine Parts', stock: 0, price: 1299, status: 'OutOfStock', statusLabel: 'Out of Stock' },
  //   { name: 'Camshaft Assembly - Bajaj Pulsar', category: 'Engine Parts', stock: 12, price: 2499, status: 'Active', statusLabel: 'Active' },
  //   { name: 'Valve Set - Hero Splendor', category: 'Engine Parts', stock: 8, price: 1599, status: 'Active', statusLabel: 'Active' },
  //   { name: 'Connecting Rod - TVS Apache', category: 'Engine Parts', stock: 0, price: 1899, status: 'Draft', statusLabel: 'Draft' }
  // ];

  constructor(private location: Location, private router: Router, private route: ActivatedRoute, private sellerCategoryPartsService: SellerCategoryPartsService) { }


  @Input() categoryName: string = '';


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.categoryName = params['category'];
      }
    });

    console.log('###Category:', this.categoryName);

    this.sellerCategoryPartsService.getPartsUnderCategories(this.categoryName).subscribe(
      response => {
        console.log('Parts under category fetched successfully:', response);
        // Handle the response data as needed
        this.products = response.data || [];

        this.products.forEach(product => {
          switch (product.status) {
            case 'Active':
              product.statusLabel = 'Active';
              break;
            case 'OutOfStock':
              product.statusLabel = 'Out of Stock';
              break;
            case 'Draft':
              product.statusLabel = 'Draft';
              break;
            default:
              product.statusLabel = '';
          }
        });

        this.filteredProducts = this.products;
        this.totalProducts = this.products.length || 0;
        this.calculatePagination();
        this.loadPage(this.currentPage);
      },
      error => {
        console.error('Error fetching parts under category:', error);
      }
    );
  }

  /**
   * Filters and searches products based on search query and selected status
   */
  applySearchAndFilter(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = this.searchQuery === '' ||
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All' || product.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });

    this.totalProducts = this.filteredProducts.length;
    this.currentPage = 1;
    this.calculatePagination();
    this.loadPage(1);
  }

  /**
   * Resets search and filter
   */
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.applySearchAndFilter();
  }

  /**
   * Handles search input change
   */
  onSearchChange(): void {
    this.applySearchAndFilter();
  }

  /**
   * Handles status filter change
   */
  onStatusChange(): void {
    this.applySearchAndFilter();
  }

  addProduct(): void {
    console.log('Add Product clicked');
    this.router.navigate(['/seller-addproduct']);
  }

  goToEditProduct() {
    this.router.navigate(['/seller-editproduct']);

  }
  goBack() { this.location.back(); }

  /**
   * Calculates total pages based on product count
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
  }

  /**
   * Loads products for a specific page
   */
  loadPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }

    this.currentPage = pageNumber;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  /**
   * Goes to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  /**
   * Goes to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

}

