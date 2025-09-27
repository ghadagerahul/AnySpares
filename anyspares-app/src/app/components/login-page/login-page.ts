import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';

interface LoginData {
  userName: string;
  mobileNumber: string;
  password: string;
}

interface LoginRequest {
  emailId: string;
  mobileNo: string;
  password: string;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  loginData: LoginData = { userName: '', mobileNumber: '', password: '' };
  loginDataNew: LoginRequest = { emailId: '', mobileNo: '', password: '' };

  constructor(private appservice: AppService, private router: Router) {}

  LoginUserToPortal(form: NgForm) {
    if (form.invalid) {
      console.warn("Form is invalid");
      return;
    }

    this.loginDataNew = {
      emailId: this.loginData.userName,
      mobileNo: this.loginData.mobileNumber,
      password: this.loginData.password
    };

    console.log("Login Request:", this.loginDataNew);

    this.appservice.LoginUserToPortal(this.loginDataNew).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log('✅ Login successful');
          // Navigate or store token
          this.router.navigate(['/dashboard']);
        } else {
          console.error('❌ Login failed:', res.message);
          alert(res.message || 'Login failed, please try again.');
        }
      },
      error: (err) => {
        console.error('🚨 API Error:', err);
        alert('Something went wrong. Please try again later.');
      }
    });
  }

  

  goToRegisterationPage() {
    this.router.navigate(['/register']);
  }
}
