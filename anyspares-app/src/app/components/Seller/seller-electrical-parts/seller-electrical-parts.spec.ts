import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerElectricalParts } from './seller-electrical-parts';

describe('SellerElectricalParts', () => {
  let component: SellerElectricalParts;
  let fixture: ComponentFixture<SellerElectricalParts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerElectricalParts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerElectricalParts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
