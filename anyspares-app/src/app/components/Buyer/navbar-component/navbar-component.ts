import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  imports: [],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {


  constructor(private router: Router) { }

  onSamePage() {
    this.router.navigate(['/dashboard']);
  }
}
