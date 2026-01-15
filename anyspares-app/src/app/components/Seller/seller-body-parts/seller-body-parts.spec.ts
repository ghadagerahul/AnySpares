import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBodyParts } from './seller-body-parts';

describe('SellerBodyParts', () => {
  let component: SellerBodyParts;
  let fixture: ComponentFixture<SellerBodyParts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerBodyParts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerBodyParts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
