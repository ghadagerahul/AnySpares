import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-twowheelers-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './twowheelers-dashboard.html',
  styleUrls: ['./twowheelers-dashboard.css']
})
export class TwowheelersDashboard {
  searchTerm: string = '';

  constructor(private router: Router) { }

  brands = [
    { name: 'Yamaha', image: 'assets/two-wheelers/yamaha.jpg' },
    { name: 'Royal Enfield', image: 'assets/two-wheelers/royalenfield.jpg' },
    { name: 'Suzuki', image: 'assets/two-wheelers/suzuki.jpg' },
    { name: 'KTM', image: 'assets/two-wheelers/ktm.jpg' }
  ];

  filteredBrands() {
    return this.brands.filter(brand =>
      brand.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onBrandSelect(brand: any) {
    console.log('Selected brand:', brand.name);
    // You can navigate or load models here


    this.router.navigate(['/twowheelers-models']);

  }
}
