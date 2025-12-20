import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {


  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  brands = ['Honda', 'Yamaha', 'Bajaj', 'TVS'];
  models = ['Activa', 'Shine', 'R15', 'Pulsar', 'Apache'];
  categories = ['Engine Parts', 'Brakes', 'Electrical', 'Suspension'];

  productForm: FormGroup;

  constructor(private fb: FormBuilder, private location: Location) {
    this.productForm = this.fb.group({
      name: [''],
      brand: [''],
      model: [''],
      category: [''],
      type: ['OEM'],
      mrp: [0],
      price: [0],
      stock: [0],
      minQty: [1],
      description: [''],
      compatibleModels: [[]],
      warranty: [false]
    });
  }

  onFilesSelected(event: any) {
    console.log(event.target.files);
  }

  publish() {
    console.log('Publish', this.productForm.value);
  }

  saveDraft() {
    console.log('Save Draft', this.productForm.value);
  }

  cancel() {
    console.log('Cancel');
  }
  goBack() {
    this.location.back(); // 👈 navigates back in history
  }

}
