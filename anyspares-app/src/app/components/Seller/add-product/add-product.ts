import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoWheelerProductService } from '../../../services/Seller/twowheeler-product.service';
import { AppConstants } from '../../../services/appconstants';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef;

  sellerName = '';
  storeName = '';
  avtarName = '';
  sellerId: string | null = null;

  brands: string[] = [];
  models: string[] = [];
  categories: string[] = [];

  productForm!: FormGroup;
  submittedData: any = null;
  selectedFiles: File[] = [];
  filePreviewUrls: string[] = [];
  submitted = false;
  isLoading = false;
  discountPercent: number | null = null;
  profit: number | null = null;

  private destroy$ = new Subject<void>();

  // convenience getter for template access
  get f() { return this.productForm.controls; }

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

  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private sellerProductService: TwoWheelerProductService,
    private appConstants: AppConstants,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.initializeSessionData();
    this.initializeForm();
    this.setupDynamicValidators();
    this.setupLiveCalculations();
    this.loadFormData();
  }

  private initializeSessionData(): void {
    this.sellerName = sessionStorage.getItem('sellerName') || '';
    this.storeName = sessionStorage.getItem('businesstName') || '';
    this.sellerId = sessionStorage.getItem('sellerId') || sessionStorage.getItem('seller_id');
    this.avtarName = this.getAvatarName(this.sellerName);
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
        status: ['Draft'],
        type: ['OEM', Validators.required],
        mrp: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(1)]],
        stock: ['', [Validators.required, Validators.min(1)]],
        minQty: ['', [Validators.required, Validators.min(1)]],
        description: ['', Validators.required],
        compatibleModels: [[]],
        warranty: [false]
      },
      { validators: this.priceLtOrEqMrpValidator }
    );
  }

  getAvatarName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return parts.length === 1 ? parts[0][0].toUpperCase() : '';
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

  private setupLiveCalculations(): void {
    const mrpControl = this.productForm.get('mrp');
    const priceControl = this.productForm.get('price');
    const stockControl = this.productForm.get('stock');
    const minQtyControl = this.productForm.get('minQty');

    if (mrpControl && priceControl) {
      mrpControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        const mrp = this.parseNumber(mrpControl.value);
        const price = this.parseNumber(priceControl.value);
        if (mrp !== null && price !== null && mrp > 0) {
          this.discountPercent = Math.round(((mrp - price) / mrp) * 100);
          this.profit = Math.round((price - (mrp - price)) * 100) / 100;
        } else {
          this.discountPercent = null;
          this.profit = null;
        }
        // re-evaluate cross-field validator
        this.productForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      });

      priceControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        const mrp = this.parseNumber(mrpControl.value);
        const price = this.parseNumber(priceControl.value);
        if (mrp !== null && price !== null && mrp > 0) {
          this.discountPercent = Math.round(((mrp - price) / mrp) * 100);
          this.profit = Math.round((price - (mrp - price)) * 100) / 100;
        } else {
          this.discountPercent = null;
          this.profit = null;
        }
        // if price > mrp, set control error for immediate feedback
        if (mrp !== null && price !== null && price > mrp) {
          priceControl.setErrors({ priceGtMrp: true });
        } else {
          const errors = priceControl.errors;
          if (errors) {
            delete errors['priceGtMrp'];
            if (Object.keys(errors).length === 0) {
              priceControl.setErrors(null);
            } else {
              priceControl.setErrors(errors);
            }
          }
        }
        this.productForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      });
    }

    if (stockControl && minQtyControl) {
      minQtyControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        const stock = this.parseNumber(stockControl.value);
        const minQty = this.parseNumber(minQtyControl.value);
        if (stock !== null && minQty !== null && minQty > stock) {
          minQtyControl.setErrors({ minQtyGtStock: true });
        } else {
          const errors = minQtyControl.errors;
          if (errors) {
            delete errors['minQtyGtStock'];
            if (Object.keys(errors).length === 0) {
              minQtyControl.setErrors(null);
            } else {
              minQtyControl.setErrors(errors);
            }
          }
        }
      });

      stockControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        const stock = this.parseNumber(stockControl.value);
        const minQty = this.parseNumber(minQtyControl.value);
        if (stock !== null && minQty !== null && minQty > stock) {
          minQtyControl.setErrors({ minQtyGtStock: true });
        } else {
          const errors = minQtyControl.errors;
          if (errors) {
            delete errors['minQtyGtStock'];
            if (Object.keys(errors).length === 0) {
              minQtyControl.setErrors(null);
            } else {
              minQtyControl.setErrors(errors);
            }
          }
        }
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

  publish(): void {
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

    // Call addProduct endpoint (not updateProduct)
    this.sellerProductService.addProduct(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.isLoading = false;
          console.log('Product submission response:', res);
          if (res?.success) {
            alert(`Product ${status === 'Draft' ? 'saved as draft' : 'added'} successfully!`);
            this.submitted = false;
            this.resetForm();
            this.goBack();
          } else {
            alert(res?.message || `Failed to ${status === 'Draft' ? 'save draft' : 'add'} product`);
            this.submitted = false;
          }
        },
        error: err => {
          this.isLoading = false;
          console.error('Submit failed:', err);
          console.error('Error details:', err.error || err.message);
          alert(`Failed to ${status === 'Draft' ? 'save draft' : 'add'} product. Please try again.`);
          this.submitted = false;
        }
      });
  }

  private prepareFormData(status: string): FormData {
    const fv = { ...this.productForm.value };

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

    // Set status and seller info
    fv.status = status;
    if (this.sellerId) {
      fv.sellerId = this.sellerId;
    }

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

    // Append image files as "images" part
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file: File) => {
        formData.append('images', file, file.name);
      });
    }

    return formData;
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

  cancel(): void {
    if (this.productForm.dirty) {
      if (confirm('Are you sure you want to discard changes?')) {
        this.resetForm();
      }
    } else {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.productForm.reset();
    this.submitted = false;
    this.clearSelectedFiles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.revokeOldPreviews();
  }

  goBack(): void {
    this.location.back();
  }

  addVehicleBrand(): void {
    this.router.navigate(['/seller-vehicle-brands']);
  }

  addVehicleModel(): void {
    this.router.navigate(['/seller-add-model']);
  }

}



