import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Constants } from '../../../Constants/Constants';
import { RegistrationRequest } from '../../shared/registration-request.model';

@Component({
  selector: 'app-seller-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './seller-register.html',
  styleUrls: ['./seller-register.css']
})
export class SellerRegisterComponent implements OnInit {

  registrationForm!: FormGroup;
  showSuccessModal = false;
  successMsg: string | undefined;
  vehicleTypeOptions = [
    { id: 'twoWheeler', label: 'Two Wheeler' },
    { id: 'threeWheeler', label: 'Three Wheeler' },
    { id: 'fourWheeler', label: 'Four Wheeler' },
    { id: 'heavyVehicle', label: 'Heavy Vehicle' }
  ];

  registrationFormNew!: RegistrationRequest;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) { }

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
        businessName: ['', [Validators.required, Validators.minLength(3)]],
        ownerName: ['', [Validators.required, Validators.minLength(3)]],
        mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

        email: ['', [Validators.required, Validators.email]],
        gstNumber: [''],

        completeAddress: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(3)]],
        pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)]],

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
  }

  // Get the vehicle types form array
  get vehicleTypesFormArray(): FormArray<FormControl<boolean>> {
    return this.registrationForm.get('vehicleTypes') as FormArray<FormControl<boolean>>;
  }


  onSubmitData() {
    if (this.registrationForm.valid) {
      console.log("onSubmitData() .......called..!!!!!");



      const selectedVehicleTypes = this.vehicleTypesFormArray.value
        .map((selected: boolean, index: number) => selected ? this.vehicleTypeOptions[index].label : null)
        .filter((value: string | null): value is string => value !== null);

      this.registrationFormNew = {
        firstName: Constants.Empty_STRING,
        lastName: Constants.Empty_STRING,
        userName: Constants.Empty_STRING,

        businessName: this.registrationForm.value.businessName,
        ownerName: this.registrationForm.value.ownerName,
        mobileNo: Number(this.registrationForm.value.mobileNo),
        email: this.registrationForm.value.email,
        gstNumber: this.registrationForm.value.gstNumber,
        completeAddress: this.registrationForm.value.completeAddress,
        city: this.registrationForm.value.city,
        pincode: Number(this.registrationForm.value.pincode),
        vehicleType: selectedVehicleTypes,
        password: this.registrationForm.value.password,
        confPassword: this.registrationForm.value.confPassword,
        userType: Constants.USER_SELLER
      };


      // Send to service
      this.authService.registerUser(this.registrationFormNew).subscribe({
        next: (data: any) => {
          console.log('Success:', data);
          if (data.success) {
            if (data.message === "Registration successful") {
              this.successMsg = "Your seller account has been created successfully. Please log in to continue.";
            } else {
              this.successMsg = "User already exists. Please log in to continue.";
            }
            this.showSuccessModal = true;
          }
        },
        error: (err: any) => {
          console.error('Error:', err);
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
      this.registrationForm.get('vehicleTypes')?.markAllAsTouched();
      console.log("=========== Form is Not Valid ===========");
      console.log("Form Errors:", this.registrationForm.errors);
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
