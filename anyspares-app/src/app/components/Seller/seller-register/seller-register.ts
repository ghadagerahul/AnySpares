import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SellerService } from '../../../services/app.sellerservice';

@Component({
  selector: 'app-seller-register',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './seller-register.html',
  styleUrl: './seller-register.css'
})
export class SellerRegisterComponent implements OnInit {

  registrationForm!: FormGroup;
  showSuccessModal: any;
  successMsg: String | undefined;
  vehicleTypeOptions = [
    { id: 'twoWheeler', label: 'Two Wheeler' },
    { id: 'threeWheeler', label: 'Three Wheeler' },
    { id: 'fourWheeler', label: 'Four Wheeler' },
    { id: 'heavyVehicle', label: 'Heavy Vehicle' }
  ];

  constructor(private router: Router, private fb: FormBuilder, private sellerService: SellerService) { }

  // Password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confPassword = control.get('confPassword');

    if (!password || !confPassword) {
      return null;
    }

    return password.value === confPassword.value ? null : { passwordMismatch: true };
  }

  // Validator to ensure at least one vehicle type is selected
  atLeastOneVehicleTypeValidator(control: AbstractControl): ValidationErrors | null {
    const vehicleTypesArray = control as FormArray;
    const isAnySelected = vehicleTypesArray.value.some((v: boolean) => v);
    return isAnySelected ? null : { vehicleTypeRequired: true };
  }

  ngOnInit(): void {
    // Create checkboxes for vehicle types
    const vehicleTypeControls = this.vehicleTypeOptions.map(() => this.fb.control(false));
    const vehicleTypesFormArray = this.fb.array(vehicleTypeControls, this.atLeastOneVehicleTypeValidator.bind(this));

    this.registrationForm = this.fb.group(
      {
        businesstName: ['', [Validators.required, Validators.minLength(3)]],
        ownerName: ['', [Validators.required, Validators.minLength(3)]],
        mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],

        emailAddress: ['', [Validators.required, Validators.email]],
        gstNumber: [''],

        completeAddress: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(3)]],
        pincode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]],

        vehicleTypes: vehicleTypesFormArray,
        password: ['', [Validators.required, Validators.minLength(8)]],
        confPassword: ['', [Validators.required, Validators.minLength(8)]]
      },
      { validators: this.passwordMatchValidator.bind(this) }
    );

    // Live validation trigger
    this.registrationForm.get('confPassword')?.valueChanges.subscribe(() => {
      this.registrationForm.updateValueAndValidity({ onlySelf: true });
    });

    // Subscribe to vehicle types changes to update validation
    this.registrationForm.get('vehicleTypes')?.valueChanges.subscribe(() => {
      this.registrationForm.get('vehicleTypes')?.updateValueAndValidity({ onlySelf: true });
    });
  }

  // Get the vehicle types form array
  get vehicleTypesFormArray(): FormArray {
    return this.registrationForm.get('vehicleTypes') as FormArray;
  }


  onSubmitData() {
    if (this.registrationForm.valid) {
      console.log("onSubmitData() .......called..!!!!!");
      
      // Get selected vehicle types
      const selectedVehicleTypes = this.vehicleTypesFormArray.value
        .map((selected: boolean, index: number) => selected ? this.vehicleTypeOptions[index].label : null)
        .filter((v: string | null) => v !== null)
        .join(', ');

      // Create form data with converted vehicle types
      const formData = {
        ...this.registrationForm.value,
        vehicleTypes: selectedVehicleTypes
      };

      console.log("Form Value:", formData);

      // Send to service
      this.sellerService.registerUser(formData).subscribe({
        next: (data: any) => {
          console.log('Success:', data);
          if (data.success) {
            if (data.message === "Registration successful") {
              this.successMsg = "Your seller account has been created successfully.Please log in to continue.";
            } else {
              this.successMsg = "User Already Present. Please log in to continue.";
            }
            this.showSuccessModal = true;
          }
        },
        error: (err: any) => {
          console.error('Error:', err);
        }
      });
    } else {
      console.log("=========== Form is Not Valid ===========");
      console.log("Form Errors:", this.registrationForm.errors);
      // Log individual control errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control?.errors) {
          console.log(`${key} errors:`, control.errors);
        }
      });
    }
  }


  goToSellerLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/seller-login']);
  }

}
