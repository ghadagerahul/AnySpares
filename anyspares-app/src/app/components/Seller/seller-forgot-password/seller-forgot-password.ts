import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../../services/app.sellerservice';
import { LoginNavigatorComponent } from '../../shared/login-navigator/login-navigator';

@Component({
  selector: 'app-seller-forgot-password',
  imports: [FormsModule, CommonModule, LoginNavigatorComponent],
  templateUrl: './seller-forgot-password.html',
  styleUrl: './seller-forgot-password.css'
})
export class SellerForgotPasswordComponent {
  emailOrMobile = '';
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private sellerService: SellerService) {}

  submitForgotPassword(): void {
    if (!this.emailOrMobile.trim()) {
      this.showMessage('Please enter your email or mobile number.', 'error');
      return;
    }

    this.loading = true;
    const payload = { emailOrMobile: this.emailOrMobile.trim() };

    this.sellerService.forgotPassword(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          this.showMessage(res.message || 'Reset instructions sent to seller contact.', 'success');
        } else {
          this.showMessage(res.message || 'Failed to process request.', 'error');
        }
      },
      error: err => {
        this.loading = false;
        console.error('Seller forgot password error', err);
        this.showMessage('Something went wrong. Please try again later.', 'error');
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }
}
