import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-two-wheelers-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './two-wheelers-category.html',
  styleUrl: './two-wheelers-category.css'
})
export class TwoWheelersCategory {
  constructor(private location: Location) { }

  searchTerm: string = '';

  categories = [
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

  filteredCategories() {
    return this.categories.filter(cat =>
      cat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onCategorySelect(category: any) {
    console.log('Selected category:', category.name);
    // Navigate or load spare parts logic here
  }

  goBack() {
    this.location.back();
  }
}
