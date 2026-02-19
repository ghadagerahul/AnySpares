import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleProducts } from './vehicle-products';

describe('VehicleProducts', () => {
  let component: VehicleProducts;
  let fixture: ComponentFixture<VehicleProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
