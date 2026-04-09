import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoWheelerProductService } from '../../../services/Seller/twowheeler-product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef;

  sellerName = '';
  storeName = '';
  avtarName = '';

  brands: string[] = [];
  models: string[] = [];
  categories: string[] = [];

  productForm!: FormGroup;
  submitted = false;
  isLoading = false;
  productId: any = null;
  selectedFiles: File[] = [];
  filePreviewUrls: string[] = [];

  private destroy$ = new Subject<void>();
  vehicleType: string | null = "";

  // convenience getter for template access
  get f() { return this.productForm.controls; }

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private sellerProductService: TwoWheelerProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.vehicleType = this.route.snapshot.queryParamMap.get('vehicleType');
    console.log('###===|||||||||Vehicle Type on init:', this.vehicleType);
    this.initializeSessionData();
    this.initializeProductId();
    this.initializeForm();
    this.setupDynamicValidators();
    this.loadFormData();
    this.loadProductData();
  }

  private initializeSessionData(): void {
    this.sellerName = sessionStorage.getItem('sellerName') || '';
    this.storeName = sessionStorage.getItem('businesstName') || '';
    this.avtarName = this.getAvatarName(this.sellerName);
  }

  private initializeProductId(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get('productId');
    if (!this.productId) {
      console.error('No product ID provided');
      this.goBack();
    }
  }

  private initializeForm(): void {
    this.productForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        brand: ['', Validators.required],
        brandOther: [''],
        model: ['', Validators.required],
        modelOther: [''],
        category: ['', Validators.required],
        type: ['', Validators.required],
        mrp: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(1)]],
        stock: ['', [Validators.required, Validators.min(1)]],
        minQty: ['', [Validators.required, Validators.min(1)]],
        description: ['', Validators.required],
        compatibleModels: [[]],
        warranty: [false],
        status: ['']
      },
      { validators: this.priceLtOrEqMrpValidator }
    );
  }

  private setupDynamicValidators(): void {
    const brandControl = this.productForm.get('brand');
    const brandOtherControl = this.productForm.get('brandOther');

    if (brandControl && brandOtherControl) {
      brandControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
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
      modelControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
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

  private loadFormData(): void {
    this.sellerProductService.fetchFormLoadDataList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.categories = res.data?.category || [];
          this.brands = res.data?.brands || [];
          this.models = res.data?.models || [];
        },
        error: err => {
          console.error('Error loading form data:', err);
        }
      });
  }

  private loadProductData(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this.sellerProductService.fetchProductFromProductId(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if (res?.data) {
            const prodData = { ...res.data };

            // Ensure numeric fields are properly typed
            if (prodData.mrp != null) prodData.mrp = Number(prodData.mrp) || '';
            if (prodData.price != null) prodData.price = Number(prodData.price) || '';
            if (prodData.stock != null) prodData.stock = Number(prodData.stock) || '';
            if (prodData.minQty != null) prodData.minQty = Number(prodData.minQty) || '';

            this.productForm.reset();
            this.productForm.patchValue(prodData);
            this.productForm.updateValueAndValidity();
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('Error loading product:', err);
          alert('Failed to load product details');
          this.isLoading = false;
          this.goBack();
        }
      });
  }

  getAvatarName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return parts.length === 1 ? parts[0][0].toUpperCase() : '';
  }

  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  // cross-field validator to ensure price <= mrp
  priceLtOrEqMrpValidator = (group: FormGroup) => {
    const mrpControl = group.get('mrp');
    const priceControl = group.get('price');

    if (!mrpControl || !priceControl) return null;

    const mrp = this.parseNumber(mrpControl.value);
    const price = this.parseNumber(priceControl.value);

    if (mrp === null || price === null) return null;

    return price > mrp ? { priceGtMrp: true } : null;
  };

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) {
      this.clearSelectedFiles();
      return;
    }

    // Validate file count (max 5 images)
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!this.isValidImage(file)) {
        alert(`File ${file.name} is invalid. Only PNG, JPG up to 5MB allowed.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      this.clearSelectedFiles();
      return;
    }

    this.selectedFiles = validFiles;
    this.revokeOldPreviews();
    this.filePreviewUrls = this.selectedFiles.map(f => URL.createObjectURL(f));

    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private isValidImage(file: File): boolean {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  private revokeOldPreviews(): void {
    this.filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
  }

  private clearSelectedFiles(): void {
    this.selectedFiles = [];
    this.revokeOldPreviews();
    this.filePreviewUrls = [];
  }

  updateProduct(): void {
    this.submitForm('Active');
  }

  saveDraft(): void {
    this.submitForm('Draft');
  }

  private submitForm(status: string): void {
    this.submitted = true;

    // For Active (publish), require full form validation
    // For Draft, allow incomplete forms
    if (status === 'Active') {
      this.productForm.updateValueAndValidity();
      if (this.productForm.invalid) {
        this.productForm.markAllAsTouched();
        console.warn('Form errors:', this.productForm.errors);
        console.warn('Invalid controls:', this.getInvalidControls());
        return;
      }
    }

    this.isLoading = true;

    const formData = this.prepareFormData(status);

    console.log('Submitting product with status:', status);
    console.log('FormData entries:', Array.from(formData.entries()));

    this.sellerProductService.updateProduct(this.productId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.isLoading = false;
          console.log('Product submission response:', res);
          if (res?.success) {
            alert(`Product ${status === 'Draft' ? 'saved as draft' : 'updated'} successfully!`);
            this.submitted = false;
            this.goBack();
          } else {
            alert(res?.message || `Failed to ${status === 'Draft' ? 'save draft' : 'update'} product`);
            this.submitted = false;
          }
        },
        error: err => {
          this.isLoading = false;
          console.error('Submit failed:', err);
          console.error('Error details:', err.error || err.message);
          alert(`Failed to ${status === 'Draft' ? 'save draft' : 'update'} product. Please try again.`);
          this.submitted = false;
        }
      });
  }

  private prepareFormData(status: string): FormData {
    const fv = { ...this.productForm.value };
    console.log('||||Form values before processing:', this.vehicleType);
    fv.vehicleType = this.vehicleType;
    console.log('||||Form values after adding vehicleType:', fv.vehicleType);
    // Convert numeric fields to numbers
    fv.mrp = this.parseNumber(fv.mrp) || 0;
    fv.price = this.parseNumber(fv.price) || 0;
    fv.stock = this.parseNumber(fv.stock) || 0;
    fv.minQty = this.parseNumber(fv.minQty) || 0;

    // Normalize "other" fields
    fv.brand = fv.brand === 'other' && fv.brandOther ? fv.brandOther : fv.brand;
    fv.model = fv.model === 'other' && fv.modelOther ? fv.modelOther : fv.model;

    // Remove temporary fields
    delete fv.brandOther;
    delete fv.modelOther;

    // Set status
    fv.status = status;

    // Normalize compatibleModels if it's a string
    if (typeof fv.compatibleModels === 'string') {
      fv.compatibleModels = fv.compatibleModels
        .split('|')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }

    // Create FormData with proper structure matching backend
    const formData = new FormData();

    // Append product data as "product" part (JSON blob)
    console.log('Product data to send:', fv);
    formData.append(
      'product',
      new Blob([JSON.stringify(fv)], { type: 'application/json' })
    );

    // Append image files as "images" part (only if files selected)
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file: File) => {
        formData.append('images', file, file.name);
      });
    }

    return formData;
  }

  cancel(): void {
    if (this.productForm.dirty) {
      if (confirm('Are you sure you want to discard changes?')) {
        this.resetForm();
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  private resetForm(): void {
    this.productForm.reset();
    this.submitted = false;
    this.clearSelectedFiles();
  }

  private getInvalidControls(): string[] {
    const invalid: string[] = [];
    Object.keys(this.productForm.controls).forEach(key => {
      const ctrl = this.productForm.get(key);
      if (ctrl && ctrl.invalid) {
        invalid.push(`${key}: ${JSON.stringify(ctrl.errors)}`);
      }
    });
    return invalid;
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.revokeOldPreviews();
  }

}