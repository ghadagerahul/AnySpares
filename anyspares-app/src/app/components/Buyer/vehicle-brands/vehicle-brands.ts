import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleModelService } from '../../../services/Buyer/vehicle-model.services';
import { VehicleBrandsService } from '../../../services/Buyer/vehicle-brands.services';

@Component({
  selector: 'app-vehicle-brands',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-brands.html',
  styleUrl: './vehicle-brands.css',
})
export class VehicleBrands implements OnInit {

  searchTerm: string = '';
  brands: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private vehicleModelService: VehicleModelService, private vehicleBrandsService: VehicleBrandsService) { }


  brands1 = [
    { name: 'Yamaha', image: 'assets/two-wheelers/yamaha.jpg' },
    { name: 'Royal Enfield', image: 'assets/two-wheelers/royalenfield.jpg' },
    { name: 'Suzuki', image: 'assets/two-wheelers/suzuki.jpg' },
    { name: 'KTM', image: 'assets/two-wheelers/ktm.jpg' }
  ];



  ngOnInit(): void {
    const category = this.route.snapshot.queryParamMap.get('category');
    console.log('Received category on init:', category);

    if (category) {
      this.vehicleBrandsService.loadVehicleBrands(category).subscribe(
        (res: any) => {
          console.log('Vehicle brands:', res);
          if (res.success) {
            this.brands = res.data;
            console.log('Loaded brands:', this.brands);
          }
        },
        (error) => {
          console.error('Error loading vehicle brands:', error);
        }
      );
    }
  }

  filteredBrands() {
    return this.brands.filter(brand =>
      brand.brndname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onBrandSelect(brandId: any) {
    console.log('Selected brand:', brandId);
    this.router.navigate(['/vehicle-models'], { queryParams: { brandId: brandId, category: this.route.snapshot.queryParamMap.get('category') } });
  }

}
