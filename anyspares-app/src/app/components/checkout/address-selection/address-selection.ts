import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService, Address } from '../../../services/checkout.service';

@Component({
  selector: 'app-address-selection',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-selection.html',
  styleUrl: './address-selection.css'
})
export class AddressSelectionComponent implements OnInit {
  addressForm: FormGroup;
  savedAddresses: Address[] = [];
  selectedAddressId: string = '';

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService
  ) {
    this.addressForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadSavedAddresses();
    const currentAddress = this.checkoutService.getCheckoutData().address;
    if (currentAddress) {
      this.addressForm.patchValue(currentAddress);
      this.selectedAddressId = currentAddress.id || '';
    }
  }

  loadSavedAddresses(): void {
    // Load from localStorage or service
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      this.savedAddresses = JSON.parse(saved);
    } else {
      // Add some dummy addresses for demo
      this.savedAddresses = [
        {
          id: '1',
          name: 'John Doe',
          phone: '9876543210',
          street: '123 Main Street, Sector 15',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001',
          isDefault: true
        },
        {
          id: '2',
          name: 'Jane Smith',
          phone: '9123456789',
          street: '456 Park Avenue, MG Road',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        }
      ];
      localStorage.setItem('savedAddresses', JSON.stringify(this.savedAddresses));
    }
  }

  selectAddress(address: Address): void {
    this.selectedAddressId = address.id || '';
    this.addressForm.patchValue(address);
    this.checkoutService.setAddress(address);
  }

  onAddressFormSubmit(): void {
    if (this.addressForm.valid) {
      const address: Address = {
        ...this.addressForm.value,
        id: this.selectedAddressId || `addr_${Date.now()}`
      };
      this.checkoutService.setAddress(address);

      // Save to saved addresses if not already saved
      if (!this.selectedAddressId) {
        this.savedAddresses.push(address);
        localStorage.setItem('savedAddresses', JSON.stringify(this.savedAddresses));
      }
    }
  }

  addNewAddress(): void {
    this.selectedAddressId = '';
    this.addressForm.reset();
  }

  isFormValid(): boolean {
    return this.addressForm.valid;
  }
}