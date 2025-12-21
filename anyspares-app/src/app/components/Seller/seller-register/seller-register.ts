import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-register',
  imports: [RouterLink, CommonModule],
  templateUrl: './seller-register.html',
  styleUrl: './seller-register.css'
})
export class SellerRegisterComponent {

  showSuccessModal: any;


  constructor(private router: Router) { }


  registerAsSeller() {

    this.showSuccessModal = true;

  }


  goToSellerLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/seller-login']);
  }

}
