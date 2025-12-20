import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct {

  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  brands = ['Honda', 'Yamaha', 'Bajaj', 'TVS'];
  models = ['Activa', 'Shine', 'R15', 'Pulsar', 'Apache'];
  categories = ['Engine Parts', 'Brakes', 'Electrical', 'Suspension'];

  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['Brake Pad Set - Honda Activa'],
      brand: ['Honda'],
      model: ['Activa'],
      category: ['Engine Parts'],
      type: ['OEM'],
      mrp: [1200],
      price: [899],
      stock: [25],
      minQty: [1],
      description: ['High quality OEM brake pad set for Honda Activa'],
      compatibleModels: [['Activa']],
      warranty: [true]
    });
  }

  onFilesSelected(event: any) {
    console.log('Selected files:', event.target.files);
  }

  updateProduct() {
    console.log('Update product', this.productForm.value);
  }

  saveDraft() {
    console.log('Save as draft', this.productForm.value);
  }

  cancel() {
    console.log('Cancel edit');
  }

  goBack() {
    this.location.back();
  }

}
