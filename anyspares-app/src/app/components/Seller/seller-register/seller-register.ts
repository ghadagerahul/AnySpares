import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  passwordMatchValidator: any;

  constructor(private router: Router, private fb: FormBuilder, private sellerService: SellerService) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        businesstName: ['', [Validators.required, Validators.minLength(3)]],
        ownerName: [''],
        mobileNo: ['', [Validators.required, Validators.minLength(10)]],

        emailAddress: ['', [Validators.required, Validators.email]],
        gstNumber: [''],

        completeAddress: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(5)]],
        pincode: ['', [Validators.required, Validators.minLength(5)]],

        vehicleType: ['', [Validators.required, Validators.minLength(5)]],
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


  onSubmitData() {
    if (this.registrationForm.valid) {
      console.log("onSubmitData() .......called..!!!!!");
      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.businesstName);
      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.ownerName);

      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.mobileNo);

      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.emailAddress);

      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.gstNumber);

      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.completeAddress);

      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.city);
      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.pincode);

      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.vehicleType);

      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.password);

      console.log("this.registrationForm.controls['businesstName']: " + this.registrationForm.value.confPassword);


      //demo method
      this.sellerService.registerUser(this.registrationForm.value).subscribe({
        next: (data: any) => {
          console.log('Success:', data);
          if (data.success) {
            this.showSuccessModal = true;
          }
          this.registrationForm.reset();
        },
        error: (err: any) => {
          console.error('Error:', err);
        }
      });
    } else {
      console.log("=========== Form is Not Valid ===========");
    }
  }




  goToSellerLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/seller-login']);
  }

}
