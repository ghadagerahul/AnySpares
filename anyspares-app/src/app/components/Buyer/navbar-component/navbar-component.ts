import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar-component',
  imports: [FormsModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {
  searchTerm: string = '';

  constructor(private router: Router) { }

  onSamePage() {
    this.router.navigate(['/dashboard']);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const target = event.target as HTMLElement;
      if (target) {
        target.click();
      }
    }
  }

  onSearch(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (this.searchTerm.trim()) {
      console.log('Searching for:', this.searchTerm);
      // TODO: Implement actual search functionality or navigate to search results
      // this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
    }
  }
}
