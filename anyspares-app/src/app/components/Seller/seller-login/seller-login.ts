import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SellerService } from '../../../services/app.sellerservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule,CommonModule ],
  templateUrl: './seller-login.html',
  styleUrl: './seller-login.css'
})
export class SellerLoginComponent implements OnInit {
  loginForm!: FormGroup;

invalidCred: boolean=false;



  constructor(private router: Router, private fb: FormBuilder, private sellerService: SellerService) { }


  ngOnInit(): void {

    this.loginForm = this.fb.group(
      {
        mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
        password: ['', [Validators.required, Validators.minLength(5)]]
      }
    )
    this.invalidCred = false;
  }




  loginAsSeller() {

    console.log("this.loginForm.value: " + this.loginForm.value.mobileNumber);
    console.log("this.loginForm.value: " + this.loginForm.value.password);



    this.sellerService.loginUser(this.loginForm.value).subscribe({
      next: (res: any) => {

        if (res.success) {

          this.router.navigate(['/seller-dashboard']);

          this.loginForm.reset();

        }else if(!res.success && res.message === "Seller Login failed"){

        this.invalidCred = true;

        }

      },
    })

  }


  forgotPassword() {
    console.log("forgot password called..!!!");

  }

}
