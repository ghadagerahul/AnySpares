import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCategoryParts } from './seller-category-parts';

describe('SellerCategoryParts', () => {
  let component: SellerCategoryParts;
  let fixture: ComponentFixture<SellerCategoryParts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerCategoryParts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerCategoryParts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
