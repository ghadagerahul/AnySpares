import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoWheelerProductService } from '../../../services/Seller/twowheeler-product.service';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {

  sellerName = '';
  storeName = '';
  avtarName = '';

  brands: string[] = [];
  models: string[] = [];
  categories: string[] = [];

  productForm!: FormGroup;
  submitted = false;
  productId: any = null;
  selectedFiles: File[] = [];
  filePreviewUrls: string[] = [];

  // convenience getter for template access
  get f() { return this.productForm.controls; }

 

  constructor(private fb: FormBuilder, private location: Location, private sellerProductService: TwoWheelerProductService) { }

  ngOnInit(): void {

     this.sellerName = sessionStorage.getItem('sellerName') || '';
    this.storeName = sessionStorage.getItem('businesstName') || '';
    this.avtarName = this.getAvatarName(this.sellerName);

    // Get productId from query params
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get('productId');
    console.log('Editing product with ID:', this.productId);

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', Validators.required],
      brandOther: [''],
      model: ['', Validators.required],
      modelOther: [''],
      category: ['', Validators.required],
      type: ['', Validators.required],
      mrp: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      minQty: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      compatibleModels: [['']],
      warranty: [false],
      status: [''],
      images: [[]]
    }, { validators: this.priceLtOrEqMrpValidator });

     this.sellerProductService.fetchProductFromProductId(this.productId).subscribe(res => {
      console.log('Fetched product data:', res);
      this.productForm.patchValue(res.data);
    });

    // Add validators for brandOther and modelOther when their respective selects have 'other' value
    const brandControl = this.productForm.get('brand');
    const brandOtherControl = this.productForm.get('brandOther');
    if (brandControl && brandOtherControl) {
      brandControl.valueChanges.subscribe(value => {
        if (value === 'other') {
          brandOtherControl.setValidators([Validators.required]);
        } else {
          brandOtherControl.clearValidators();
          brandOtherControl.reset();
        }
        brandOtherControl.updateValueAndValidity();
      });
    }

    const modelControl = this.productForm.get('model');
    const modelOtherControl = this.productForm.get('modelOther');
    if (modelControl && modelOtherControl) {
      modelControl.valueChanges.subscribe(value => {
        if (value === 'other') {
          modelOtherControl.setValidators([Validators.required]);
        } else {
          modelOtherControl.clearValidators();
          modelOtherControl.reset();
        }
        modelOtherControl.updateValueAndValidity();
      });
    }

    // Load form data (brands, models, categories)
    this.sellerProductService.fetchFormLoadDataList().subscribe(res => {
      console.log('Fetched form data:', res);
      this.categories = res.data?.category || this.categories;
      this.brands = res.data?.brands || this.brands;
      this.models = res.data?.models || this.models;
    });
  }

  
   getAvatarName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return parts.length === 1 ? parts[0][0].toUpperCase() : '';
  }
   // cross-field validator to ensure price <= mrp
  priceLtOrEqMrpValidator = (group: FormGroup) => {
    const mrp = group.get('mrp')?.value;
    const price = group.get('price')?.value;
    if (mrp == null || price == null) return null;
    return (price > mrp) ? { priceGtMrp: true } : null;
  };

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) {
      this.selectedFiles = [];
      this.filePreviewUrls.forEach(u => URL.revokeObjectURL(u));
      this.filePreviewUrls = [];
      this.productForm.patchValue({ images: [] });
      return;
    }
    // convert FileList to Array and store
    this.selectedFiles = Array.from(files);
    // cleanup old previews and create new ones
    this.filePreviewUrls.forEach(u => URL.revokeObjectURL(u));
    this.filePreviewUrls = this.selectedFiles.map(f => URL.createObjectURL(f));
    // keep files in the form value
    this.productForm.patchValue({ images: this.selectedFiles });
    // reset input value
    event.target.value = '';
  }

  updateProduct() {
    this.submitted = true;

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      console.warn('Form invalid', this.productForm.errors);
      return;
    }

    // Replace 'other' with actual values from the "Other" input fields
    let formValue = this.productForm.value;
    if (formValue.brand === 'other' && formValue.brandOther) {
      formValue.brand = formValue.brandOther;
    }
    if (formValue.model === 'other' && formValue.modelOther) {
      formValue.model = formValue.modelOther;
    }

    formValue.status = 'Active';

    console.log('Updating product', formValue);
    const fv = formValue;
    const formData = new FormData();

    // append form fields
    Object.keys(fv).forEach(key => {
      // Skip the 'Other' input fields as they've been merged into brand/model
      if (key === 'brandOther' || key === 'modelOther') {
        return;
      }
      const val = fv[key];
      if (Array.isArray(val)) {
        val.forEach((v: any) => formData.append(key, typeof v === 'object' ? JSON.stringify(v) : v));
      } else if (val === null || val === undefined) {
        // skip null/undefined
      } else if (typeof val === 'object') {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, String(val));
      }
    });

    // append selected image files
    this.selectedFiles.forEach(f => formData.append('images', f, f.name));

    // send to backend
    this.sellerProductService.updateProduct(this.productId, formData).subscribe({
      next: (res: any) => {
        console.log('Product updated', res);
        alert('Product updated successfully!');
        this.productForm.reset();
        this.submitted = false;
        this.goBack();
      },
      error: (err: any) => {
        console.error('Update product failed', err);
        alert('Failed to update product. Please try again.');
        this.submitted = false;
      }
    });
  }

  saveDraft() {
    // No strict validation for drafts - allow partial forms
    let formValue = this.productForm.value;

    // Replace 'other' with actual values from the "Other" input fields
    if (formValue.brand === 'other' && formValue.brandOther) {
      formValue.brand = formValue.brandOther;
    }
    if (formValue.model === 'other' && formValue.modelOther) {
      formValue.model = formValue.modelOther;
    }

    formValue.status = 'Draft';

    console.log('Saving draft product', formValue);
    const fv = formValue;
    const formData = new FormData();

    // append form fields
    Object.keys(fv).forEach(key => {
      // Skip the 'Other' input fields as they've been merged into brand/model
      if (key === 'brandOther' || key === 'modelOther') {
        return;
      }
      const val = fv[key];
      if (Array.isArray(val)) {
        val.forEach((v: any) => formData.append(key, typeof v === 'object' ? JSON.stringify(v) : v));
      } else if (val === null || val === undefined) {
        // skip null/undefined
      } else if (typeof val === 'object') {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, String(val));
      }
    });

    // append selected image files
    this.selectedFiles.forEach(f => formData.append('images', f, f.name));

    // send to backend
    this.sellerProductService.updateProduct(this.productId, formData).subscribe({
      next: (res: any) => {
        console.log('Product draft saved', res);
        alert('Product saved as Draft successfully!');
        this.goBack();
      },
      error: (err: any) => {
        console.error('Draft save failed', err);
        alert('Failed to save draft. Please try again.');
      }
    });
  }

  cancel() {
    console.log('Cancel edit');
  }

  goBack() {
    this.location.back();
  }

}
