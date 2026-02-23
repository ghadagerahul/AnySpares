import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SellerVehicleService } from '../../../services/Seller/seller-vehicle.service';
import { ConfirmDialogComponent } from '../Models/confirm-dialog-component/confirm-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vehicle-models',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-vehicle-models.html',
  styleUrl: './add-vehicle-models.css',
})
export class AddVehicleModels implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  modelForm!: FormGroup;
  submitted = false;
  selectedFileName = '';
  selectedImagePreview: string | ArrayBuffer | null = null;
  vehicleBrands: string[] = [];
  vehicleCategories = ['Two Wheeler', 'Four Wheeler', 'Three Wheeler', 'Heavy Vehicle'];
  modelYears: number[] = [];
  brandDetails: any[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: SellerVehicleService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadVehicleBrands();
    this.generateModelYears();
  }

  initializeForm(): void {
    this.modelForm = this.fb.group({
      brandName: ['', Validators.required],
      vehicleCategory: ['', Validators.required],
      modelName: ['', [Validators.required, Validators.minLength(2)]],
      modelYearFrom: ['', Validators.required],
      modelYearTo: ['', Validators.required],
      modelImage: [null, Validators.required],
    });
  }

  get f() {
    return this.modelForm.controls;
  }

  loadVehicleBrands(): void {
    this.vehicleService.getVehicleBrands().subscribe(
      (response: any) => {
        if (response && response.success && response.data) {
          this.brandDetails = response.data;
          this.vehicleBrands = response.data.map((brand: any) => brand.brandName);
        }
      },
      (error: any) => {
        console.error('Error loading vehicle brands:', error);
        alert('Error loading vehicle brands. Please try again.');
      }
    );
  }

  generateModelYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
      this.modelYears.push(year);
    }
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
      this.modelForm.patchValue({ modelImage: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addModel(): void {
    this.submitted = true;
    if (this.modelForm.invalid) {
      console.log('Form is invalid. Please fill all required fields.');
      return;
    }


    const formData = this.modelForm.value;
    const apiPayload = new FormData();

    this.brandDetails.forEach(brand => {
      if (brand.brandName === formData.brandName) {
        apiPayload.append('brandId', brand.vid);
      }
    });

    apiPayload.append('brandName', formData.brandName.trim());
    apiPayload.append('vehicleCategory', formData.vehicleCategory);
    apiPayload.append('modelName', formData.modelName.trim());
    apiPayload.append('modelYearFrom', formData.modelYearFrom);
    apiPayload.append('modelYearTo', formData.modelYearTo);
    if (formData.modelImage) {
      apiPayload.append('modelImage', formData.modelImage);
    }

    console.log('API Payload ready to send to backend:');
    for (let [key, value] of apiPayload.entries()) {
      console.log(`${key}:`, value);
    }

    this.vehicleService.addVehicleModel(apiPayload).subscribe(
      (response: any) => {
        console.log('Model added successfully:', response);
        if (response && response.success) {
          this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
              title: 'Success',
              message: 'Model added successfully!',
              confirmBtnText: 'Add Another',
              cancelBtnText: 'Done'
            }
          }).afterClosed().subscribe((result: any) => {
            if (result) {
              this.resetForm();
            } else {
              this.goToSellerAddProduct();
            }
          });
        } else if (response && !response.success && response.message === 'Details already exists') {
          alert('Model already exists for this brand!');
        }
      },
      (error) => {
        console.error('Error adding model:', error);
        alert('Error adding model. Please try again.');
      }
    );
  }

  goToSellerAddProduct(): void {
    this.router.navigate(['/seller-addproduct']);
  }

  resetForm(): void {
    this.modelForm.reset();
    this.submitted = false;
    this.selectedFileName = '';
    this.selectedImagePreview = null;
  }

  onChangeImage() {
    this.selectedFileName = '';
    this.selectedImagePreview = null;
  }

  cancel(): void {
    this.resetForm();
    this.router.navigate(['/seller-dashboard']);
  }
}
