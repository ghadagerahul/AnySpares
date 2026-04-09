import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-navigator',
  imports: [RouterLink],
  templateUrl: './login-navigator.html',
  styleUrl: './login-navigator.css'
})
export class LoginNavigatorComponent {
  @Input() userLoginLabel: string = 'Back to User Login';
  @Input() userLoginRoute: string = '/login';
  @Input() sellerLoginLabel: string = 'Back to Seller Login';
  @Input() sellerLoginRoute: string = '/seller-login';
}
