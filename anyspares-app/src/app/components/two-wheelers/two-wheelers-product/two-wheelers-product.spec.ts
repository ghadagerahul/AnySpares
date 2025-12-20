import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWheelersProduct } from './two-wheelers-product';

describe('TwoWheelersProduct', () => {
  let component: TwoWheelersProduct;
  let fixture: ComponentFixture<TwoWheelersProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoWheelersProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoWheelersProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
