import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SellerVehicleService } from '../../../services/Seller/seller-vehicle.service';
import { ConfirmDialogComponent } from '../Models/confirm-dialog-component/confirm-dialog-component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-add-vehicle-brands',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-vehicle-brands.html',
  styleUrl: './add-vehicle-brands.css',
})
export class AddVehicleBrands implements OnInit {
  brandForm!: FormGroup;
  submitted = false;
  selectedFileName = '';
  selectedImagePreview: string | ArrayBuffer | null = null;
  vehicleCategories = ['Two Wheeler', 'Four Wheeler', 'Three Wheeler', 'Heavy Vehicle'];

  constructor(private fb: FormBuilder, private vehicleService: SellerVehicleService, private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.brandForm = this.fb.group({
      brandName: ['', [Validators.required, Validators.minLength(3)]],
      vehicleCategory: ['', Validators.required],
      brandImage: [null, Validators.required],
    });
  }

  get f() {
    return this.brandForm.controls;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      this.selectedFileName = file.name;
      this.brandForm.patchValue({ brandImage: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addBrand(): void {
    this.submitted = true;
    if (this.brandForm.invalid) {
      console.log('Form is invalid. Please fill all required fields.');
      return;
    }

    const formData = this.brandForm.value;
    const apiPayload = new FormData();
    apiPayload.append('brandName', formData.brandName.trim());
    apiPayload.append('vehicleCategory', formData.vehicleCategory);
    if (formData.brandImage) {
      apiPayload.append('brandImage', formData.brandImage);
    }




    console.log('API Payload ready to send to backend:');
    for (let [key, value] of apiPayload.entries()) {
      console.log(`${key}:`, value);
    }

    this.vehicleService.addVehicleBrand(apiPayload).subscribe(
      (response: any) => {
        console.log('Brand added successfully:', response);
        if (response && !response.success && response.message === 'Details already exists') {
        //   alert('Brand already exists!');
        // } else if (response && response.success) {

          this.dialog.open(ConfirmDialogComponent, {
            data: { 
              title: 'Success', 
              message: 'Brand added successfully!',
              confirmBtnText: 'Add Model',
              cancelBtnText: 'Cancel'
            }
          }).afterClosed().subscribe((result: any) => {
            if (result) {
              this.goToAddModelComponent();
            } else {
              this.resetForm();
            }
          });
        }
      },
      (error) => {
        console.error('Error adding brand:', error);
      }
    );

  }

  goToAddModelComponent(): void {
    window.location.href = '/seller-add-model';
  }

  resetForm(): void {
    this.brandForm.reset();
    this.submitted = false;
    this.selectedFileName = '';
    this.selectedImagePreview = null;
  }

  cancel(): void {
    this.resetForm();
    console.log('Brand addition cancelled');
  }
}
