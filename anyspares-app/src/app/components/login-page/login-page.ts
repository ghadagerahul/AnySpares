import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  loginData = { userName: '', mobileNumber: '', password: '' };
  loginDataNew = { emailId: '', mobileNo: '', password: '' };
  constructor(private appservice: AppService, private router: Router) { }

  LoginUserToPortal() {
    console.log("Username:", this.loginData.userName);
    console.log("mobileNumber:", this.loginData.mobileNumber);

    this.loginDataNew.emailId = this.loginData.userName;
    this.loginDataNew.mobileNo = this.loginData.mobileNumber;
    this.loginDataNew.password = this.loginData.password;
    console.log("Password:", this.loginData.password);
    this.appservice.LoginUserToPortal(this.loginDataNew).subscribe(res => {
      console.log('Login response', res);
      if (res.success) {
        console.log('Login successful');
        // Navigate or store token
      } else {
        console.error('Login failed:', res.message);
        console.error('Login failed:', res.message);
        console.error('Login failed:', res.message);
        console.error('Login failed:', res.message);
        console.error('Login failed:', res.message);
        // Show error to user
      }
    });
  }

  goToRegisterationPage() {
    this.router.navigate(['/register']);
  }
}