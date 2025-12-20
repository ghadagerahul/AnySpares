import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NavbarComponent } from "../navbar-component/navbar-component";

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {


  constructor(private router: Router) { }

  onSamePage() {
    this.router.navigate(['/dashboard']);
  }


  goToTwoWheelers() {
    console.log("two wheeler is printing..!!!!")
    this.router.navigate(['/twowheelersdashboard']);
  }

  goToHeavyVehicles() {
    throw new Error('Method not implemented.');
  }
  goToFourWheelers() {
    throw new Error('Method not implemented.');
  }
  goToThreeWheelers() {
    throw new Error('Method not implemented.');
  }

}
