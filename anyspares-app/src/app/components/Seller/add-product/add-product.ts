import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoWheelerProductService } from '../../../services/Seller/twowheeler-product.service';
import { AppConstants } from '../../../services/appconstants';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit, OnDestroy {


  sellerName = '';
  storeName = '';
  avtarName = '';

  // brands = ['Honda', 'Yamaha', 'Bajaj', 'TVS'];
  // models = ['Activa', 'Shine', 'R15', 'Pulsar', 'Apache'];
  // categories = ['Engine Parts', 'Brakes', 'Electrical', 'Suspension'];

  brands: string[] = [];
  models: string[] = []
  categories: string[] = [];


  productForm: FormGroup;
  submittedData: any = null;
  selectedFiles: File[] = [];
  filePreviewUrls: string[] = [];
  submitted = false;


  // convenience getter for template access
  get f() { return this.productForm.controls; }

  // cross-field validator to ensure price <= mrp
  priceLtOrEqMrpValidator = (group: FormGroup) => {
    const mrp = group.get('mrp')?.value;
    const price = group.get('price')?.value;
    if (mrp == null || price == null) return null;
    return (price > mrp) ? { priceGtMrp: true } : null;
  };

  constructor(private fb: FormBuilder, private location: Location, private sellerProductService: TwoWheelerProductService, private appConstants: AppConstants, private router: Router) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', Validators.required],
      brandOther: [''],
      model: ['', Validators.required],
      modelOther: [''],
      category: ['', Validators.required],
      status: [''],
      type: ['OEM', Validators.required],
      mrp: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      minQty: [1, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      compatibleModels: [[]],
      warranty: [false],
      images: [[]]
    }, { validators: this.priceLtOrEqMrpValidator });

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
  }


  ngOnInit(): void {
    console.log('AddProduct component initialized');


    this.sellerName = sessionStorage.getItem('sellerName') || '';
    this.storeName = sessionStorage.getItem('businesstName') || '';
    this.avtarName = this.getAvatarName(this.sellerName);

    // this.appConstants.isLoaded().subscribe(isLoaded => {
    //   if (isLoaded) {
    //     this.brands = this.appConstants.brands;
    //     this.models = this.appConstants.models;
    //     //this.categories = this.appConstants.categories;
    //     this.sellerProductService.fetchFormLoadDataList().subscribe(res => {
    //       console.log('Fetched categories from service:', res);
    //       this.categories = res.data?.category || this.categories;
    //       this.brands = res.data?.brands || this.brands;
    //       this.models = res.data?.models || this.models;
    //     });
    //     console.log('Loaded options:', { brands: this.brands, models: this.models, categories: this.categories });
    //   }
    // });

    this.sellerProductService.fetchFormLoadDataList().subscribe(res => {
      console.log('Fetched categories from service:', res);
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
    // keep files in the form value (useful for uploads)
    this.productForm.patchValue({ images: this.selectedFiles });
    // reset input value so same file can be reselected if needed
    event.target.value = '';
  }

  publish() {
    this.submitted = true;

    if (this.productForm.invalid) {
      // show validation messages
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

    console.log('Publishing product', formValue);
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

    // append selected image files (field name 'images' - backend should accept this)
    this.selectedFiles.forEach(f => formData.append('images', f, f.name));

    // send to backend
    this.sellerProductService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Product added', res);
        this.submittedData = res;
        alert('Product published successfully!');
        this.productForm.reset();
        this.submitted = false;
        this.goBack();
      },
      error: (err) => {
        console.error('Add product failed', err);
        alert('Failed to publish product. Please try again.');
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

    // send to backend - same endpoint as publish but with Draft status
    this.sellerProductService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Product draft saved', res);
        this.submittedData = res;
        alert('Product saved as Draft successfully!');
        this.goBack();
      },
      error: (err) => {
        console.error('Draft save failed', err);
        alert('Failed to save draft. Please try again.');
      }
    });
  }

  cancel() {
    console.log('Cancel');
    this.productForm.reset();
  }

  ngOnDestroy(): void {
    this.filePreviewUrls.forEach(u => URL.revokeObjectURL(u));
  }

  goBack() {
    //navigates back in history
    this.location.back();
  }

  addVehicleBrand() {
    this.router.navigate(['/seller-vehicle-brands']);
  }

  addVehicleModel(){
    this.router.navigate(['/seller-add-model']);
  }

}



