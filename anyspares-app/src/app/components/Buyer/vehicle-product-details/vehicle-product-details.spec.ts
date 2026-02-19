import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleProductDetails } from './vehicle-product-details';

describe('VehicleProductDetails', () => {
  let component: VehicleProductDetails;
  let fixture: ComponentFixture<VehicleProductDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleProductDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
