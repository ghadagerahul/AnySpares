import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { RegistrationRequest } from '../../shared/registration-request.model';
import { Constants } from '../../../Constants/Constants';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registeration-page',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './registeration-page.html',
  styleUrls: ['./registeration-page.css']
})
export class RegisterationPage implements OnInit {
  registrationForm!: FormGroup;

  registrationFormNew!: RegistrationRequest;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: [''],
        email: ['', [Validators.required, Validators.email]],
        mobileNo: ['', [Validators.required, Validators.minLength(10)]],
        userName: ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confPassword: ['', [Validators.required, Validators.minLength(5)]]
      },
      { validators: this.passwordMatchValidator }
    );

    // Live validation trigger
    this.registrationForm.get('confPassword')?.valueChanges.subscribe(() => {
      this.registrationForm.updateValueAndValidity({ onlySelf: true });
    });
  }

  // Custom validator to check password match
  passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  };

  // Getter for template access
  get f() {
    return this.registrationForm.controls;
  }

  onSubmitData() {
    if (this.registrationForm.valid) {

      this.registrationFormNew = {
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        email: this.registrationForm.value.email,
        mobileNo: this.registrationForm.value.mobileNo,
        userName: this.registrationForm.value.userName,
        password: this.registrationForm.value.password,
        confPassword: this.registrationForm.value.confPassword,

        businessName: Constants.Empty_STRING,
        ownerName: Constants.Empty_STRING,
        gstNumber: Constants.Empty_STRING,
        completeAddress: Constants.Empty_STRING,
        city: Constants.Empty_STRING,
        pincode: Constants.ZERO_NUMBER,
        vehicleType: [],
        userType: Constants.USER_BUYER
      };

      console.log("registrationForm-firstName: " + this.registrationForm.value.firstName);
      this.authService.registerUser(this.registrationFormNew).subscribe({
        next: (data: any) => {
          console.log('Success:', data);
          if (data.success) {
            this.openSuccessModal();
          }
          this.registrationForm.reset();
        },
        error: (err: any) => {
          console.error('Error:', err);
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }


  openSuccessModal() {
    const modalEl = document.getElementById('regSuccessModal');
    const modal = Modal.getOrCreateInstance(modalEl!);
    modal.show();
  }

  goToLoginPage() {
    const modalEl = document.getElementById('regSuccessModal');
    const modal = Modal.getOrCreateInstance(modalEl!);
    modal?.hide();
    this.router.navigate(['/login']);
  }
}
