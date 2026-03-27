import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuyerService } from '../../../services/app.buyerservice';
import { LoginNavigatorComponent } from '../../shared/login-navigator/login-navigator';

@Component({
  selector: 'app-forgot-password.component',
  imports: [FormsModule, CommonModule, LoginNavigatorComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  emailOrMobile = '';
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private appService: BuyerService) { }

  submitForgotPassword(): void {
    if (!this.emailOrMobile.trim()) {
      this.showMessage('Please enter your email or mobile number.', 'error');
      return;
    }

    this.loading = true;
    const payload = { emailOrMobile: this.emailOrMobile.trim() };

    this.appService.forgotPassword(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.showMessage(res.message || 'Password reset link sent. Please check your email.', 'success');
        } else {
          this.showMessage(res.message || 'Unable to process request. Please try again.', 'error');
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Forgot password API error', err);
        this.showMessage('Failed to send reset instructions. Please try again later.', 'error');
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }
}

