import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService, ContactDetails } from '../../../services/checkout.service';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css'
})
export class ContactDetailsComponent implements OnInit {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const currentContact = this.checkoutService.getCheckoutData().contact;
    if (currentContact) {
      this.contactForm.patchValue(currentContact);
    } else {
      // Pre-fill with user data if available
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      if (userName) this.contactForm.patchValue({ name: userName });
      if (userEmail) this.contactForm.patchValue({ email: userEmail });
    }

    // Auto-save on form changes
    this.contactForm.valueChanges.subscribe(value => {
      if (this.contactForm.valid) {
        this.checkoutService.setContact(value);
      }
    });
  }

  onContactFormSubmit(): void {
    if (this.contactForm.valid) {
      const contact: ContactDetails = this.contactForm.value;
      this.checkoutService.setContact(contact);
    }
  }

  isFormValid(): boolean {
    return this.contactForm.valid;
  }
}