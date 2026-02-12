import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWheelerProductDetails } from './two-wheeler-product-details';

describe('TwoWheelerProductDetails', () => {
  let component: TwoWheelerProductDetails;
  let fixture: ComponentFixture<TwoWheelerProductDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoWheelerProductDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoWheelerProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
