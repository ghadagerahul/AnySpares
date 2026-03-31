import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  otp = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  otpLoading = false;
  resetLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  otpSent = false;
  otpVerified = false;
  passwordResetSuccess = false;
  resendTimer = 30;
  resendEnabled = false;
  private timerInterval: any;
  private passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  constructor(private appService: BuyerService, private router: Router) { }

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
          this.otpSent = true;
          this.startResendTimer();
          this.showMessage(res.message || 'OTP sent to your email/mobile. Please enter it below to verify.', 'success');
        } else {
          this.otpSent = false;
          this.showMessage(res.message || 'Unable to process request. Please try again.', 'error');
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.otpSent = false;
        console.error('Forgot password API error', err);
        this.showMessage('Failed to send reset instructions. Please try again later.', 'error');
      }
    });
  }

  submitOtp(): void {
    if (!this.otp.trim()) {
      this.showMessage('Please enter the OTP received via email/mobile.', 'error');
      return;
    }

    if (!/^[0-9]{4,6}$/.test(this.otp.trim())) {
      this.showMessage('Please provide a valid 4-6 digit OTP.', 'error');
      return;
    }

    this.otpLoading = true;
    const payload = {
      emailOrMobile: this.emailOrMobile.trim(),
      otp: this.otp.trim()
    };

    this.appService.verifyOtp(payload).subscribe({
      next: (res: any) => {
        this.otpLoading = false;
        if (res.success) {
          this.otpVerified = true;
          this.clearResendTimer();
          this.showMessage(res.message || 'OTP verified successfully. Please set your new password below.', 'success');
        } else {
          this.showMessage(res.message || 'OTP verification failed. Please try again.', 'error');
        }
      },
      error: (err: any) => {
        this.otpLoading = false;
        console.error('OTP verify API error', err);
        this.showMessage('OTP verification failed. Please try again later.', 'error');
      }
    });
  }

  resendOtp(): void {
    this.resendEnabled = false;
    this.resendTimer = 30;
    this.submitForgotPassword();
  }

  submitResetPassword(): void {
    if (!this.newPassword.trim()) {
      this.showMessage('Please enter a new password.', 'error');
      return;
    }

    if (!this.passwordRegex.test(this.newPassword)) {
      this.showMessage('Password must be at least 6 characters with uppercase, lowercase, number, and special character (@$!%*?&).', 'error');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showMessage('Passwords do not match. Please try again.', 'error');
      return;
    }

    this.resetLoading = true;
    const payload = {
      emailOrMobile: this.emailOrMobile.trim(),
      otp: this.otp.trim(),
      newPassword: this.newPassword.trim()
    };

    this.appService.resetPassword(payload).subscribe({
      next: (res: any) => {
        this.resetLoading = false;
        if (res.success) {
          this.passwordResetSuccess = true;
          this.showMessage(res.message || 'Password reset successfully. You can now login with your new password.', 'success');
        } else {
          this.showMessage(res.message || 'Password reset failed. Please try again.', 'error');
        }
      },
      error: (err: any) => {
        this.resetLoading = false;
        console.error('Password reset API error', err);
        this.showMessage('Password reset failed. Please try again later.', 'error');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private startResendTimer(): void {
    this.resendTimer = 30;
    this.resendEnabled = false;
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.resendEnabled = true;
        this.clearResendTimer();
      }
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }
}

