import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoWheelerProductService } from '../../../services/Seller/twowheeler-product.service';
import { AppConstants } from '../../../services/appconstants';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit, OnDestroy {

  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

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

  constructor(private fb: FormBuilder, private location: Location, private sellerProductService: TwoWheelerProductService, private appConstants: AppConstants) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
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
  }


  ngOnInit(): void {
    console.log('AddProduct component initialized');
    this.appConstants.isLoaded().subscribe(isLoaded => {
      if (isLoaded) {
        this.brands = this.appConstants.brands;
        this.models = this.appConstants.models;
        this.categories = this.appConstants.categories;
        console.log('Loaded options:', { brands: this.brands, models: this.models, categories: this.categories });
      }
    });
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
    this.productForm.value.status = 'Active';

    console.log('Publishing product', this.productForm.value);
    const fv = this.productForm.value;
    const formData = new FormData();

    // append form fields
    Object.keys(fv).forEach(key => {
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
      },
      error: (err) => {
        console.error('Add product failed', err);
      }
    });

    this.productForm.reset();
    this.submitted = false;


  }

  saveDraft() {
    console.log('Save Draft', this.productForm.value);
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

}
