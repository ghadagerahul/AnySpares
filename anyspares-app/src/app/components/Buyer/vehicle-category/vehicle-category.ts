
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategoryService } from '../../../services/Buyer/vehicle-category.service';


@Component({
  selector: 'app-vehicle-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-category.html',
  styleUrl: './vehicle-category.css',
})
export class VehicleCategory implements OnInit {

  constructor(private location: Location, private router: Router, private route: ActivatedRoute, private vehicleCategoryService: VehicleCategoryService) { }

  searchTerm: string = '';
  categories: any[] = [];
  modelId: String | null = '';
  categories1 = [
    {
      name: 'Engine Parts',
      description: 'Pistons, rings, gaskets, valves',
      image: 'assets/two-wheelers/category/engine.jpg'
    },
    {
      name: 'Brakes',
      description: 'Brake pads, discs, shoes, cables',
      image: 'assets/two-wheelers/category/brakes.jpg'
    },
    {
      name: 'Electrical',
      description: 'Batteries, wiring, lights, switches',
      image: 'assets/two-wheelers/category/electrical.jpg'
    },
    {
      name: 'Suspension',
      description: 'Shockers, forks, springs',
      image: 'assets/two-wheelers/category/suspension.jpg'
    },
    {
      name: 'Hydraulic',
      description: 'Oil filters, brake fluid, coolant',
      image: 'assets/two-wheelers/category/hydraulic.jpg'
    },
    {
      name: 'Body Parts',
      description: 'Panels, fenders, mirrors, seats',
      image: 'assets/two-wheelers/category/body.jpg'
    }
  ];

  ngOnInit(): void {

    this.modelId = this.route.snapshot.queryParamMap.get('modelId');
    console.log('Received modelId:', this.modelId);
    
    const vehicleType = this.route.snapshot.queryParamMap.get('vehicleType');
    console.log('Received vehicleType:', vehicleType);

    this.vehicleCategoryService.loadVehicleCategories(vehicleType).subscribe(
      (res: any) => {
        this.categories = res.data;
        console.log('Fetched categories:', this.categories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );



  }

  filteredCategories() {
    return this.categories.filter(cat =>
      cat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onCategorySelect(category: any) {
    console.log('Selected category:', category.name);
    console.log('Model ID for product listing:', this.modelId);
    this.router.navigate(['/vehicle-product'], { queryParams: { modelId: this.modelId, category: category.name, vehicleType: this.route.snapshot.queryParamMap.get('vehicleType') } });
  }

  goBack() {
    this.location.back();
  }

  goToProduct() {
    console.log('Navigating to products');
    this.router.navigate(['/vehicle-product']);
  }
}

