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
  isLoading: boolean = false;
  isSaving: boolean = false;

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
  }

  loadSavedAddresses(): void {
    this.isLoading = true;
    this.checkoutService.getUserAddresses().subscribe({
      next: (response) => {
        if (response.success) {
          this.savedAddresses = response.data || [];
          // Check if there's a current address from checkout data and it's in the list
          const currentAddress = this.checkoutService.getCheckoutData().address;
          if (currentAddress && currentAddress.id && this.savedAddresses.some(addr => addr.id === currentAddress.id)) {
            this.selectAddress(currentAddress);
          } else if (!this.selectedAddressId && this.savedAddresses.length > 0) {
            // Auto-select logic: default first, or first if only one
            const defaultAddress = this.savedAddresses.find(addr => addr.isDefault);
            if (defaultAddress) {
              this.selectAddress(defaultAddress);
            } else if (this.savedAddresses.length === 1) {
              this.selectAddress(this.savedAddresses[0]);
            }
          }
        } else {
          this.savedAddresses = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.savedAddresses = [];
        this.isLoading = false;
        alert('No Addresses found. Please add a new address to proceed with checkout.');
      }
    });
  }

  selectAddress(address: Address): void {
    this.selectedAddressId = address.id || '';
    this.addressForm.patchValue(address);
    this.checkoutService.setAddress(address);
  }

  onAddressFormSubmit(): void {
    console.log('Submitting address form with value:', this.addressForm.value);
    console.log('Selected Address ID:', this.selectedAddressId);
    if (this.addressForm.valid) {
      this.isSaving = true;
      const addressData: Address = {
        ...this.addressForm.value,
        id: this.selectedAddressId || undefined
      };

      // For updates, set the address as default
      if (this.selectedAddressId) {
        addressData.isDefault = true;
      }

      const operation = this.selectedAddressId
        ? this.checkoutService.updateAddress(this.selectedAddressId, addressData)
        : this.checkoutService.saveAddress(addressData);

      operation.subscribe({
        next: (response) => {
          if (response.success) {
            const savedAddress = response.data;
            if (savedAddress?.id) {
              this.selectedAddressId = savedAddress.id;
            }
            this.checkoutService.setAddress(savedAddress || addressData);
            this.loadSavedAddresses(); // Refresh the list
            if (!this.selectedAddressId) {
              this.addressForm.reset();
            } else {
              this.addressForm.markAsPristine();
            }
          } else {
            alert('Failed to save address. Please try again.');
          }
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error saving address:', error);
          this.isSaving = false;
          alert('Failed to save address. Please check your connection and try again.');
        }
      });
    }
  }

  private saveToLocalStorage(address: Address): void {
    const addressWithId = {
      ...address,
      id: address.id || `addr_${Date.now()}`
    };
    this.savedAddresses.push(addressWithId);
    localStorage.setItem('savedAddresses', JSON.stringify(this.savedAddresses));
    this.checkoutService.setAddress(addressWithId);
  }

  addNewAddress(): void {
    this.selectedAddressId = '';
    this.addressForm.reset();
  }

  deleteAddress(addressId: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.checkoutService.deleteAddress(addressId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadSavedAddresses();
            if (this.selectedAddressId === addressId) {
              this.selectedAddressId = '';
              this.addressForm.reset();
            }
          } else {
            alert('Failed to delete address. Please try again.');
          }
        },
        error: (error) => {
          console.error('Error deleting address:', error);
          alert('Failed to delete address. Please check your connection and try again.');
        }
      });
    }
  }

  isFormValid(): boolean {
    return this.addressForm.valid && !this.isSaving;
  }
}