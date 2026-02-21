import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleModelService } from '../../../services/Buyer/vehicle-model.services';

@Component({
  selector: 'app-vehicle-models',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-models.html',
  styleUrl: './vehicle-models.css',
})
export class VehicleModels implements OnInit {
  selectedYear: string = '';

  constructor(private router: Router, private vehicleModelService: VehicleModelService, private route: ActivatedRoute) { }
 

  allYears: string[] = ['2019', '2020', '2021', '2022', '2023', '2024'];
  models: any[] = [];

  models1 = [
    {
      name: 'Activa',
      years: '2019–2024',
      image: 'assets/two-wheelers/models/activa.jpg'
    },
    {
      name: 'CB Shine',
      years: '2020–2024',
      image: 'assets/two-wheelers/models/cb-shine.jpg'
    },
    {
      name: 'Unicorn',
      years: '2021–2024',
      image: 'assets/two-wheelers/models/unicorn.jpg'
    },
    {
      name: 'Hornet 2.0',
      years: '2020–2024',
      image: 'assets/two-wheelers/models/hornet.jpg'
    },
    {
      name: 'Dio',
      years: '2019–2024',
      image: 'assets/two-wheelers/models/dio.jpg'
    }
  ];

  ngOnInit(): void {

const brandId = this.route.snapshot.queryParamMap.get('brandId');
console.log('Received brandId:', brandId);
console.log('Received category:', this.route.snapshot.queryParamMap.get('category'));
   // this.models = this.models1;
if (brandId) {
  this.vehicleModelService.loadVehicleModels(brandId).subscribe(
        (res: any) => {
          console.log('Vehicle models:', res); 
          if (res.success) {
            this.models = res.data;
          }
    });
}
}

  filteredModels() {
    if (!this.selectedYear) return this.models;
    return this.models.filter(model => {
      const [start, end] = model.years.split('–').map(Number);
      const year = Number(this.selectedYear);
      return year >= start && year <= end;
    });
  }

  onModelSelect(modelId: any) {
    console.log('Selected model:', modelId);
    this.router.navigate(['/vehicle-category'], { queryParams: { modelId: modelId, category: this.route.snapshot.queryParamMap.get('category') } });
  }
}
