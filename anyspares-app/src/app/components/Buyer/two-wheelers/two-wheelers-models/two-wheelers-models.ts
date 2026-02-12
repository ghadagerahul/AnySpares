import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-two-wheelers-models',
  imports: [CommonModule, FormsModule],
  templateUrl: './two-wheelers-models.html',
  styleUrl: './two-wheelers-models.css'
})
export class TwoWheelersModels {
  selectedYear: string = '';

  constructor(private router: Router){}

  allYears: string[] = ['2019', '2020', '2021', '2022', '2023', '2024'];

  models = [
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

  filteredModels() {
    if (!this.selectedYear) return this.models;
    return this.models.filter(model => {
      const [start, end] = model.years.split('–').map(Number);
      const year = Number(this.selectedYear);
      return year >= start && year <= end;
    });
  }

  onModelSelect(model: any) {
    console.log('Selected model:', model.name);
    // Navigate or load spare parts logic here



    this.router.navigate(['/twowheelers-category']);
  }
}
