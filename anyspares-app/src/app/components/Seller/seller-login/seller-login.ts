import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-login',
  imports: [RouterLink],
  templateUrl: './seller-login.html',
  styleUrl: './seller-login.css'
})
export class SellerLoginComponent {





  constructor(private router: Router) { }

  // Later you can add:
  // login() {}
  // forgotPassword() {}

  loginAsSeller() {
    this.router.navigate(['/seller-dashboard']);
  }

}
