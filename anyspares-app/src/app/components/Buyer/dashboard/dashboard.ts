import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar-component/navbar-component";
import { CommonModule } from '@angular/common';
import { VehicleDashboardService } from '../../../services/Buyer/vehicle-dashboard.services';
import { Constants } from '../../../Constants/Constants';


interface VehicleCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  route: string;
  gradientClass: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {

  vehicleCategories: VehicleCategory[] = [];

  constructor(
    private router: Router,
    private vehicleDashboardService: VehicleDashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadVehicleCategories();
  }

  private loadVehicleCategories(): void {
    this.vehicleDashboardService.loadVehicleTypesData().subscribe({
      next: (response: ApiResponse<VehicleCategory[]>) => {
        this.vehicleCategories = response?.success ? response.data ?? [] : [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading vehicle categories:', err);
        this.vehicleCategories = [];
        this.cdr.markForCheck();
      }
    });
  }

  onSamePage(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToCategory(category: VehicleCategory): void {

    console.log('Navigating to category:', category);

    if (!category?.route) {
      console.log('Route not available for category:', category);
      return;
    }

    if (category.name === 'Two-Wheelers') {
      this.router.navigate(['/vehicles'], {
        queryParams: { category: Constants.TWO_WHEELER }
      });
    }
  }
}