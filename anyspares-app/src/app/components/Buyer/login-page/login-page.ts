import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppService } from '../../../services/app.service';


interface LoginRequest {
  emailId: string;
  mobileNo: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  mobile: string = '';
  password: string = '';

  loginDataNew: LoginRequest = { emailId: '', mobileNo: '', password: '' };


  constructor(private appservice: AppService, private router: Router) { }

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Login attempt:', this.mobile, this.password);

      this.loginDataNew = {
        emailId: '',
        mobileNo: this.mobile,
        password: this.password
      };



      console.log("Login Request:", this.loginDataNew);

      this.appservice.LoginUserToPortal(this.loginDataNew).subscribe({
        next: (res: any) => {
          if (res.success) {
            console.log('✅ Login successful');
            this.redirectToDashboard()
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

    this.resetFormDate();
  }

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  resetFormDate() {
    this.mobile = '',
      this.password = ''
  }
}
