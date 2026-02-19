import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar-component/navbar-component";
import { TwowheelerService } from '../../../services/app.twowheelerservice';
import { CommonModule } from '@angular/common';

interface VehicleCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  route: string;
  gradientClass: string;
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
    private twowheelerService: TwowheelerService
  ) { }

  ngOnInit() {
    this.loadVehicleCategories();
  }

  private loadVehicleCategories() {
    this.twowheelerService.getVehicleCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.vehicleCategories = response.data;
        } else {
          console.error('Failed to load vehicle categories:', response.message);
          this.vehicleCategories = [];
        }
      },
      error: (error) => {
        console.error('Error loading vehicle categories:', error);
        this.vehicleCategories = [];
      }
    });
  }

  onSamePage() {
    this.router.navigate(['/dashboard']);
  }

  navigateToCategory(name: string) {

    console.log('Navigating to category:', name);
    if (name === 'Two-Wheeler') {
      this.router.navigate(['/vehicles'], { queryParams: { category: 'Two Wheeler' } });
    }
    else {
      console.warn('Route not implemented for this category');
    }
  }

}
