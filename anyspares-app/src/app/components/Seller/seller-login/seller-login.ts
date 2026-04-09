import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Constants } from '../../../Constants/Constants';

@Component({
  selector: 'app-seller-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './seller-login.html',
  styleUrl: './seller-login.css'
})
export class SellerLoginComponent implements OnInit {
  loginForm!: FormGroup;

  invalidCred: boolean = false;
  loginDataNew: { emailId: string; mobileNo: any; password: any; userType: string; } | undefined;



  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) { }


  ngOnInit(): void {

    this.loginForm = this.fb.group(
      {
        emailId: [''],
        mobileNo: ['9370005745', [Validators.required, Validators.minLength(10)]],
        password: ['Rahul@1212', [Validators.required, Validators.minLength(5)]],
        userType: [Constants.USER_SELLER]
      }
    )
    this.invalidCred = false;
  }




  loginAsSeller() {

    console.log("this.loginForm.value: " + this.loginForm.value.mobileNo);
    console.log("this.loginForm.value: " + this.loginForm.value.password);

    this.loginDataNew = {
      emailId: '',
      mobileNo: this.loginForm.value.mobileNo,
      password: this.loginForm.value.password,
      userType: Constants.USER_SELLER
    };

    this.authService.LoginUserToPortal(this.loginDataNew).subscribe({
      next: (res: any) => {

        if (res.success) {
          sessionStorage.setItem('sellerName', res.user.ownerName);
          sessionStorage.setItem('businesstName', res.user.businesstName);
          this.router.navigate(['/seller-dashboard']);

          this.loginForm.reset();

        } else if (!res.success && res.message === "Seller Login failed") {

          this.invalidCred = true;

        }

      },
    })

  }


  forgotPassword() {
    console.log("forgot password called..!!!");

  }

}
